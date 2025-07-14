using System.Globalization;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Text.Json;
using Application.Dtos;
using Common.Helper_Classes;
using Domain.Entities;
using Domain.Interface;
using Infrastructure.Persistence;
using Infrastructure.RealTime;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Infrastructure.Services
{
    public class AlarmService : IAlarmService
    {
        private readonly AlarmDbContext _context;
        private readonly IHubContext<AlertHub> _hubContext;

        public AlarmService(AlarmDbContext context, IHubContext<AlertHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        public async Task<IEnumerable<GetAlarmDto>> GetAlarms(AlarmFilter filter)
        {
            var ignoredStateId = await _context.AlarmStates.Where(state => state.Name == "Ignored").Select(state => state.Id).FirstOrDefaultAsync();
            var alarms = _context.Alarms.Where(alarm => alarm.StateId != ignoredStateId).Include(a => a.State).AsQueryable();
            if (filter.Devices is not null && filter.Devices.Count > 0)
                alarms = alarms.Where(a => filter.Devices.Contains(a.SourceDeviceMacId));

            if (filter.FilterDateRange?.Length == 2 &&
                DateTime.TryParse
                        (filter.FilterDateRange[0],
                        CultureInfo.InvariantCulture,
                        DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
                        out var startDate) &&
                DateTime.TryParse
                        (filter.FilterDateRange[1],
                        CultureInfo.InvariantCulture,
                        DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
                        out var endDate))
            {
                alarms = alarms.Where(a => a.RaisedAt >= startDate && a.RaisedAt <= endDate);
            }

            var formattedAlarms = await alarms.Select(alarm => new GetAlarmDto
            {
                Id = alarm.Id,
                AcknowledgedAt = alarm.AcknowledgedAt,
                IsAcknowledged = alarm.IsAcknowledged,
                Message = alarm.Message,
                RaisedAt = alarm.RaisedAt,
                Severity = alarm.Severity.ToString(),
                SourceDeviceMacId = alarm.SourceDeviceMacId,
                AlarmState = alarm.State.Name,
                AlarmComment = alarm.Comment,
                AcknowledgedFrom = alarm.AcknowledgedFrom
            }).ToListAsync();

            return formattedAlarms;
        }

        public async Task<GetAlarmDto> GetAlarm(Guid id)
        {
            var alarm = await _context.Alarms.FindAsync(id);

            if (alarm == null)
                throw new CustomException(404, "Alarm not found");

            return new GetAlarmDto
            {
                Id = alarm.Id,
                AcknowledgedAt = alarm.AcknowledgedAt,
                IsAcknowledged = alarm.IsAcknowledged,
                Message = alarm.Message,
                RaisedAt = alarm.RaisedAt,
                Severity = alarm.Severity.ToString(),
                SourceDeviceMacId = alarm.SourceDeviceMacId
            };
        }

        public async Task<string> PutAlarm(Guid id, Alarm alarm)
        {
            if (id != alarm.Id)
                throw new CustomException(400, "Alarm id's don't match");

            _context.Entry(alarm).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AlarmExists(id))
                {
                    throw new CustomException(404, "Alarm not found");
                }
                else
                {
                    throw;
                }
            }

            return "Alarm updated successfully";
        }

        public async Task<Alarm> PostAlarm(PostAlarmDto alarmDto)
        {
            var alarm = new Alarm
            {
                SourceDeviceMacId = alarmDto.SourceDeviceMacId,
                Message = alarmDto.Message,
                Severity = alarmDto.Severity
            };

            _context.Alarms.Add(alarm);
            await _context.SaveChangesAsync();

            return alarm;
        }

        public async Task<GetAlarmDto> IgnoreAlarm(Guid id, string comment)
        {
            var alarm = await _context.Alarms.SingleOrDefaultAsync(alarm => alarm.Id == id);
            if (alarm is null)
                throw new CustomException(400, "Alarm not found");

            if (alarm.IsAcknowledged is false)
            {
                alarm.IsAcknowledged = true;
                alarm.AcknowledgedAt = DateTime.Now;
                alarm.AcknowledgedFrom = "Ignored without investigation";
            }
            else
            {
                alarm.AcknowledgedFrom = "Ignored with investigation";
            }

            var ignoredState = await _context.AlarmStates.SingleOrDefaultAsync(alarm => alarm.Name == "Ignored");
            alarm.StateId = ignoredState?.Id??1002; //1002 is hardcoded here later will throw exception or handle it here
            alarm.Comment = (comment != "manual" && comment.Length > 0) ? comment : "Manually marked as Ignored";

            _context.Entry(alarm).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                throw new CustomException(500, ex.Message);
            }

            var mainPageUpdates = await GetLatestFiveAlarms();
            var serializedData = JsonSerializer.Serialize(mainPageUpdates, new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                WriteIndented = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            });
            await _hubContext.Clients.All.SendAsync("ReceiveMainPageUpdates", serializedData);

            var propertyPanelAlarm = await GetLatestAlarmForDevice(alarm.SourceDeviceMacId);
            await _hubContext.Clients.Group($"Alarm-{alarm.SourceDeviceMacId}").SendAsync("ReceivePropertyPanelAlarmUpdates", JsonSerializer.Serialize(propertyPanelAlarm, new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            }));

            return new GetAlarmDto
            {
                Id = alarm.Id,
                AcknowledgedAt = alarm.AcknowledgedAt,
                IsAcknowledged = alarm.IsAcknowledged,
                Message = alarm.Message,
                RaisedAt = alarm.RaisedAt,
                Severity = alarm.Severity.ToString(),
                SourceDeviceMacId = alarm.SourceDeviceMacId,
                AlarmState = alarm.State.Name,
                AlarmComment = alarm.Comment,
                AcknowledgedFrom = alarm.AcknowledgedFrom
            };
        }

        private bool AlarmExists(Guid id)
        {
            return _context.Alarms.Any(e => e.Id == id);
        }

        public async Task<IEnumerable<GetAlarmDto>> GetAlarmsByDeviceId(string id)
        {
            var ignoredStateId = await _context.AlarmStates.Where(state => state.Name == "Ignored").Select(state => state.Id).FirstOrDefaultAsync();
            var alarms = await _context.Alarms.Where(alarm => alarm.SourceDeviceMacId == id && alarm.StateId != ignoredStateId).Include(a => a.State).ToListAsync();

            var formattedAlarms = new List<GetAlarmDto>();
            alarms.ForEach(alarm => {
                formattedAlarms.Add(new GetAlarmDto
                {
                    Id = alarm.Id,
                    AcknowledgedAt = alarm.AcknowledgedAt,
                    IsAcknowledged = alarm.IsAcknowledged,
                    Message = alarm.Message,
                    RaisedAt = alarm.RaisedAt,
                    Severity = alarm.Severity.ToString(),
                    SourceDeviceMacId = alarm.SourceDeviceMacId,
                    AlarmState = alarm.State.Name,
                    AlarmComment = alarm.Comment,
                    AcknowledgedFrom = alarm.AcknowledgedFrom
                });
            });

            return formattedAlarms;
        }

        public async Task<GetAlarmDto> InvestigateAlarm(Guid alarmId)
        {
            var alarm = await _context.Alarms.SingleOrDefaultAsync(alarm => alarm.Id == alarmId);
            if (alarm is null)
                throw new CustomException(400, "Alarm not found");

            alarm.IsAcknowledged = true;
            alarm.AcknowledgedAt = DateTime.Now;

            var investigateState = await _context.AlarmStates.SingleOrDefaultAsync(alarm => alarm.Name == "Investigating");
            alarm.StateId = investigateState?.Id ?? 2; //2 is hardcoded here later will throw exception or handle it here
            alarm.Comment = "Under Investigation";
            alarm.AcknowledgedFrom = "Alarm acknowledged";

            _context.Entry(alarm).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                throw new CustomException(500, ex.Message);
            }

            return new GetAlarmDto
            {
                Id = alarm.Id,
                AcknowledgedAt = alarm.AcknowledgedAt,
                IsAcknowledged = alarm.IsAcknowledged,
                Message = alarm.Message,
                RaisedAt = alarm.RaisedAt,
                Severity = alarm.Severity.ToString(),
                SourceDeviceMacId = alarm.SourceDeviceMacId,
                AlarmState = alarm.State.Name,
                AlarmComment = alarm.Comment,
                AcknowledgedFrom = alarm.AcknowledgedFrom
            };
        }

        public async Task<GetLatestAlarmsDto> GetLatestFiveAlarms()
        {
            var ignoredStateId = await _context.AlarmStates.Where(state => state.Name == "Ignored").Select(state => state.Id).FirstOrDefaultAsync();
            var alarms = await _context.Alarms.Where(alarm => alarm.StateId != ignoredStateId).Include(a => a.State).OrderByDescending(a => a.RaisedAt).Take(5).ToListAsync();
            var totalAlarms = await _context.Alarms.Where(alarm => alarm.StateId != ignoredStateId).CountAsync();

            var formattedAlarms = new List<GetAlarmDto>();
            alarms.ForEach(alarm => {
                formattedAlarms.Add(new GetAlarmDto
                {
                    Id = alarm.Id,
                    AcknowledgedAt = alarm.AcknowledgedAt,
                    IsAcknowledged = alarm.IsAcknowledged,
                    Message = alarm.Message,
                    RaisedAt = alarm.RaisedAt,
                    Severity = alarm.Severity.ToString(),
                    SourceDeviceMacId = alarm.SourceDeviceMacId,
                    AlarmState = alarm.State.Name,
                    AlarmComment = alarm.Comment
                });
            });

            return new GetLatestAlarmsDto
            {
                TotalAlarms = totalAlarms,
                Alarms = formattedAlarms
            };
        }

        public async Task<GetLatestAlarmForDeviceDto> GetLatestAlarmForDevice(string deviceMacId)
        {
            var ignoredStateId = await _context.AlarmStates.Where(state => state.Name == "Ignored").Select(state => state.Id).FirstOrDefaultAsync();
            var alarms = _context.Alarms.Where(a => a.SourceDeviceMacId == deviceMacId && a.StateId != ignoredStateId)?.Include(a => a.State).OrderByDescending(a => a.RaisedAt).AsQueryable();
            var totalAlarms = await alarms.CountAsync();
            var alarm = await alarms.FirstOrDefaultAsync();
            if (alarm == null)
                throw new CustomException(404, "Alarm for this device not found");

            var formattedAlarm = new GetAlarmDto
            {
                Id = alarm.Id,
                AcknowledgedAt = alarm.AcknowledgedAt,
                IsAcknowledged = alarm.IsAcknowledged,
                Message = alarm.Message,
                RaisedAt = alarm.RaisedAt,
                Severity = alarm.Severity.ToString(),
                SourceDeviceMacId = alarm.SourceDeviceMacId,
                AlarmState = alarm.State.Name
            };

            return new GetLatestAlarmForDeviceDto
            {
                TotalAlarms = totalAlarms,
                Alarm = formattedAlarm
            };
        }

        public async Task<IEnumerable<GetAlarmStatesDto>> GetAlarmStates()
        {
            var states = await _context.AlarmStates.Select(state => new GetAlarmStatesDto
            {
                Id= state.Id,
                Name = state.Name,
            }).ToListAsync();

            return states;
        }

        public async Task<GetAlarmDto> ResolveAlarm(Guid alarmId, string comment)
        {
            var alarm = await _context.Alarms.SingleOrDefaultAsync(alarm => alarm.Id == alarmId);
            if (alarm is null)
                throw new CustomException(400, "Alarm not found");

            if(alarm.IsAcknowledged is false)
            {
                alarm.IsAcknowledged = true;
                alarm.AcknowledgedAt = DateTime.Now;
                alarm.AcknowledgedFrom = "Resolved without investigation";
            }
            else
            {
                alarm.AcknowledgedFrom = "Resolved with investigation";
            }

                var resolvedState = await _context.AlarmStates.SingleOrDefaultAsync(alarm => alarm.Name == "Resolved");
            alarm.StateId = resolvedState?.Id ?? 3; //3 is hardcoded here later will throw exception or handle it here
            alarm.Comment = (comment != "manual" && comment.Length > 0) ? comment : "Manually marked as Resoved";
            alarm.ResolvedAt = DateTime.Now;
            

            _context.Entry(alarm).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                throw new CustomException(500, ex.Message);
            }

            return new GetAlarmDto
            {
                Id = alarm.Id,
                AcknowledgedAt = alarm.AcknowledgedAt,
                IsAcknowledged = alarm.IsAcknowledged,
                Message = alarm.Message,
                RaisedAt = alarm.RaisedAt,
                Severity = alarm.Severity.ToString(),
                SourceDeviceMacId = alarm.SourceDeviceMacId,
                AlarmState = alarm.State.Name,
                AlarmComment = alarm.Comment,
                AcknowledgedFrom = alarm.AcknowledgedFrom
            };
        }
    }
}
