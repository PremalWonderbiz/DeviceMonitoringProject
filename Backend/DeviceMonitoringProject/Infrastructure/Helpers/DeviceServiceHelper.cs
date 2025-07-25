﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json.Nodes;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Infrastructure.RealTime;
using Infrastructure.Services;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Text.Json.Serialization.Metadata;

namespace Infrastructure.Helpers
{
    public class DeviceServiceHelper : IDeviceServiceHelper
    {
        private readonly ILogger<DeviceService> _logger;
        private readonly IHubContext<DeviceHub> _hubContext;
        private readonly IDynamicDataHelper _dynamicDataHelper;

        public DeviceServiceHelper(ILogger<DeviceService> logger, IHubContext<DeviceHub> hubContext, IDynamicDataHelper dynamicDataHelper)
        {
            _logger = logger;
            _hubContext = hubContext;
            _dynamicDataHelper = dynamicDataHelper;
        }
        public TopLevelDeviceDataDto ExtractTopLevelDto(string macId, JsonNode rootNode)
        {
            return new TopLevelDeviceDataDto
            {
                DeviceMacId = macId,
                Status = rootNode["Status"]?.GetValue<string>() ?? "Unknown",
                Connectivity = rootNode["Connectivity"]?.GetValue<string>() ?? "Unknown"
            };
        }

        public DynamicDeviceDataDto ExtractDynamicDto(string macId, JsonNode rootNode)
        {
            return new DynamicDeviceDataDto
            {
                DeviceMacId = macId,
                DynamicProperties = JsonDocument.Parse(
                    rootNode["dynamicProperties"]!.ToJsonString()
                ).RootElement
            };
        }

        public async Task WriteJsonFileAsync(string path, JsonNode rootNode)
        {
            string json = rootNode.ToJsonString(new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                WriteIndented = true,
                TypeInfoResolver = new DefaultJsonTypeInfoResolver()
            });

            await File.WriteAllTextAsync(path, json);
        }

        public async Task BroadcastDeviceDetailUpdates(List<(string MacId, string EventName, JsonElement DetailPayload)> updates)
        {
            foreach (var (macId, eventName, payload) in updates)
            {
                var json = JsonSerializer.Serialize(payload, new JsonSerializerOptions
                {
                    Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                });

                await _hubContext.Clients.Group($"device-{macId}").SendAsync(eventName, json);
            }
        }

        public async Task BroadcastTopLevelSummary(List<(DeviceMetadata device, List<string> updatedFields)> allDevices)
        {
            var summary = allDevices.Select(entry =>
            {
                var d = entry.device;
                var updated = entry.updatedFields;

                var obj = new Dictionary<string, object?>
                            {
                                { "MacId", d.MacId },
                                { "LastUpdated", d.LastUpdated }
                            };

                if (updated.Contains("status"))
                    obj["Status"] = d.Status;

                if (updated.Contains("connectivity"))
                    obj["Connectivity"] = d.Connectivity;

                return obj;
            }).ToList();

            var json = JsonSerializer.Serialize(summary, new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                WriteIndented = true
            });

            await _hubContext.Clients.All.SendAsync("ReceiveUpdate", json);
        }

        public JsonNode UpdateDynamicProperties(JsonNode? currentData, JsonNode? dynamicObservables)
        {
            var original = currentData?.DeepClone() ?? new JsonObject();

            var result = _dynamicDataHelper.GenerateDynamicDataFromObservables(currentData, dynamicObservables);

            var diff = GetJsonDiff(original, result);
            return diff;
        }

        public static JsonNode? GetJsonDiff(JsonNode? original, JsonNode? updated)
        {
            if (original is JsonValue && updated is JsonValue)
            {
                return original.ToJsonString() == updated.ToJsonString() ? null : CloneNode(updated);
            }

            if (original is JsonObject origObj && updated is JsonObject updatedObj)
            {
                var diff = new JsonObject();

                foreach (var kvp in updatedObj)
                {
                    var origChild = origObj.ContainsKey(kvp.Key) ? origObj[kvp.Key] : null;
                    var updatedChild = kvp.Value;

                    var childDiff = GetJsonDiff(origChild, updatedChild);
                    if (childDiff != null)
                        diff[kvp.Key] = childDiff;
                }

                return diff.Count > 0 ? diff : null;
            }

            if (original is JsonArray origArray && updated is JsonArray updatedArray)
            {
                var arrayDiff = new JsonArray();
                bool hasChanges = false;

                int maxLength = Math.Max(origArray.Count, updatedArray.Count);
                for (int i = 0; i < maxLength; i++)
                {
                    JsonNode? origElem = i < origArray.Count ? origArray[i] : null;
                    JsonNode? updatedElem = i < updatedArray.Count ? updatedArray[i] : null;

                    var childDiff = GetJsonDiff(origElem, updatedElem);
                    
                    if (childDiff != null)
                    {
                        arrayDiff.Add(childDiff);
                        hasChanges = true;
                    }
                }

                return hasChanges ? arrayDiff : null;
            }

            return CloneNode(updated); // Types differ or null mismatch, treat as full change
        }

        private static JsonNode? CloneNode(JsonNode? node)
        {
            return node == null ? null : JsonNode.Parse(node.ToJsonString());
        }
    }
}
