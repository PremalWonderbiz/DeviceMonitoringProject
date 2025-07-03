using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class AlarmState
    {
        public int Id { get; set; }  
        public string Name { get; set; } = default!;
        public ICollection<Alarm> Alarms { get; set; } = new List<Alarm>();
    }
}
