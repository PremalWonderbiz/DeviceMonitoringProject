﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class DevicesTopLevelLiveData
    {
        public string Status { get; set; }
        public string MacId { get; set; }
        public string Connectivity { get; set; }
        public DateTime? LastUpdated { get; set; }

    }
}
