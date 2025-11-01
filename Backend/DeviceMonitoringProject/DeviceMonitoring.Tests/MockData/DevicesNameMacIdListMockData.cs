using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;

namespace DeviceMonitoring.Tests.MockData
{
    public class DevicesNameMacIdListMockData
    {
        public static List<DevicesNameMacIdDto> GetMockDeviceNameMacIdList()
        {
            return new List<DevicesNameMacIdDto>
            {
                new DevicesNameMacIdDto { DeviceName = "Router", DeviceMacId = "AA:BB:CC:DD:EE:01" },
                new DevicesNameMacIdDto { DeviceName = "Printer", DeviceMacId = "AA:BB:CC:DD:EE:02" },
                new DevicesNameMacIdDto { DeviceName = "Smart TV", DeviceMacId = "AA:BB:CC:DD:EE:03" },
                new DevicesNameMacIdDto { DeviceName = "Laptop", DeviceMacId = "AA:BB:CC:DD:EE:04" },
                new DevicesNameMacIdDto { DeviceName = "IP Camera", DeviceMacId = "AA:BB:CC:DD:EE:05" }
            };
        }
    }
}
