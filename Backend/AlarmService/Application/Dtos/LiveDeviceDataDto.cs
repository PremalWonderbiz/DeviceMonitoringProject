using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class LiveDeviceDataDto
    {
        public string DeviceMacId { get; set; } = default!;
        public string Status { get; set; } = default!;
        public string Connectivity { get; set; } = default!;

        public JsonElement DynamicProperties { get; set; } // keep it raw for now
    }

}
