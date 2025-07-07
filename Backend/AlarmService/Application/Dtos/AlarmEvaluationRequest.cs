using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class TopLevelAlarmEvaluationRequest
    {
        public string Type { get; set; } = "TopLevel"; // optional, for extensibility
        public TopLevelDeviceDataDto Previous { get; set; } = default!;
        public TopLevelDeviceDataDto Current { get; set; } = default!;
    }

    public class DynamicAlarmEvaluationRequest
    {
        public string Type { get; set; } = "Dynamic"; // optional, for extensibility
        public DynamicDeviceDataDto Previous { get; set; } = default!;
        public DynamicDeviceDataDto Current { get; set; } = default!;
    }

}
