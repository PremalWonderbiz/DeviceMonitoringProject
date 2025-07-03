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

        public Task<string> AcknowledgeAlarm(Guid alarmId);

        public Task<string> ResolveAlarm(Guid alarmId, string comment);

        public Task<Alarm> PostAlarm(PostAlarmDto alarm);

        public Task<string> DeleteAlarm(Guid id);

        public Task<GetLatestAlarmsDto> GetLatestFiveAlarms();

        //states
        public Task<IEnumerable<GetAlarmStatesDto>> GetAlarmStates();
    }
}
