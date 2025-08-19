using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization.Metadata;
using System.Threading.Tasks;
using Application.Dtos;
using Domain.Entities;
using Infrastructure.Persistence;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Cache
{
    public class DeviceState
    {
        public JsonNode Root { get; set; } = default!;
        public DateTime LastUpdated { get; set; }
    }

    public class DeviceStateCache
    {
        //local
        private readonly string _dataDirectory = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory())!.FullName, "Infrastructure", "Data");

        //docker
        //private readonly string _dataDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Infrastructure", "Data");
        private readonly ILogger<DeviceStatePersistenceService> _logger;
        private readonly ConcurrentDictionary<string, DeviceState> _deviceMap = new();
        private readonly ConcurrentDictionary<string, SemaphoreSlim> _locks = new();
        private readonly bool _useDatabase;
        private readonly IServiceProvider _serviceProvider;
        private static readonly SemaphoreSlim _dbLock = new(1, 1);

        public DeviceStateCache(ILogger<DeviceStatePersistenceService> logger, IOptions<DeviceStorageOptions> options,
        IServiceProvider serviceProvider)
        {
            _logger = logger;
            _useDatabase = options.Value.UseDatabase;
            _serviceProvider = serviceProvider;
        }
        public ConcurrentDictionary<string, DeviceState> GetAllStates()
        {
            return _deviceMap;
        }

        public async Task LoadAsync()
        {
            using var scope = _serviceProvider.CreateScope();
            var _dbContext = scope.ServiceProvider.GetRequiredService<DeviceDbContext>();
            _deviceMap.Clear();

            if (_useDatabase)
            {
                var devices = await _dbContext.Devices.ToListAsync();

                foreach (var device in devices)
                {
                    var root = new JsonObject
                    {
                        ["MacId"] = device.MacId,
                        ["Name"] = device.Name,
                        ["Type"] = device.Type,
                        ["FileName"] = device.FileName,
                        ["Status"] = device.Status,
                        ["Connectivity"] = device.Connectivity,
                        ["LastUpdated"] = device.LastUpdated,
                        ["staticProperties"] = JsonNode.Parse(device.StaticPropertiesJson),
                        ["dynamicProperties"] = JsonNode.Parse(device.DynamicPropertiesJson),
                        ["topLevelObservables"] = JsonNode.Parse(device.TopLevelObservablesJson),
                        ["dynamicObservables"] = JsonNode.Parse(device.DynamicObservablesJson)
                    };

                    _deviceMap[device.MacId] = new DeviceState
                    {
                        Root = root,
                        LastUpdated = device.LastUpdated
                    };
                }
            }
            else
            {
                var deviceFiles = Directory.GetFiles(_dataDirectory, "*.json");

                foreach (var file in deviceFiles)
                {
                    try
                    {
                        var json = await File.ReadAllTextAsync(file);
                        var node = JsonNode.Parse(json)!;

                        DateTime lastUpdated = DateTime.UtcNow;
                        if (node["LastUpdated"] is JsonValue ts &&
                            DateTime.TryParse(ts.ToString(), out var parsedDate))
                            lastUpdated = parsedDate;

                        _deviceMap[node["MacId"]!.ToString()] = new DeviceState
                        {
                            Root = node,
                            LastUpdated = lastUpdated
                        };
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to load file {File}", file);
                    }
                }
            }
        }

        public JsonNode? GetDeviceState(string macId)
        {
            return _deviceMap.TryGetValue(macId, out var state) ? state.Root : null;
        }

        public async Task WithLock(string macId, Func<JsonNode, Task> updateFn)
        {
            var sem = _locks.GetOrAdd(macId, _ => new SemaphoreSlim(1, 1));
            await sem.WaitAsync();
            try
            {
                if (_deviceMap.TryGetValue(macId, out var state))
                {
                    await updateFn(state.Root);
                }
            }
            finally
            {
                sem.Release();
            }
        }

        public void UpdateLastUpdated(string macId, DateTime now)
        {
            if (_deviceMap.TryGetValue(macId, out var state))
            {
                state.LastUpdated = now;
            }
        }

        public async Task PersistToDiskAsync()
        {
            await _dbLock.WaitAsync();
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var _dbContext = scope.ServiceProvider.GetRequiredService<DeviceDbContext>();
                await _dbContext.Database.ExecuteSqlRawAsync("PRAGMA journal_mode=WAL;");

                foreach (var kvp in _deviceMap)
                {
                    var macId = kvp.Key;
                    var state = kvp.Value;
                    state.LastUpdated = DateTime.UtcNow;
                    state.Root["LastUpdated"] = state.LastUpdated;

                    if (_useDatabase)
                    {
                        var device = await _dbContext.Devices.FirstOrDefaultAsync(d => d.MacId == macId);
                        if (device != null)
                        {
                            //device.StaticPropertiesJson = state.Root["staticProperties"]!.ToJsonString();
                            device.DynamicPropertiesJson = state.Root["dynamicProperties"]!.ToJsonString();
                            device.Status = state.Root["Status"]?.ToString();
                            device.Connectivity = state.Root["Connectivity"]?.ToString();
                            //device.TopLevelObservablesJson = state.Root["topLevelObservables"]!.ToJsonString();
                            //device.DynamicObservablesJson = state.Root["dynamicObservables"]!.ToJsonString();
                            device.LastUpdated = state.LastUpdated;
                        }
                    }
                    else
                    {
                        var fileName = state.Root["FileName"]!.ToString();
                        var path = Path.Combine(_dataDirectory, fileName!);
                        await File.WriteAllTextAsync(path, state.Root.ToJsonString(new JsonSerializerOptions
                        {
                            WriteIndented = true
                        }));
                    }
                }

                if (_useDatabase)
                {
                    await _dbContext.SaveChangesAsync(); // Save all updates at once
                }
            }
            finally
            {
                _dbLock.Release();
            }
            
        }
    }

}
