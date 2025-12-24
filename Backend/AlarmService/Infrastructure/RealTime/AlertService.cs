using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Infrastructure.RealTime
{
    public class AlertService
    {
        private readonly HttpClient _httpClient;

        public AlertService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task MainPageUpdates(string json)
        {
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            await _httpClient.PostAsync("http://gateway-service:8080/api/realtime/alarm-update", content);
        }

        public async Task AlarmPanelUpdates(string json)
        {
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            await _httpClient.PostAsync("http://gateway-service:8080/api/realtime/alarmPanel-alarm-update", content);
        }

        public async Task PropertyPanelUpdates(string json, string deviceId)
        {
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            await _httpClient.PostAsync($"http://gateway-service:8080/api/realtime/propertyPanel-alarm-update/{deviceId}", content);
        }
    }
}
