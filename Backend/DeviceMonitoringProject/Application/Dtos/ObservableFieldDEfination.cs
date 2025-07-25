using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class ObservableFieldDefinition
    {
        public string Type { get; set; } = "";
        public double? Min { get; set; }
        public double? Max { get; set; }
        public string? Unit { get; set; }
        public List<string>? Values { get; set; } // For enum, pickN, array value types
        public int? Count { get; set; }           // For array/pickN length
        public string? Prefix { get; set; }       // e.g., for time or string formatting
        public double? Probability { get; set; }  // Used in conditional/randomized generation
        public List<double>? Weights { get; set; } // For weighted random selection
        public string? Formula { get; set; }      // Not implemented in example below
        public Dictionary<string, ObservableFieldDefinition>? Children { get; set; }
    }
}
