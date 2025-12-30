using Application.Dtos;
using Domain.Interface;
//cmt to verify codegen v1
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

        public async Task<IEnumerable<GetAlarmDtoV2>> GetAlarmsV2(
        AlarmFilter filter,
        [Service] IAlarmService alarmService)
        {
            var res = await alarmService.GetAlarms(filter);
            var formatted = res.Select(a => new GetAlarmDtoV2
            {
                SourceDeviceMacId = a.SourceDeviceMacId,
                Severity = a.Severity,
                Message = a.Message
            });
            return formatted;
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
