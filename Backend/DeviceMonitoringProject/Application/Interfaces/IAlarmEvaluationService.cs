using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;

namespace Application.Interfaces
{
    public interface IAlarmEvaluationService
    {
        Task EvaluateTopAsync(TopLevelDeviceDataDto previous, TopLevelDeviceDataDto current);
        Task EvaluateDynamicAsync(DynamicDeviceDataDto previous, DynamicDeviceDataDto current);
        Task AddAlarmRules(string deviceMacId, List<AlarmRuleDto> alarmRules);
    }
}
