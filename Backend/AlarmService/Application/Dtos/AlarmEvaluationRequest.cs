using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class AlarmEvaluationRequest
    {
        public LiveDeviceDataDto Previous { get; set; } = default!;
        public LiveDeviceDataDto Current { get; set; } = default!;
    }
}
