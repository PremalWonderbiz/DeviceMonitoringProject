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

        public async Task<List<Alarm>> EvaluateAsync(LiveDeviceDataDto currentData, LiveDeviceDataDto previousData)
        {
            var currentFlat = JsonFlattener.FlattenDeviceData(currentData);
            var previousFlat = JsonFlattener.FlattenDeviceData(previousData);

            // Fetch rules for device
            var rules = await _dbContext.AlarmRules
                .Where(r => r.DeviceMacId == currentData.DeviceMacId)
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
                    SourceDeviceMacId = currentData.DeviceMacId,
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
                await _hubContext.Clients.Group($"AlarmPanelGroup").SendAsync("ReceiveAlarmPanelUpdates", JsonSerializer.Serialize(alarmPanelUpdates, new JsonSerializerOptions
                {
                    Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    WriteIndented = true
                }));
                
                var propertyPanelAlarm = await _alarmService.GetLatestAlarmForDevice(currentData.DeviceMacId);
                await _hubContext.Clients.Group($"Alarm-{currentData.DeviceMacId}").SendAsync("ReceivePropertyPanelAlarmUpdates", JsonSerializer.Serialize(propertyPanelAlarm, new JsonSerializerOptions
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

            // Strip common units/suffixes from values
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

            // Try numeric comparison
            if (double.TryParse(cleanedCurrent, out double currNum) && double.TryParse(cleanedThreshold, out double threshNum))
            {
                switch (normalizedOp)
                {
                    case "greaterthan": return currNum > threshNum;
                    case "lessthan": return currNum < threshNum;
                    case "equals": return currNum == threshNum;
                    case "notequals": return currNum != threshNum;
                    case "greaterthanorequal": return currNum >= threshNum;
                    case "lessthanorequal": return currNum <= threshNum;
                    default: return false;
                }
            }

            // Try Date comparison
            if (normalizedOp == "isdatepast")
            {
                if (DateTime.TryParse(current, out var dateVal))
                {
                    return dateVal < DateTime.Now;
                }
                return false;
            }

            // String comparison
            return normalizedOp switch
            {
                "equals" => string.Equals(current, threshold, StringComparison.OrdinalIgnoreCase),
                "notequals" => !string.Equals(current, threshold, StringComparison.OrdinalIgnoreCase),
                _ => false
            };
        }
    }
}
