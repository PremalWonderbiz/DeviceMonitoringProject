using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
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

        public async Task EvaluateAsync(LiveDeviceDataDto previous, LiveDeviceDataDto current)
        {
            var request = new AlarmEvaluationRequest
            {
                Previous = previous,
                Current = current
            };

            var json = JsonSerializer.Serialize(request, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            try
            {
                var response = await _httpClient.PostAsync("api/Alarms/testFlattenJson", content);
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
