﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class GetLatestAlarmForDeviceDto
    {
        public int TotalAlarms { get; set; }
        public GetAlarmDto Alarm { get; set; }
    }
}
