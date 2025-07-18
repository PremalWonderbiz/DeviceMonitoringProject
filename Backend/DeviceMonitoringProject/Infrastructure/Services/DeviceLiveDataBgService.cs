﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Infrastructure.Cache;
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
        private readonly DeviceStateCache _deviceStateCache;
        private readonly IServiceScopeFactory _scopeFactory;
        private DateTime _lastDynamicUpdateTime = DateTime.Now;

        public DeviceLiveDataBgService(DeviceStateCache deviceStateCache, IServiceScopeFactory scopeFactory, ILogger<DeviceLiveDataBgService> logger, IHubContext<DeviceHub> hubContext)
        {
            _deviceStateCache = deviceStateCache;
            _logger = logger;
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("DeviceTopDataBgService is starting.");
            using (var scope = _scopeFactory.CreateScope())
            {
                var deviceService = scope.ServiceProvider.GetRequiredService<IDeviceService>();
                var allDevices = deviceService.ReadAllDeviceMetadataFiles();
                await _deviceStateCache.LoadAsync(allDevices);

                while (!stoppingToken.IsCancellationRequested)
                {
                    await deviceService.SimulateTopLevelChangeForOneDevice();

                    if ((DateTime.Now - _lastDynamicUpdateTime).TotalSeconds >= 10)
                    {
                        await deviceService.SimulateDynamicPropertiesUpdateForBatch();
                        _lastDynamicUpdateTime = DateTime.Now;
                    }


                    await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
                }
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
