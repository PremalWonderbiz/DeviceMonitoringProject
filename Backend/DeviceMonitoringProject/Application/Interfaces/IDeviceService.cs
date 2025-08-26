using Application.Dtos;
using Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IDeviceService
    {
        public List<DeviceMetadata> GetAllDeviceMetadataPaginated(List<DeviceMetadata> metadata, int pageNumber = 1, int pageSize = 10);

        public DeviceMetadataPaginatedandSortedDto GetAllDeviceMetadataPaginatedandSorted(DeviceTopLevelSortOptions sortRequest, List<DeviceMetadata> filteredData = null);

        public DeviceMetadataPaginatedandSortedDto GetSearchedDeviceMetadataPaginated(DeviceTopLevelSortOptions sortRequest, string input="");

        public Dictionary<string, string> GetMacIdToFileNameMap();

        public Task<DeviceDetails> GetPropertyPanelDataForDevice(string deviceFileName);

        public Task<bool> GenerateAndSendLiveUpdatesDevicesData();

        public Task<bool> SimulateDynamicPropertiesUpdateForBatch();

        public Task<bool> SimulateTopLevelChangeForOneDevice();

        public Task<List<DevicesNameMacIdDto>> GetDevicesNameMacIdList();

        public Task<string> UploadFile(IFormFile file);

        public Task<DeviceMetadataPaginatedandSortedDto> GetAllDataRefereshedFromCache(DeviceTopLevelSortOptions request, string input);
    }
}
