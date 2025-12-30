using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class GetAlarmDtoV2
    {
        public string SourceDeviceMacId { get; set; }
        public string Severity { get; set; }
        public string Message { get; set; }

    }
}
