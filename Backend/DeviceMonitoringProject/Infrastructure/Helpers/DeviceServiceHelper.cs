using System;
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
        public LiveDeviceDataDto ExtractLiveDataDto(DeviceMetadata device, JsonNode rootNode)
        {
            return new LiveDeviceDataDto
            {
                DeviceMacId = device.MacId,
                Status = rootNode["Status"]?.GetValue<string>() ?? "Unknown",
                Connectivity = rootNode["Connectivity"]?.GetValue<string>() ?? "Unknown",
                DynamicProperties = JsonDocument.Parse(rootNode["dynamicProperties"]!.ToJsonString()).RootElement
            };
        }

        public JsonNode UpdateDynamicProperties(string deviceType, JsonNode? dynamicProps)
        {
            if (dynamicProps == null) return null;

            switch (deviceType)
            {
                case "IP Camera": return _dynamicDataHelper.UpdateIpCameraDynamic(dynamicProps); 
                case "Air Conditioner": return _dynamicDataHelper.UpdateRoomAcDynamic(dynamicProps); 
                case "Network Switch": return _dynamicDataHelper.UpdateSwitchDynamic(dynamicProps); 
                case "Printer": return _dynamicDataHelper.UpdatePrinterDynamic(dynamicProps); 
                case "Raspberry Pi": return _dynamicDataHelper.UpdateRaspberryPiDynamic(dynamicProps); 
                case "Mobile": return _dynamicDataHelper.UpdateMobileDynamic(dynamicProps);
                case "NAS Server": return _dynamicDataHelper.UpdateNasDynamic(dynamicProps);
                case "Laptop": return _dynamicDataHelper.UpdateLaptopDynamic(dynamicProps);
                case "WiFi Router": return _dynamicDataHelper.UpdateWifiRouterDynamic(dynamicProps); 
                case "Smart TV": return _dynamicDataHelper.UpdateSmartTvDynamic(dynamicProps); 
                default:
                    _logger.LogWarning("No dynamic update logic for device type: {DeviceType}", deviceType);
                    return null;
            }
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

        public async Task BroadcastTopLevelSummary(List<DeviceMetadata> allDevices)
        {
            var summary = allDevices.Select(d => new DevicesTopLevelLiveData
            {
                MacId = d.MacId,
                Status = d.Status,
                Connectivity = d.Connectivity
            }).ToList();

            var json = JsonSerializer.Serialize(summary, new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                WriteIndented = true
            });

            await _hubContext.Clients.All.SendAsync("ReceiveUpdate", json);
        }

    }
}
