using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Infrastructure.RealTime;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services
{
    public class DeviceLiveDataBgService : BackgroundService
    {
        private readonly ILogger<DeviceLiveDataBgService> _logger;
        private readonly IServiceScopeFactory _scopeFactory;

        public DeviceLiveDataBgService(IServiceScopeFactory scopeFactory, ILogger<DeviceLiveDataBgService> logger, IHubContext<DeviceHub> hubContext)
        {
            _logger = logger;
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("DeviceTopDataBgService is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    var deviceService = scope.ServiceProvider.GetRequiredService<IDeviceService>();

                    _logger.LogInformation("DeviceTopDataBgService Current time: {time}", DateTimeOffset.Now);
                    await deviceService.GenerateAndSendLiveUpdatesDevicesData();
                }

                await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken); 
            }

            _logger.LogInformation("DeviceTopDataBgService is stopping.");
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            Console.WriteLine("Application is shutting down.");
            return base.StopAsync(cancellationToken);
        }
    }
}
