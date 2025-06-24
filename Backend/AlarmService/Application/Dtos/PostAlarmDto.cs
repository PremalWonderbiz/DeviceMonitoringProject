using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enums;

namespace Application.Dtos
{
    public class PostAlarmDto
    {
        public string SourceDeviceMacId { get; set; } = default!;
        public AlarmSeverity Severity { get; set; } = AlarmSeverity.Warning;
        public string Message { get; set; } = default!;
    }
}
