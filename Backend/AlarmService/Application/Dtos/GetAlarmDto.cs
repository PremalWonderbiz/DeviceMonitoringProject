using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class GetAlarmDto
    {
        public Guid Id { get; set; }
        public string SourceDeviceMacId { get; set; }
        public string Severity { get; set; }
        public string Message { get; set; }
        public DateTime RaisedAt { get; set; }
        public bool IsAcknowledged { get; set; }
        public DateTime? AcknowledgedAt { get; set; }
        public string AlarmState { get; set; }
        public string AlarmComment { get; set; }
        public string AcknowledgedFrom { get; set; }

    }
}
