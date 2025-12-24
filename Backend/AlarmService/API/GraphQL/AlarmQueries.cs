using Application.Dtos;
using Domain.Interface;

namespace API.GraphQL
{
    public class AlarmQueries
    {
        public async Task<IEnumerable<GetAlarmDto>> GetAlarms(
        AlarmFilter filter,
        [Service] IAlarmService alarmService)
        {
            return await alarmService.GetAlarms(filter);
        }

        public async Task<GetLatestAlarmsDto> GetLatestAlarms(
       [Service] IAlarmService alarmService)
        {
            return await alarmService.GetLatestFiveAlarms();
        }

        public async Task<GetLatestAlarmForDeviceDto> GetLatestAlarmForDevice(
       string deviceMacId,
       [Service] IAlarmService alarmService)
        {
            return await alarmService.GetLatestAlarmForDevice(deviceMacId);
        }

        public async Task<IEnumerable<GetAlarmStatesDto>> GetAlarmStates(
        [Service] IAlarmService alarmService)
        {
            return await alarmService.GetAlarmStates();
        }

        public async Task<IEnumerable<GetAlarmDto>> GetAlarmsByDeviceId(
       string deviceMacId,
       [Service] IAlarmService alarmService)
        {
            return await alarmService.GetAlarmsByDeviceId(deviceMacId);
        }
    }
}
