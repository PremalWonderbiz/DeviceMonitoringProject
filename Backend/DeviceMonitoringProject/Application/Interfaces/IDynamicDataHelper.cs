using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Nodes;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IDynamicDataHelper
    {
        string GetRandomStatus();
        string GetRandomConnectivity();
        JsonNode UpdateRoomAcDynamic(JsonNode dynamicNode);
        JsonNode UpdateIpCameraDynamic(JsonNode dynamicNode);
        JsonNode UpdateLaptopDynamic(JsonNode dynamicNode);
        JsonNode UpdateMobileDynamic(JsonNode dynamicNode);
        JsonNode UpdateNasDynamic(JsonNode dynamicNode);
        JsonNode UpdatePrinterDynamic(JsonNode dynamicNode);
        JsonNode UpdateRaspberryPiDynamic(JsonNode dynamicNode);
        JsonNode UpdateSmartTvDynamic(JsonNode dynamicNode);
        JsonNode UpdateSwitchDynamic(JsonNode dynamicNode);
        JsonNode UpdateWifiRouterDynamic(JsonNode dynamicNode);
    }
}
