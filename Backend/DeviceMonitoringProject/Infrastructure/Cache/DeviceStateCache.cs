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
using Infrastructure.Services;
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
        private readonly string _dataDirectory;
        private readonly ILogger<DeviceStatePersistenceService> _logger;
        private readonly ConcurrentDictionary<string, DeviceState> _deviceMap = new();
        private readonly ConcurrentDictionary<string, SemaphoreSlim> _locks = new();

        public DeviceStateCache(IOptions<DeviceServiceOptions> options, ILogger<DeviceStatePersistenceService> logger)
        {
            _dataDirectory = options.Value.DataDirectory;
            _logger = logger;
        }
        public ConcurrentDictionary<string, DeviceState> GetAllStates()
        {
            return _deviceMap;
        }

        public async Task LoadAsync(List<DeviceMetadata> devices)
        {
            _deviceMap.Clear();
            foreach (var device in devices)
            {
                var file = Path.Combine(_dataDirectory, device.FileName);
                var json = await File.ReadAllTextAsync(file);
                var node = JsonNode.Parse(json)!;

                // Try to parse LastUpdatedAt from the root if available
                DateTime lastUpdated = DateTime.Now;
                if (node["LastUpdated"] is JsonValue timestampNode &&
                    DateTime.TryParse(timestampNode.ToString(), out var parsedDate))
                {
                    lastUpdated = parsedDate;
                }

                _deviceMap[device.MacId] = new DeviceState
                {
                    Root = node,
                    LastUpdated = lastUpdated
                };
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
            try
            {
                var allStates = GetAllStates();

                foreach (var state in allStates.Values)
                {
                    var fileName = state.Root["FileName"]?.GetValue<string>();

                    if (string.IsNullOrWhiteSpace(fileName))
                    {
                        _logger.LogWarning("Device state missing FileName field. Skipping...");
                        continue;
                    }

                    var path = Path.Combine(_dataDirectory, fileName);

                    if (!File.Exists(path))
                    {
                        _logger.LogWarning("File '{FileName}' does not exist. Skipping persistence.", fileName);
                        continue;
                    }

                    var json = state.Root.ToJsonString(new JsonSerializerOptions
                    {
                        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                        WriteIndented = true,
                        TypeInfoResolver = new DefaultJsonTypeInfoResolver()
                    });

                    await File.WriteAllTextAsync(path, json);
                }

                _logger.LogInformation("Device states persisted to disk at {Time}", DateTime.Now);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to persist device state to disk.");
            }
        }

    }

}
