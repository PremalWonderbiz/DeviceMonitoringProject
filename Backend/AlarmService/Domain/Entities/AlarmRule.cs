using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enums;

namespace Domain.Entities
{
        public class AlarmRule
        {
            public Guid Id { get; set; } = Guid.NewGuid();

            public string DeviceMacId { get; set; } = default!;

            public string FieldPath { get; set; } = default!; // e.g., "dynamicProperties.Current Room Temperature"

            public string Operator { get; set; } = default!; // e.g., "GreaterThan"

            public string ThresholdValue { get; set; } = default!; // stored as string for flexible parsing

            public AlarmSeverity Severity { get; set; } = AlarmSeverity.Warning;

            public string MessageTemplate { get; set; } = default!;

            public DateTime CreatedAt { get; set; } = DateTime.Now;
        }
    

}
