
namespace Application.Dtos
{
    public class DeviceMetadataPaginatedandSortedDto
    {
        public int TotalCount { get; set; }
        public List<DeviceMetadata> DeviceMetadata { get; set; }
    }
}
