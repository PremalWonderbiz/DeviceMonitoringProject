using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Infrastructure.RealTime;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services
{
    public class DeviceLiveDataBgService : BackgroundService
    {

        private readonly IDeviceService _deviceService;
        private readonly ILogger<DeviceLiveDataBgService> _logger;

        public DeviceLiveDataBgService(ILogger<DeviceLiveDataBgService> logger, IDeviceService deviceService, IHubContext<DeviceHub> hubContext)
        {
            _logger = logger;
            _deviceService = deviceService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("DeviceTopDataBgService is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("DeviceTopDataBgService Current time: {time}", DateTimeOffset.Now);
                await _deviceService.GenerateAndSendLiveUpdatesDevicesData();

                await Task.Delay(TimeSpan.FromSeconds(600), stoppingToken); // Wait for 10 seconds
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
