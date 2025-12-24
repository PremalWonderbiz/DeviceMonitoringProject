using Application.Dtos;
using Domain.Interface;

namespace API.GraphQL;

public class AlarmMutations
{
    public async Task<GetAlarmDto> InvestigateAlarm(
        Guid id,
        [Service] IAlarmService alarmService)
    {
        return await alarmService.InvestigateAlarm(id);
    }

    public async Task<GetAlarmDto> ResolveAlarm(
        Guid id,
        string comment,
        [Service] IAlarmService alarmService)
    {
        return await alarmService.ResolveAlarm(id, comment);
    }

    public async Task<GetAlarmDto> IgnoreAlarm(
        Guid id,
        string comment,
        [Service] IAlarmService alarmService)
    {
        return await alarmService.IgnoreAlarm(id, comment);
    }
}
