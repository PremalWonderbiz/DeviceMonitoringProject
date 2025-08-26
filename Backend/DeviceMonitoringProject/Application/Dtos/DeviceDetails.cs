using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class DeviceDetails
    {
        public string FileName { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Status { get; set; }
        public string MacId { get; set; }
        public string Connectivity { get; set; }
        public JsonElement StaticProperties { get; set; }
        public JsonElement DynamicProperties { get; set; }
    }
}
