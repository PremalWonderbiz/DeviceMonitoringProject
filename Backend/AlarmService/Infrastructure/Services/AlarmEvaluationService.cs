using System.Text.Encodings.Web;
using System.Text.Json;
using Application.Dtos;
using Application.Interface;
using Common.Helper_Classes;
using Domain.Entities;
using Domain.Interface;
using Infrastructure.Persistence;
using Infrastructure.RealTime;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class AlarmEvaluationService : IAlarmEvaluationService
    {
        private readonly AlarmDbContext _dbContext;
        private readonly IHubContext<AlertHub> _hubContext;
        private readonly IAlarmService _alarmService;

        public AlarmEvaluationService(AlarmDbContext dbContext, IHubContext<AlertHub> hubContext, IAlarmService alarmService)
        {
            _dbContext = dbContext;
            _hubContext = hubContext;
            _alarmService = alarmService;
        }

        public async Task<List<Alarm>> EvaluateTopLevelAsync(TopLevelDeviceDataDto current, TopLevelDeviceDataDto previous)
        {
            var currentFlat = new Dictionary<string, string>
            {
                ["Status"] = current.Status ?? "Unknown",
                ["Connectivity"] = current.Connectivity ?? "Unknown"
            };

            var previousFlat = new Dictionary<string, string>
            {
                ["Status"] = previous.Status ?? "Unknown",
                ["Connectivity"] = previous.Connectivity ?? "Unknown"
            };

            return await EvaluateRulesAsync(current.DeviceMacId, currentFlat, previousFlat);
        }

        public async Task<List<Alarm>> EvaluateDynamicAsync(DynamicDeviceDataDto current, DynamicDeviceDataDto previous)
        {
            var currentFlat = JsonFlattener.FlattenJson(current.DynamicProperties);
            var previousFlat = JsonFlattener.FlattenJson(previous.DynamicProperties);

            return await EvaluateRulesAsync(current.DeviceMacId, currentFlat, previousFlat);
        }

        private async Task<List<Alarm>> EvaluateRulesAsync(string deviceMacId, Dictionary<string, string> currentFlat, Dictionary<string, string> previousFlat)
        {
            var rules = await _dbContext.AlarmRules
                .Where(r => r.DeviceMacId == deviceMacId)
                .ToListAsync();

            var triggeredAlarms = new List<Alarm>();

            foreach (var rule in rules)
            {
                if (!currentFlat.TryGetValue(rule.FieldPath, out var currentValue))
                    continue;

                if (!IsThresholdBreached(currentValue, rule.Operator, rule.ThresholdValue))
                    continue;

                if (previousFlat.TryGetValue(rule.FieldPath, out var previousValue) &&
                    previousValue == currentValue)
                {
                    continue;
                }

                var alarm = new Alarm
                {
                    SourceDeviceMacId = deviceMacId,
                    Message = rule.MessageTemplate.Replace("{value}", currentValue),
                    Severity = rule.Severity
                };

                triggeredAlarms.Add(alarm);
            }

            if (triggeredAlarms.Any())
            {
                _dbContext.Alarms.AddRange(triggeredAlarms);
                await _dbContext.SaveChangesAsync();

                var mainPageUpdates = await _alarmService.GetLatestFiveAlarms();
                var serializedData = JsonSerializer.Serialize(mainPageUpdates, new JsonSerializerOptions
                {
                    Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true,
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                });
                await _hubContext.Clients.All.SendAsync("ReceiveMainPageUpdates", serializedData);

                var alarmPanelUpdates = await _alarmService.GetAlarms(new AlarmFilter());
                await _hubContext.Clients.Group("AlarmPanelGroup").SendAsync("ReceiveAlarmPanelUpdates",
                    JsonSerializer.Serialize(alarmPanelUpdates, new JsonSerializerOptions
                    {
                        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                        WriteIndented = true
                    }));

                var propertyPanelAlarm = await _alarmService.GetLatestAlarmForDevice(deviceMacId);
                await _hubContext.Clients.Group($"Alarm-{deviceMacId}").SendAsync("ReceivePropertyPanelAlarmUpdates",
                    JsonSerializer.Serialize(propertyPanelAlarm, new JsonSerializerOptions
                    {
                        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                        WriteIndented = true
                    }));
            }

            return triggeredAlarms;
        }

        private bool IsThresholdBreached(string current, string op, string threshold)
        {
            string normalizedOp = op.Trim().ToLowerInvariant();

            string Clean(string val) => val.Trim()
                                           .TrimEnd('%', '°', 'C', 'c')
                                           .Replace("ms", "", StringComparison.OrdinalIgnoreCase)
                                           .Replace("Kbps", "", StringComparison.OrdinalIgnoreCase)
                                           .Replace("Mbps", "", StringComparison.OrdinalIgnoreCase)
                                           .Replace("GB", "", StringComparison.OrdinalIgnoreCase)
                                           .Replace("MB", "", StringComparison.OrdinalIgnoreCase)
                                           .Replace("°C", "", StringComparison.OrdinalIgnoreCase);

            string cleanedCurrent = Clean(current);
            string cleanedThreshold = Clean(threshold);

            if (double.TryParse(cleanedCurrent, out var currNum) &&
                double.TryParse(cleanedThreshold, out var threshNum))
            {
                return normalizedOp switch
                {
                    "greaterthan" => currNum > threshNum,
                    "lessthan" => currNum < threshNum,
                    "equals" => currNum == threshNum,
                    "notequals" => currNum != threshNum,
                    "greaterthanorequal" => currNum >= threshNum,
                    "lessthanorequal" => currNum <= threshNum,
                    _ => false
                };
            }

            if (normalizedOp == "isdatepast")
            {
                if (DateTime.TryParse(current, out var dateVal))
                    return dateVal < DateTime.Now;

                return false;
            }

            return normalizedOp switch
            {
                "equals" => string.Equals(current, threshold, StringComparison.OrdinalIgnoreCase),
                "notequals" => !string.Equals(current, threshold, StringComparison.OrdinalIgnoreCase),
                _ => false
            };
        }
    }
}
