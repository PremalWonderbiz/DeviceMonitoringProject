using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class GetLatestAlarmsDto
    {
        public int TotalAlarms { get; set; }
        public List<GetAlarmDto> Alarms { get; set; }
    }
}
