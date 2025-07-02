using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class DeviceTopLevelSortOptions
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public List<SortOption> Sorting { get; set; } = new();
    }

    public class SortOption
    {
        public string Id { get; set; } = "";
        public bool Desc { get; set; }
    }
}
