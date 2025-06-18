
namespace Application.Dtos
{
    public class DeviceMetadataPaginated
    {
        public int TotalCount { get; set; }
        public List<DeviceMetadata> DeviceMetadata { get; set; }
    }
}
