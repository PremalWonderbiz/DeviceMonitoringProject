﻿using Application.Dtos;
using Domain.Entities;

namespace Application.Interfaces
{
    public interface IDeviceService
    {
        public List<DeviceMetadata> GetAllDeviceMetadata();

        public DeviceMetadataPaginated GetAllDeviceMetadataPaginated(int pageNumber = 1, int pageSize = 10);

        public DeviceMetadataPaginated GetSearchedDeviceMetadataPaginated(int pageNumber = 1, int pageSize = 10, string input="");

        public Dictionary<string, string> GetMacIdToFileNameMap();

        public Task<DeviceDetails> GetPropertyPanelDataForDevice(string deviceFileName);

        public Task<bool> GenerateAndSendLiveUpdatesDevicesData();

        public Task<List<DevicesNameMacIdDto>> GetDevicesNameMacIdList();
    }
}
