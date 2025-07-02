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
using System.Xml.Linq;

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

        public List<DeviceMetadata> GetAllDeviceMetadataPaginated(List<DeviceMetadata> data,int pageNumber = 1, int pageSize = 10)
        {
            return data.Skip((pageNumber - 1) * pageSize)
                       .Take(pageSize)
                       .ToList();
        }
        
        public DeviceMetadataPaginatedandSortedDto GetAllDeviceMetadataPaginatedandSorted(DeviceTopLevelSortOptions sortRequest, List<DeviceMetadata> filteredData = null)
        {
            var metaData = filteredData is not null ? filteredData.AsQueryable() : ReadAllDeviceMetadataFiles().AsQueryable();

            IOrderedQueryable<DeviceMetadata>? ordered = null;

            if (sortRequest.Sorting != null)
            {
                foreach (var sort in sortRequest.Sorting)
                {
                    string id = sort.Id;
                    bool desc = sort.Desc;

                    if (ordered == null)
                    {
                        ordered = id switch
                        {
                            "name" => desc ? metaData.OrderByDescending(u => u.Name) : metaData.OrderBy(u => u.Name),
                            "type" => desc ? metaData.OrderByDescending(u => u.Type) : metaData.OrderBy(u => u.Type),
                            "status" => desc ? metaData.OrderByDescending(u => u.Status) : metaData.OrderBy(u => u.Status),
                            "macId" => desc ? metaData.OrderByDescending(u => u.MacId) : metaData.OrderBy(u => u.MacId),
                            "connectivity" => desc ? metaData.OrderByDescending(u => u.Connectivity) : metaData.OrderBy(u => u.Connectivity),
                            _ => desc ? metaData.OrderByDescending(u => u.Name) : metaData.OrderBy(u => u.Name)
                        };
                    }
                    else
                    {
                        ordered = id switch
                        {
                            "name" => desc ? ordered.ThenByDescending(u => u.Name) : ordered.ThenBy(u => u.Name),
                            "type" => desc ? ordered.ThenByDescending(u => u.Type) : ordered.ThenBy(u => u.Type),
                            "status" => desc ? ordered.ThenByDescending(u => u.Status) : ordered.ThenBy(u => u.Status),
                            "macId" => desc ? ordered.ThenByDescending(u => u.MacId) : ordered.ThenBy(u => u.MacId),
                            "connectivity" => desc ? ordered.ThenByDescending(u => u.Connectivity) : ordered.ThenBy(u => u.Connectivity),
                            _ => desc ? ordered.ThenByDescending(u => u.Name) : ordered.ThenBy(u => u.Name)
                        };
                    }
                }
            }

            var metadataPaginated = GetAllDeviceMetadataPaginated((ordered ?? metaData).ToList(), sortRequest.PageNumber, sortRequest.PageSize);

            return new DeviceMetadataPaginatedandSortedDto()
            {
                TotalCount = metaData.ToList().Count,
                DeviceMetadata = metadataPaginated
            };
        }

        public DeviceMetadataPaginatedandSortedDto GetSearchedDeviceMetadataPaginated(DeviceTopLevelSortOptions options, string input = "")
        {
            var metadataList = ReadAllDeviceMetadataFiles();

            if (!input.Equals("") && input is not null)
                metadataList = metadataList.Where(device => device.Name?.Contains(input, StringComparison.OrdinalIgnoreCase) == true).ToList();

            if (metadataList.Count <= 1)
                return new DeviceMetadataPaginatedandSortedDto()
                {
                    TotalCount = metadataList.Count,
                    DeviceMetadata = metadataList
                };

            var res = GetAllDeviceMetadataPaginatedandSorted(options, metadataList);
            return res;
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
            var topLevelChangedDevices = new List<DeviceMetadata>();
            var updatedDeviceDetails = new List<(string MacId, string EventName, JsonElement DetailPayload)>();

            foreach (var device in devices)
            {
                string file = Path.Combine(_dataDirectory, device.FileName);

                try
                {
                    var rootNode = JsonNode.Parse(await File.ReadAllTextAsync(file))!;
                    var previousDto = _deviceServiceHelper.ExtractLiveDataDto(device, rootNode);

                    string? previousStatus = rootNode["Status"]?.GetValue<string>();
                    string? previousConnectivity = rootNode["Connectivity"]?.GetValue<string>();

                    bool isSelected = selectedDevices.Any(d => d.MacId == device.MacId);
                    bool statusChanged = false;
                    bool connectivityChanged = false;

                    if (isSelected)
                    {
                        var newStatus = _dynamicDataHelper.GetRandomStatus();
                        var newConnectivity = _dynamicDataHelper.GetRandomConnectivity();

                        statusChanged = newStatus != previousStatus;
                        connectivityChanged = newConnectivity != previousConnectivity;

                        if (statusChanged)
                        {
                            device.Status = newStatus;
                            rootNode["Status"] = newStatus;
                        }

                        if (connectivityChanged)
                        {
                            device.Connectivity = newConnectivity;
                            rootNode["Connectivity"] = newConnectivity;
                        }

                        if (statusChanged || connectivityChanged)
                        {
                            topLevelChangedDevices.Add(device);
                        }
                    }


                    var updatedDynamicfieldnode = _deviceServiceHelper.UpdateDynamicProperties(device.Name, rootNode["dynamicProperties"]);
                    var jsonElement = JsonDocument.Parse(updatedDynamicfieldnode.ToJsonString()).RootElement.Clone();

                    await _deviceServiceHelper.WriteJsonFileAsync(file, rootNode);

                    var updatedDto = _deviceServiceHelper.ExtractLiveDataDto(device, rootNode);

                    //await _alarmEvaluationService.EvaluateAsync(previousDto, updatedDto);

                    var detailPayload = await GetPropertyPanelDataForDevice(device.FileName);

                    updatedDeviceDetails.Add((
                        MacId: device.MacId,
                        EventName: $"DeviceUpdate-{device.MacId}",
                        DetailPayload: jsonElement
                    ));
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing device file {file}", file);
                }
            }

            await _deviceServiceHelper.BroadcastDeviceDetailUpdates(updatedDeviceDetails);
            await _deviceServiceHelper.BroadcastTopLevelSummary(topLevelChangedDevices);

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

    }
}
