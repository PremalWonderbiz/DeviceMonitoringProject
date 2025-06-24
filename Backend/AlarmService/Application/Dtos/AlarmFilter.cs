using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class AlarmFilter
    {
        public List<string> Devices { get; set; }
        public string[] FilterDateRange { get; set; }
    }

}
