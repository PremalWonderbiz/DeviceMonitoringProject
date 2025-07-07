using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class TopLevelDeviceDataDto
    {
        public string DeviceMacId { get; set; } = default!;
        public string Status { get; set; } = "Unknown";
        public string Connectivity { get; set; } = "Unknown";
    }

    public class DynamicDeviceDataDto
    {
        public string DeviceMacId { get; set; } = default!;
        public JsonElement DynamicProperties { get; set; }
    }
}
