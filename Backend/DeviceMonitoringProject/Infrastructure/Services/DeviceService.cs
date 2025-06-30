using System.Text.Encodings.Web;
using System.Text.Json.Nodes;
using System.Text.Json;
using Application.Dtos;
using Domain.Entities;
using Infrastructure.RealTime;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Application.Interfaces;
using Microsoft.Extensions.Options;
using Infrastructure.Helpers;

namespace Infrastructure.Services
{
    public class DeviceService : IDeviceService
    {
        private List<DeviceMetadata> devices;
        private readonly Random random = new();
        private readonly ILogger<DeviceService> _logger;
        private readonly IHubContext<DeviceHub> _hubContext;
        private readonly IDynamicDataHelper _dynamicDataHelper;
        private readonly IDeviceServiceHelper _deviceServiceHelper;
        private readonly string _dataDirectory;
        private readonly IAlarmEvaluationService _alarmEvaluationService;

        public DeviceService(IDeviceServiceHelper deviceServiceHelper, IOptions<DeviceServiceOptions> options, ILogger<DeviceService> logger, IHubContext<DeviceHub> hubContext, IDynamicDataHelper dynamicDataHelper, IAlarmEvaluationService alarmEvaluationService)
        {
            _logger = logger;
            _hubContext = hubContext;
            _dynamicDataHelper = dynamicDataHelper;
            _dataDirectory = options.Value.DataDirectory;
            devices = ReadAllDeviceMetadataFiles();
            _alarmEvaluationService = alarmEvaluationService;
            _deviceServiceHelper = deviceServiceHelper;
        }

        private List<DeviceMetadata> ReadAllDeviceMetadataFiles()
        {
            var deviceFiles = Directory.GetFiles(_dataDirectory, "*.json");
            var metadataList = new List<DeviceMetadata>();

            foreach (var file in deviceFiles)
            {
                try
                {
                    using var jsonStream = System.IO.File.OpenRead(file);
                    var metadata = JsonSerializer.Deserialize<DeviceMetadata>(
                        jsonStream,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    if (metadata != null)
                    {
                        metadata.FileName = Path.GetFileName(file);
                        metadataList.Add(metadata);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error parsing file {file}: {ex.Message}");
                }
            }

            return metadataList;
        }

        public DeviceMetadataPaginated GetAllDeviceMetadataPaginated(int pageNumber = 1, int pageSize = 10)
        {
            var metadataList = ReadAllDeviceMetadataFiles();

            return new DeviceMetadataPaginated()
            {
                TotalCount = metadataList.Count,
                DeviceMetadata = metadataList
                                .Skip((pageNumber - 1) * pageSize)
                                .Take(pageSize)
                                .ToList()
            };
        }

        public Dictionary<string, string> GetMacIdToFileNameMap()
        {
            var macIdToFileMap = ReadAllDeviceMetadataFiles().Select(d => new 
            {
                DeviceFileName = d.FileName,
                DeviceMacId = d.MacId
            }).ToDictionary(d => d.DeviceMacId, d => d.DeviceFileName, StringComparer.OrdinalIgnoreCase);

            return macIdToFileMap;
        }

        public async Task<DeviceDetails> GetPropertyPanelDataForDevice(string deviceFileName)
        {
            var deviceFile = Path.Combine(_dataDirectory, $"{deviceFileName}");

            if (!System.IO.File.Exists(deviceFile))
                throw new Exception("Device data not found");

            var json = await System.IO.File.ReadAllTextAsync(deviceFile);

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            var deviceDetails = JsonSerializer.Deserialize<DeviceDetails>(json, options);

            return deviceDetails;
        }

        public async Task<bool> GenerateAndSendLiveUpdatesDevicesData()
        {
            var selectedDevices = devices.OrderBy(_ => random.Next()).Take(6).ToHashSet();

            var updatedDeviceDetails = new List<(string MacId, string EventName, object DetailPayload)>();

            foreach (var device in devices)
            {
                string file = Path.Combine(_dataDirectory, device.FileName);

                try
                {
                    var rootNode = JsonNode.Parse(await File.ReadAllTextAsync(file))!;
                    var previousDto = _deviceServiceHelper.ExtractLiveDataDto(device, rootNode);

                    if (selectedDevices.Any(d => d.MacId == device.MacId))
                    {
                        device.Status = _dynamicDataHelper.GetRandomStatus();
                        device.Connectivity = _dynamicDataHelper.GetRandomConnectivity();
                        rootNode["Status"] = device.Status;
                        rootNode["Connectivity"] = device.Connectivity;
                    }

                    _deviceServiceHelper.UpdateDynamicProperties(device.Name, rootNode["dynamicProperties"]);

                    await _deviceServiceHelper.WriteJsonFileAsync(file, rootNode);

                    var updatedDto = _deviceServiceHelper.ExtractLiveDataDto(device, rootNode);

                    //await _alarmEvaluationService.EvaluateAsync(previousDto, updatedDto);

                    var detailPayload = await GetPropertyPanelDataForDevice(device.FileName);

                    updatedDeviceDetails.Add((
                        MacId: device.MacId,
                        EventName: $"DeviceUpdate-{device.MacId}",
                        DetailPayload: detailPayload
                    ));
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing device file {file}", file);
                }
            }

            await _deviceServiceHelper.BroadcastDeviceDetailUpdates(updatedDeviceDetails);
            await _deviceServiceHelper.BroadcastTopLevelSummary(devices);

            return true;
        }

        public async Task<List<DevicesNameMacIdDto>> GetDevicesNameMacIdList()
        {
            var devices = ReadAllDeviceMetadataFiles().Select(d => new DevicesNameMacIdDto
            {
                DeviceName = d.Name,
                DeviceMacId = d.MacId
            }).ToList();

            return devices;
        }

        public DeviceMetadataPaginated GetSearchedDeviceMetadataPaginated(int pageNumber = 1, int pageSize = 10, string input = "")
        {
            var metadataList = ReadAllDeviceMetadataFiles();
            
            if(!input.Equals("") && input is not null)
                metadataList = metadataList.Where(device => device.Name?.Contains(input, StringComparison.OrdinalIgnoreCase) == true).ToList();

            return new DeviceMetadataPaginated()
            {
                TotalCount = metadataList.Count,
                DeviceMetadata = metadataList
                                .Skip((pageNumber - 1) * pageSize)
                                .Take(pageSize)
                                .ToList()
            }; 
        }
    }
}
