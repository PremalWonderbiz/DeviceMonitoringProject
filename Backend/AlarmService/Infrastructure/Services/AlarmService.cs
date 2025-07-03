using System.Globalization;
using System.Security.Claims;
using Application.Dtos;
using Common.Helper_Classes;
using Domain.Entities;
using Domain.Interface;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Infrastructure.Services
{
    public class AlarmService : IAlarmService
    {
        private readonly AlarmDbContext _context;

        public AlarmService(AlarmDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<GetAlarmDto>> GetAlarms(AlarmFilter filter)
        {
            var alarms = _context.Alarms.AsQueryable();
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
                SourceDeviceMacId = alarm.SourceDeviceMacId
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

        public async Task<string> DeleteAlarm(Guid id)
        {
            var alarm = await _context.Alarms.FindAsync(id);
            if (alarm == null)
                throw new CustomException(404, "Alarm not found");

            _context.Alarms.Remove(alarm);
            await _context.SaveChangesAsync();

            return "Alarm deleted successfully";
        }

        private bool AlarmExists(Guid id)
        {
            return _context.Alarms.Any(e => e.Id == id);
        }

        public async Task<IEnumerable<GetAlarmDto>> GetAlarmsByDeviceId(string id)
        {
            var alarms = await _context.Alarms.Where(alarm => alarm.SourceDeviceMacId == id).ToListAsync();

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
                    SourceDeviceMacId = alarm.SourceDeviceMacId
                });
            });

            return formattedAlarms;
        }

        public async Task<string> AcknowledgeAlarm(Guid alarmId)
        {
            var alarm = await _context.Alarms.SingleOrDefaultAsync(alarm => alarm.Id == alarmId);
            if (alarm is null)
                throw new CustomException(400, "Alarm not found");

            alarm.IsAcknowledged = true;
            alarm.AcknowledgedAt = DateTime.Now;

            var investigateState = await _context.AlarmStates.SingleOrDefaultAsync(alarm => alarm.Name == "Investigating");
            alarm.StateId = investigateState?.Id ?? 2; //2 is hardcoded here later will throw exception or handle it here
            alarm.Comment = "Alarm is in 'Investigating' state currently";

            _context.Entry(alarm).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                throw new CustomException(500, ex.Message);
            }

            return "Alarm moved in investigating state";
        }

        public async Task<GetLatestAlarmsDto> GetLatestFiveAlarms()
        {
            var alarms = await _context.Alarms.OrderByDescending(a => a.RaisedAt).Take(5).ToListAsync();
            var totalAlarms = await _context.Alarms.CountAsync();

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
                    SourceDeviceMacId = alarm.SourceDeviceMacId
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
            var alarms = _context.Alarms.Where(a => a.SourceDeviceMacId == deviceMacId)?.OrderByDescending(a => a.RaisedAt).AsQueryable();
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
                SourceDeviceMacId = alarm.SourceDeviceMacId
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

        public async Task<string> ResolveAlarm(Guid alarmId, string comment)
        {
            var alarm = await _context.Alarms.SingleOrDefaultAsync(alarm => alarm.Id == alarmId);
            if (alarm is null)
                throw new CustomException(400, "Alarm not found");

            if(alarm.IsAcknowledged is false)
            {
                alarm.IsAcknowledged = true;
                alarm.AcknowledgedAt = DateTime.Now;
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

            return "Alarm moved in resolved state";
        }
    }
}
