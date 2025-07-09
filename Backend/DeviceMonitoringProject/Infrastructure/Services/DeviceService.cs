// Refactored DeviceService to use DeviceStateCache instead of reading/writing files

using System.Text.Json;
using System.Text.Json.Nodes;
using Application.Dtos;
using Domain.Entities;
using Infrastructure.RealTime;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Application.Interfaces;
using Microsoft.Extensions.Options;
using Infrastructure.Helpers;
using Infrastructure.Cache;

namespace Infrastructure.Services;

public class DeviceService : IDeviceService
{
    private readonly ILogger<DeviceService> _logger;
    private readonly IHubContext<DeviceHub> _hubContext;
    private readonly IDynamicDataHelper _dynamicDataHelper;
    private readonly IDeviceServiceHelper _deviceServiceHelper;
    private readonly IAlarmEvaluationService _alarmEvaluationService;
    private readonly DeviceStateCache _deviceStateCache;
    private readonly Random _random = new();
    private List<DeviceMetadata> _devices =>
    _deviceStateCache.GetAllStates()
        .Select(state =>
        {
            var root = state.Value.Root;
            var lastUpdated = state.Value.LastUpdated;
            return new DeviceMetadata
            {
                Name = root["Name"]?.GetValue<string>() ?? "Unknown",
                Type = root["Type"]?.GetValue<string>() ?? "Unknown",
                Status = root["Status"]?.GetValue<string>() ?? "Unknown",
                MacId = state.Key,
                Connectivity = root["Connectivity"]?.GetValue<string>() ?? "Unknown",
                FileName = root["FileName"]?.GetValue<string>() ?? "",
                LastUpdated = lastUpdated
            };
        })
        .ToList();

    private readonly string _dataDirectory;

    public DeviceService(
        IDeviceServiceHelper deviceServiceHelper,
        IOptions<DeviceServiceOptions> options,
        ILogger<DeviceService> logger,
        IHubContext<DeviceHub> hubContext,
        IDynamicDataHelper dynamicDataHelper,
        IAlarmEvaluationService alarmEvaluationService,
        DeviceStateCache deviceStateCache)
    {
        _logger = logger;
        _hubContext = hubContext;
        _dynamicDataHelper = dynamicDataHelper;
        _alarmEvaluationService = alarmEvaluationService;
        _deviceServiceHelper = deviceServiceHelper;
        _deviceStateCache = deviceStateCache;
        _dataDirectory = options.Value.DataDirectory;
    }


    public List<DeviceMetadata> ReadAllDeviceMetadataFiles()
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

    public async Task<bool> GenerateAndSendLiveUpdatesDevicesData()
    {
        throw new NotImplementedException();
    }

    public List<DeviceMetadata> GetAllDeviceMetadataPaginated(List<DeviceMetadata> data, int pageNumber = 1, int pageSize = 10)
    {
        return data.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
    }

    public DeviceMetadataPaginatedandSortedDto GetAllDeviceMetadataPaginatedandSorted(DeviceTopLevelSortOptions sortRequest, List<DeviceMetadata> filteredData = null)
    {
        var metaData = filteredData is not null
    ? filteredData.AsQueryable()
    : _devices.AsQueryable();

        IOrderedQueryable<DeviceMetadata> ordered;

        if (sortRequest.Sorting == null || !sortRequest.Sorting.Any())
        {
            ordered = metaData.OrderByDescending(d => d.LastUpdated);
        }
        else
        {
            IOrderedQueryable<DeviceMetadata>? temp = null;

            foreach (var sort in sortRequest.Sorting)
            {
                string id = sort.Id;
                bool desc = sort.Desc;

                temp = temp == null
                    ? SortInitial(metaData, id, desc)
                    : SortThen(temp, id, desc);
            }

            ordered = temp!;
        }

        var metadataPaginated = GetAllDeviceMetadataPaginated(
            ordered.ToList(),
            sortRequest.PageNumber,
            sortRequest.PageSize
        );

        return new DeviceMetadataPaginatedandSortedDto()
        {
            TotalCount = metaData.Count(),
            DeviceMetadata = metadataPaginated
        };

    }

    private IOrderedQueryable<DeviceMetadata> SortInitial(IQueryable<DeviceMetadata> data, string id, bool desc)
    {
        return id switch
        {
            "name" => desc ? data.OrderByDescending(u => u.Name) : data.OrderBy(u => u.Name),
            "type" => desc ? data.OrderByDescending(u => u.Type) : data.OrderBy(u => u.Type),
            "status" => desc ? data.OrderByDescending(u => u.Status) : data.OrderBy(u => u.Status),
            "macId" => desc ? data.OrderByDescending(u => u.MacId) : data.OrderBy(u => u.MacId),
            "connectivity" => desc ? data.OrderByDescending(u => u.Connectivity) : data.OrderBy(u => u.Connectivity),
            _ => data.OrderBy(u => u.Name)
        };
    }

    private IOrderedQueryable<DeviceMetadata> SortThen(IOrderedQueryable<DeviceMetadata> data, string id, bool desc)
    {
        return id switch
        {
            "name" => desc ? data.ThenByDescending(u => u.Name) : data.ThenBy(u => u.Name),
            "type" => desc ? data.ThenByDescending(u => u.Type) : data.ThenBy(u => u.Type),
            "status" => desc ? data.ThenByDescending(u => u.Status) : data.ThenBy(u => u.Status),
            "macId" => desc ? data.ThenByDescending(u => u.MacId) : data.ThenBy(u => u.MacId),
            "connectivity" => desc ? data.ThenByDescending(u => u.Connectivity) : data.ThenBy(u => u.Connectivity),
            _ => data.ThenBy(u => u.Name)
        };
    }
        
    public DeviceMetadataPaginatedandSortedDto GetSearchedDeviceMetadataPaginated(DeviceTopLevelSortOptions options, string input = "")
    {
        var metadataList = string.IsNullOrWhiteSpace(input)
            ? _devices
            : _devices.Where(d => d.Name?.Contains(input, StringComparison.OrdinalIgnoreCase) == true).ToList();

        if (metadataList.Count <= 1)
        {
            return new DeviceMetadataPaginatedandSortedDto()
            {
                TotalCount = metadataList.Count,
                DeviceMetadata = metadataList
            };
        }

        return GetAllDeviceMetadataPaginatedandSorted(options, metadataList);
    }

    public Dictionary<string, string> GetMacIdToFileNameMap()
    {
        return _devices.ToDictionary(d => d.MacId, d => d.FileName, StringComparer.OrdinalIgnoreCase);
    }

    public async Task<DeviceDetails> GetPropertyPanelDataForDevice(string deviceFileName)
    {
        var state = _deviceStateCache
       .GetAllStates()
       .Values
       .FirstOrDefault(s => s.Root?["FileName"]?.GetValue<string>() == deviceFileName);

        if (state?.Root == null)
        {
            _logger.LogError("Missing or malformed state for file: {file}", deviceFileName);
            throw new Exception("Device not found or invalid state");
        }

        try
        {
            var json = state.Root.ToJsonString();
            return JsonSerializer.Deserialize<DeviceDetails>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            })!;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Deserialization failed for file: {file}", deviceFileName);
            throw new Exception("Failed to parse device details");
        }
    }

    public async Task<bool> SimulateTopLevelChangeForOneDevice()
    {
        var device = _devices[_random.Next(_devices.Count)];

        var rootSnapshot = _deviceStateCache.GetDeviceState(device.MacId);
        if (rootSnapshot == null) return false;

        var previousTop = _deviceServiceHelper.ExtractTopLevelDto(device.MacId, rootSnapshot.DeepClone());

        bool wasUpdated = false;

        await _deviceStateCache.WithLock(device.MacId, async (rootNode) =>
        {
            string? previousStatus = rootNode["Status"]?.GetValue<string>();
            string? previousConnectivity = rootNode["Connectivity"]?.GetValue<string>();

            var newStatus = _dynamicDataHelper.GetRandomStatus();
            var newConnectivity = _dynamicDataHelper.GetRandomConnectivity();

            bool statusChanged = newStatus != previousStatus;
            bool connectivityChanged = newConnectivity != previousConnectivity;

            if (!statusChanged && !connectivityChanged)
            {
                return; 
            }
       
            if (statusChanged) rootNode["Status"] = newStatus;
            if (connectivityChanged) rootNode["Connectivity"] = newConnectivity;

            var now = DateTime.Now;
            rootNode["LastUpdated"] = now.ToString("o");
            _deviceStateCache.UpdateLastUpdated(device.MacId, now);

            var currentTop = _deviceServiceHelper.ExtractTopLevelDto(device.MacId, rootNode);

             //await _alarmEvaluationService.EvaluateTopAsync(currentTop, previousTop);

            var updatedDevice = new DeviceMetadata
            {
                MacId = device.MacId,
                Name = rootNode["Name"]?.GetValue<string>() ?? "Unknown",
                Type = rootNode["Type"]?.GetValue<string>() ?? "Unknown",
                FileName = rootNode["FileName"]?.GetValue<string>() ?? "",
                Status = rootNode["Status"]?.GetValue<string>() ?? newStatus,
                Connectivity = rootNode["Connectivity"]?.GetValue<string>() ?? newConnectivity,
                LastUpdated = now
            };

            var updatedFields = new List<string>();
            if (statusChanged) updatedFields.Add("status");
            if (connectivityChanged) updatedFields.Add("connectivity");

            await _deviceServiceHelper.BroadcastTopLevelSummary(new List<(DeviceMetadata, List<string>)> { (updatedDevice, updatedFields) });

            wasUpdated = true; 
        });

        return wasUpdated;
    }

    public async Task<bool> SimulateDynamicPropertiesUpdateForBatch()
    {
        var updatedDeviceDetails = new List<(string MacId, string EventName, JsonElement DetailPayload)>();

        foreach (var device in _devices)
        {
            var root = _deviceStateCache.GetDeviceState(device.MacId);
            if (root == null) continue;

            await _deviceStateCache.WithLock(device.MacId, async (root) =>
            {
                var previousDynamic = _deviceServiceHelper.ExtractDynamicDto(device.MacId, root.DeepClone());
                var updatedNode = _deviceServiceHelper.UpdateDynamicProperties(device.Name, root["dynamicProperties"]);

                var currentDynamic = _deviceServiceHelper.ExtractDynamicDto(device.MacId, root);

                //await _alarmEvaluationService.EvaluateDynamicAsync(currentDynamic, previousDynamic);

                var jsonElement = JsonDocument.Parse(updatedNode.ToJsonString()).RootElement.Clone();

                updatedDeviceDetails.Add((
                    MacId: device.MacId,
                    EventName: $"DeviceUpdate-{device.MacId}",
                    DetailPayload: jsonElement
                ));
            });
        }

        await _deviceServiceHelper.BroadcastDeviceDetailUpdates(updatedDeviceDetails);
        return true;
    }


    public async Task<List<DevicesNameMacIdDto>> GetDevicesNameMacIdList()
    {
        return _devices.Select(d => new DevicesNameMacIdDto
        {
            DeviceName = d.Name,
            DeviceMacId = d.MacId
        }).ToList();
    }
}
