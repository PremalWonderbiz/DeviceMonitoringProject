using System.Text.Json;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Text.Json.Nodes;
using Infrastructure.Cache;
using Microsoft.Extensions.Options;
using Application.Dtos;
using System.Text.Encodings.Web;
using System.Text.Json.Serialization.Metadata;

namespace Infrastructure.Services
{
    public class DeviceStatePersistenceService : BackgroundService
    {
        private readonly DeviceStateCache _deviceStateCache;
        private readonly ILogger<DeviceStatePersistenceService> _logger;
        private readonly string _dataDirectory;
        private readonly TimeSpan _interval = TimeSpan.FromSeconds(100); 

        public DeviceStatePersistenceService(
            DeviceStateCache deviceStateCache,
            ILogger<DeviceStatePersistenceService> logger,
            IOptions<DeviceServiceOptions> options)
        {
            _deviceStateCache = deviceStateCache;
            _logger = logger;
            _dataDirectory = options.Value.DataDirectory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Device state persistence service started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                await PersistToDiskAsync(stoppingToken);
                await Task.Delay(_interval, stoppingToken);
            }
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("DeviceStatePersistenceService is stopping. Flushing cache to disk...");
            await PersistToDiskAsync(cancellationToken);
            _logger.LogInformation("Final flush complete.");
            await base.StopAsync(cancellationToken);
        }

        private async Task PersistToDiskAsync(CancellationToken cancellationToken)
        {
            try
            {
                var allStates = _deviceStateCache.GetAllStates();

                foreach (var state in allStates.Values)
                {
                    var fileName = state.Root["FileName"]?.GetValue<string>();

                    if (string.IsNullOrWhiteSpace(fileName))
                    {
                        _logger.LogWarning("Device state missing FileName field. Skipping...");
                        continue;
                    }

                    var json = state.Root.ToJsonString(new JsonSerializerOptions
                    {
                        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                        WriteIndented = true,
                        TypeInfoResolver = new DefaultJsonTypeInfoResolver()
                    });

                    var path = Path.Combine(_dataDirectory, fileName);
                    await File.WriteAllTextAsync(path, json, cancellationToken);
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
