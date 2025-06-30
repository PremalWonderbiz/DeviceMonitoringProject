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
        void UpdateRoomAcDynamic(JsonNode dynamicNode);
        void UpdateIpCameraDynamic(JsonNode dynamicNode);
        void UpdateLaptopDynamic(JsonNode dynamicNode);
        void UpdateMobileDynamic(JsonNode dynamicNode);
        void UpdateNasDynamic(JsonNode dynamicNode);
        void UpdatePrinterDynamic(JsonNode dynamicNode);
        void UpdateRaspberryPiDynamic(JsonNode dynamicNode);
        void UpdateSmartTvDynamic(JsonNode dynamicNode);
        void UpdateSwitchDynamic(JsonNode dynamicNode);
        void UpdateWifiRouterDynamic(JsonNode dynamicNode);
    }
}
