using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Domain.Entities;

namespace Application.Interface
{
    public interface IAlarmEvaluationService
    {
        public Task<List<Alarm>> EvaluateTopLevelAsync(TopLevelDeviceDataDto current, TopLevelDeviceDataDto previous);

        public Task<List<Alarm>> EvaluateDynamicAsync(DynamicDeviceDataDto current, DynamicDeviceDataDto previous);


    }

}
