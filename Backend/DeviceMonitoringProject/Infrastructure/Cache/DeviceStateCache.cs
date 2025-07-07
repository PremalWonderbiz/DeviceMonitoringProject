using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using Application.Dtos;
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
        private readonly ConcurrentDictionary<string, DeviceState> _deviceMap = new();
        private readonly ConcurrentDictionary<string, SemaphoreSlim> _locks = new();

        public DeviceStateCache(IOptions<DeviceServiceOptions> options)
        {
            _dataDirectory = options.Value.DataDirectory;
        }
        public ConcurrentDictionary<string, DeviceState> GetAllStates()
        {
            return _deviceMap;
        }

        public async Task LoadAsync(List<DeviceMetadata> devices)
        {
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

        public async Task PersistAllAsync(List<DeviceMetadata> devices)
        {
            foreach (var device in devices)
            {
                if (_deviceMap.TryGetValue(device.MacId, out var state))
                {
                    var file = Path.Combine(_dataDirectory, device.FileName);
                    await File.WriteAllTextAsync(file, state.Root.ToJsonString());
                }
            }
        }
    }

}
