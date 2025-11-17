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
        private readonly TimeSpan _interval = TimeSpan.FromSeconds(100); 

        public DeviceStatePersistenceService(
            DeviceStateCache deviceStateCache,
            ILogger<DeviceStatePersistenceService> logger)
        {
            _deviceStateCache = deviceStateCache;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Device state persistence service started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                await _deviceStateCache.PersistToDiskAsync();
                await Task.Delay(_interval, stoppingToken);
            }
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("DeviceStatePersistenceService is stopping. Flushing cache to disk...");
            await _deviceStateCache.PersistToDiskAsync();
            _logger.LogInformation("Final flush complete.");
            await base.StopAsync(cancellationToken);
        }
    }
}
