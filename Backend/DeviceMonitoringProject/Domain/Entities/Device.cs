using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class Device
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string MacId { get; set; } = default!;

        [Required]
        public string Name { get; set; } = default!;

        public string Type { get; set; } = default!;
        public string FileName { get; set; } = default!;
        public string Status { get; set; } = default!;
        public string Connectivity { get; set; } = default!;
        public DateTime LastUpdated { get; set; }

        // Store JSON as string
        public string StaticPropertiesJson { get; set; } = "{}";
        public string DynamicPropertiesJson { get; set; } = "{}";
        public string TopLevelObservablesJson { get; set; } = "{}";
        public string DynamicObservablesJson { get; set; } = "{}";
    }

}
