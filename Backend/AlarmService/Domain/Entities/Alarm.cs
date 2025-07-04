using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enums;

namespace Domain.Entities
{   
    public class Alarm
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string SourceDeviceMacId { get; set; } = default!;
        public AlarmSeverity Severity { get; set; } = AlarmSeverity.Warning;
        public string Message { get; set; } = default!;
        public string Comment { get; set; } = "";
        public DateTime RaisedAt { get; set; } = DateTime.Now;
        public bool IsAcknowledged { get; set; } = false;
        public DateTime? AcknowledgedAt { get; set; }   
        public DateTime? ResolvedAt { get; set; }
        public int StateId { get; set; } = 1;
        public AlarmState State { get; set; } = default!;  
    }
}
