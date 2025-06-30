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

        public void UpdateDynamicProperties(string deviceType, JsonNode? dynamicProps)
        {
            if (dynamicProps == null) return;

            switch (deviceType)
            {
                case "IP Camera": _dynamicDataHelper.UpdateIpCameraDynamic(dynamicProps); break;
                case "Air Conditioner": _dynamicDataHelper.UpdateRoomAcDynamic(dynamicProps); break;
                case "Network Switch": _dynamicDataHelper.UpdateSwitchDynamic(dynamicProps); break;
                case "Printer": _dynamicDataHelper.UpdatePrinterDynamic(dynamicProps); break;
                case "Raspberry Pi": _dynamicDataHelper.UpdateRaspberryPiDynamic(dynamicProps); break;
                case "Mobile": _dynamicDataHelper.UpdateMobileDynamic(dynamicProps); break;
                case "NAS Server": _dynamicDataHelper.UpdateNasDynamic(dynamicProps); break;
                case "Laptop": _dynamicDataHelper.UpdateLaptopDynamic(dynamicProps); break;
                case "WiFi Router": _dynamicDataHelper.UpdateWifiRouterDynamic(dynamicProps); break;
                case "Smart TV": _dynamicDataHelper.UpdateSmartTvDynamic(dynamicProps); break;
                default:
                    _logger.LogWarning("No dynamic update logic for device type: {DeviceType}", deviceType);
                    break;
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

        public async Task BroadcastDeviceDetailUpdates(List<(string MacId, string EventName, object DetailPayload)> updates)
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
