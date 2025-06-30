using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json.Nodes;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Dtos;

namespace Application.Interfaces
{
    public interface IDeviceServiceHelper
    {
        public LiveDeviceDataDto ExtractLiveDataDto(DeviceMetadata device, JsonNode rootNode);

        public void UpdateDynamicProperties(string deviceType, JsonNode? dynamicProps);

        public Task WriteJsonFileAsync(string path, JsonNode rootNode);

        public Task BroadcastDeviceDetailUpdates(List<(string MacId, string EventName, object DetailPayload)> updates);

        public Task BroadcastTopLevelSummary(List<DeviceMetadata> allDevices);
    }
}
