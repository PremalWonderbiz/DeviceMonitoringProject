using System.Text;
using System.Text.Json;
using Application.Dtos;
using Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services
{
    public class AlarmEvaluationService : IAlarmEvaluationService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<AlarmEvaluationService> _logger;

        public AlarmEvaluationService(HttpClient httpClient, ILogger<AlarmEvaluationService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task EvaluateTopAsync(TopLevelDeviceDataDto previous, TopLevelDeviceDataDto current)
        {
            var request = new
            {
                Type = "TopLevel",
                Previous = previous,
                Current = current
            };

            await SendEvaluationRequestAsync(request, "api/Alarms/evaluateTop");
        }

        public async Task EvaluateDynamicAsync(DynamicDeviceDataDto previous, DynamicDeviceDataDto current)
        {
            var request = new
            {
                Type = "Dynamic",
                Previous = previous,
                Current = current
            };

            await SendEvaluationRequestAsync(request, "api/Alarms/evaluateDynamic");
        }

        private async Task SendEvaluationRequestAsync<T>(T payload, string endpoint)
        {
            var json = JsonSerializer.Serialize(payload, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            try
            {
                var response = await _httpClient.PostAsync(endpoint, content);
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Alarm service returned non-success status: {StatusCode}", response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to call alarm evaluation service.");
            }
        }
    }
}
