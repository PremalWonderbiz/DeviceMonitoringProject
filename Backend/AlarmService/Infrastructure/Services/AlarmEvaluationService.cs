using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Interface;
using Common.Helper_Classes;
using Domain.Entities;
using Infrastructure.Migrations;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class AlarmEvaluationService : IAlarmEvaluationService
    {
        private readonly AlarmDbContext _dbContext;

        public AlarmEvaluationService(AlarmDbContext dbContext)
        {
            _dbContext = dbContext;
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
