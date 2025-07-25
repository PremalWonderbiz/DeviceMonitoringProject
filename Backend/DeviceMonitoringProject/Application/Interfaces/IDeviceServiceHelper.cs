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
        public TopLevelDeviceDataDto ExtractTopLevelDto(string macId, JsonNode rootNode);
        public DynamicDeviceDataDto ExtractDynamicDto(string macId, JsonNode rootNode);

        public JsonNode UpdateDynamicProperties(JsonNode? currentData, JsonNode? dynamicObservables);

        public Task WriteJsonFileAsync(string path, JsonNode rootNode);

        public Task BroadcastDeviceDetailUpdates(List<(string MacId, string EventName, JsonElement DetailPayload)> updates);

        public Task BroadcastTopLevelSummary(List<(DeviceMetadata device, List<string> updatedFields)> allDevices);
    }
}
