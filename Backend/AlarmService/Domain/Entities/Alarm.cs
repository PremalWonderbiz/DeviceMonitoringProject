using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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

        [MaxLength(255, ErrorMessage = "Alarm Comment must be 255 characters or less")]
        public string Comment { get; set; } = "";
        public string AcknowledgedFrom { get; set; } = "";
        public DateTime RaisedAt { get; set; } = DateTime.UtcNow;
        public bool IsAcknowledged { get; set; } = false;
        public DateTime? AcknowledgedAt { get; set; }   
        public DateTime? ResolvedAt { get; set; }
        public int StateId { get; set; } = 1;
        public AlarmState State { get; set; } = default!;  
    }
}
