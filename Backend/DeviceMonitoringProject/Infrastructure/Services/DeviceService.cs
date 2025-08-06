// Refactored DeviceService to use DeviceStateCache instead of reading/writing files

using System.Text.Json;
using Application.Dtos;
using Domain.Entities;
using Infrastructure.RealTime;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Application.Interfaces;
using Microsoft.Extensions.Options;
using Infrastructure.Cache;
using Microsoft.AspNetCore.Http;
using Application.Interface;

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
    private readonly IAlarmToggleService _alarmToggleService;

    private static readonly Dictionary<string, int> connectivityOrder = new()
    {
        { "Low", 1 },
        { "Medium", 2 },
        { "High", 3 }
    };

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
        DeviceStateCache deviceStateCache,
        IAlarmToggleService alarmToggleService)
    {
        _logger = logger;
        _hubContext = hubContext;
        _dynamicDataHelper = dynamicDataHelper;
        _alarmEvaluationService = alarmEvaluationService;
        _deviceServiceHelper = deviceServiceHelper;
        _deviceStateCache = deviceStateCache;
        _dataDirectory = options.Value.DataDirectory;
        _alarmToggleService = alarmToggleService;
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
            "connectivity" => desc ? data.OrderByDescending(u => connectivityOrder.ContainsKey(u.Connectivity) ? connectivityOrder[u.Connectivity] : int.MaxValue)
                                    : data.OrderBy(u => connectivityOrder.ContainsKey(u.Connectivity) ? connectivityOrder[u.Connectivity] : int.MaxValue),
            "lastUpdated" => desc ? data.OrderByDescending(u => u.LastUpdated) : data.OrderBy(u => u.LastUpdated),
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
            "connectivity" => desc ? data.ThenByDescending(u => connectivityOrder.ContainsKey(u.Connectivity) ? connectivityOrder[u.Connectivity] : int.MaxValue)
                                    : data.ThenBy(u => connectivityOrder.ContainsKey(u.Connectivity) ? connectivityOrder[u.Connectivity] : int.MaxValue),
            "lastUpdated" => desc ? data.OrderByDescending(u => u.LastUpdated) : data.OrderBy(u => u.LastUpdated),
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

            if (_alarmToggleService.IsAlarmEnabled)
            {
                await _alarmEvaluationService.EvaluateTopAsync(currentTop, previousTop);
            }

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
                var updatedNode = _deviceServiceHelper.UpdateDynamicProperties(root["dynamicProperties"], root["dynamicObservables"]);

                var currentDynamic = _deviceServiceHelper.ExtractDynamicDto(device.MacId, root);

                if (_alarmToggleService.IsAlarmEnabled)
                {
                    await _alarmEvaluationService.EvaluateDynamicAsync(currentDynamic, previousDynamic);
                }

                if (updatedNode is not null)
                {

                    var jsonElement = JsonDocument.Parse(updatedNode.ToJsonString()).RootElement.Clone();

                    updatedDeviceDetails.Add((
                        MacId: device.MacId,
                        EventName: $"DeviceUpdate-{device.MacId}",
                        DetailPayload: jsonElement
                    ));
                }
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

    public async Task<DeviceMetadataPaginatedandSortedDto> GetAllDataRefereshedFromCache(DeviceTopLevelSortOptions request, string input = "")
    {
        await refreshDeviceStateCache();

        if (input != "undefined")
            return GetSearchedDeviceMetadataPaginated(request, input);

        return GetAllDeviceMetadataPaginatedandSorted(request);
    }

    public async Task<string> UploadFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new Exception("No file uploaded.");

        // Read file content as string
        string fileContent;
        using (var reader = new StreamReader(file.OpenReadStream()))
        {
            fileContent = await reader.ReadToEndAsync();
        }

        // Parse and validate JSON structure
        JsonDocument jsonDoc;
        try
        {
            jsonDoc = JsonDocument.Parse(fileContent);
        }
        catch (JsonException)
        {
            throw new Exception("Uploaded file is not a valid JSON.");
        }

        JsonElement root = jsonDoc.RootElement;

        // Validate required top-level fields
        if (!root.TryGetProperty("Name", out _) ||
            !root.TryGetProperty("FileName", out var fileNameProp) ||
            !root.TryGetProperty("Type", out _) ||
            !root.TryGetProperty("MacId", out var macIdProp) ||
            !root.TryGetProperty("staticProperties", out var staticProps) ||
            !root.TryGetProperty("dynamicProperties", out var dynamicProps) ||
            !root.TryGetProperty("alarmRules", out var alarmRules))
        {
            throw new Exception("JSON must contain 'FileName', 'Name', 'Type', 'staticProperties', 'alarmRules' and 'dynamicProperties' fields.");
        }

        // Validate that staticProperties and dynamicProperties are objects
        if (staticProps.ValueKind != JsonValueKind.Object || dynamicProps.ValueKind != JsonValueKind.Object)
        {
            throw new Exception("'staticProperties' and 'dynamicProperties' must be JSON objects.");
        }

        // Validate that the 'FileName' field inside JSON matches the uploaded file's name
        var jsonFileName = fileNameProp.GetString();
        if (!string.Equals(jsonFileName, file.FileName, StringComparison.OrdinalIgnoreCase))
        {
            throw new Exception($"Mismatch between uploaded file name ('{file.FileName}') and JSON 'FileName' field ('{jsonFileName}').");
        }

        // Save the file if validation passes
        if (!Directory.Exists(_dataDirectory))
            Directory.CreateDirectory(_dataDirectory);

        var filePath = Path.Combine(_dataDirectory, file.FileName);
        if (File.Exists(filePath))
        {
            throw new Exception($"A file named '{file.FileName}' already exists. Please rename your file or delete the existing one.");
        }

        await File.WriteAllTextAsync(filePath, fileContent);

        var rulesToSend = ParseAlarmRules(alarmRules);

        await _alarmEvaluationService.AddAlarmRules(macIdProp.ToString(), rulesToSend);

        await refreshDeviceStateCache();

        return "Device added successfully.";
    }

    private async Task<bool> refreshDeviceStateCache()
    {
        await _deviceStateCache.PersistToDiskAsync();
        var allDevices = ReadAllDeviceMetadataFiles();
        await _deviceStateCache.LoadAsync(allDevices);

        return true;
    }

    private List<AlarmRuleDto> ParseAlarmRules(JsonElement alarmRulesElement)
    {
        var rules = new List<AlarmRuleDto>();

        foreach (var ruleJson in alarmRulesElement.EnumerateArray())
        {
            var rule = new AlarmRuleDto
            {
                FieldPath = ruleJson.GetProperty("FieldPath").GetString()!,
                Operator = ruleJson.GetProperty("Operator").GetString()!,
                ThresholdValue = ruleJson.GetProperty("ThresholdValue").GetString()!,
                Severity = ruleJson.GetProperty("Severity").GetString()!,
                MessageTemplate = ruleJson.GetProperty("MessageTemplate").GetString()!
            };

            rules.Add(rule);
        }

        return rules;
    }

}
