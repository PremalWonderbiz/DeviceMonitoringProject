using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using Application.Dtos;

namespace Application.Interfaces
{
    public interface IDynamicDataHelper
    {
        string GetRandomStatus();
        string GetRandomConnectivity();
        public JsonNode GenerateDynamicDataFromObservables(JsonNode? currentData, JsonNode? dynamicObservables);
    }
}
