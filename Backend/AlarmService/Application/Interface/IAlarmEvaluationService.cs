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
        Task<List<Alarm>> EvaluateAsync(LiveDeviceDataDto currentData, LiveDeviceDataDto previousData);
    }

}
