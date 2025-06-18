using Application.Dtos;
using Domain.Entities;

namespace Application.Interfaces
{
    public interface IDeviceService
    {
        public List<DeviceMetadata> GetAllDeviceMetadata();

        public DeviceMetadataPaginated GetAllDeviceMetadataPaginated(int pageNumber = 1, int pageSize = 10);

        public Dictionary<string, string> GetMacIdToFileNameMap();

        public Task<DeviceDetails> GetPropertyPanelDataForDevice(string deviceFileName);

        public Task<bool> GenerateAndSendLiveUpdatesDevicesData();
    }
}
