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
        public DateTime RaisedAt { get; set; } = DateTime.Now;
        public bool IsAcknowledged { get; set; } = false;
        public DateTime? AcknowledgedAt { get; set; }
    }
}
