using Application.Dtos;
using Domain.Entities;

namespace Domain.Interface
{
    public interface IAlarmService
    {
        public Task<IEnumerable<GetAlarmDto>> GetAlarms(AlarmFilter filter);
        public Task<GetLatestAlarmForDeviceDto> GetLatestAlarmForDevice(string deviceMacId);

        public Task<IEnumerable<GetAlarmDto>> GetAlarmsByDeviceId(string id);

        public Task<GetAlarmDto> GetAlarm(Guid id);

        public Task<string> PutAlarm(Guid id, Alarm alarm);

        public Task<GetAlarmDto> InvestigateAlarm(Guid alarmId);

        public Task<GetAlarmDto> ResolveAlarm(Guid alarmId, string comment);

        public Task<Alarm> PostAlarm(PostAlarmDto alarm);

        public Task<GetAlarmDto> IgnoreAlarm(Guid id, string comment);

        public Task<GetLatestAlarmsDto> GetLatestFiveAlarms();

        //states
        public Task<IEnumerable<GetAlarmStatesDto>> GetAlarmStates();

        //add alarm rules for new device(coming from device project when we add new device)
        public Task<string> AddAlarmRulesAsync(string deviceMacId, List<AlarmRuleDto> rules);
    }
}
