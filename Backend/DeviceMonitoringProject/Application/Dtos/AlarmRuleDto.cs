using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class AlarmRuleDto
    {
        public string FieldPath { get; set; } = default!;
        public string Operator { get; set; } = default!;
        public string ThresholdValue { get; set; } = default!;
        public string Severity { get; set; } = default!;
        public string MessageTemplate { get; set; } = default!;
    }
}
