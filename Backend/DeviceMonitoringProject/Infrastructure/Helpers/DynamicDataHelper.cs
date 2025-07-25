using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using Application.Dtos;
using Application.Interfaces;

namespace Infrastructure.Helpers
{
    public class DynamicDataHelper : IDynamicDataHelper
    {
        private readonly Random random = new();
        private readonly string[] statuses = { "Online", "Offline" };
        private readonly string[] conns = { "Low", "Medium", "High" };

        string IDynamicDataHelper.GetRandomStatus()
        {
            return statuses[random.Next(statuses.Length)];
        }

        string IDynamicDataHelper.GetRandomConnectivity()
        {
            return conns[random.Next(conns.Length)];
        }

        public JsonNode GenerateDynamicDataFromObservables(JsonNode? currentData, JsonNode? dynamicObservables)
        {
            var rand = new Random();

            if (dynamicObservables is not JsonObject observableMap)
                return currentData;
            try
            {
                foreach (var (fieldName, observableDef) in observableMap)
                {
                    if (observableDef is not JsonObject defObj)
                        continue;

                    if (defObj.TryGetPropertyValue("type", out var typeNode) && typeNode != null)
                    {
                        // Leaf observable where type is present
                        var type = typeNode.GetValue<string>();
                        var generatedValue = GenerateValue(type, defObj, rand);
                        currentData[fieldName] = generatedValue;

                    }
                    else
                    {
                        // Nested structure where no types 
                        var existingChild = currentData[fieldName] as JsonNode ?? new JsonObject();

                        var updatedChild = GenerateDynamicDataFromObservables(existingChild, defObj);
                        currentData[fieldName] = updatedChild;
                    }
                }
            }
            catch(Exception ex)
            {
                return null;
            }

            return currentData;
        }

        private JsonNode GenerateValue(string type, JsonObject def, Random rand)
        {
            double min = def.TryGetPropertyValue("min", out var minNode) ? minNode?.GetValue<double>() ?? 0 : 0;
            double max = def.TryGetPropertyValue("max", out var maxNode) ? maxNode?.GetValue<double>() ?? 100 : 100;
            int count = def.TryGetPropertyValue("count", out var countNode) ? countNode?.GetValue<int>() ?? 3 : 3;

            switch (type)
            {
                case "int":
                    return JsonValue.Create(rand.Next((int)min, (int)max + 1));

                case "float":
                    return JsonValue.Create(Math.Round(min + rand.NextDouble() * (max - min), 2));

                case "percentage":
                    return JsonValue.Create($"{rand.Next(0, 101)}%");

                case "boolean":
                    return JsonValue.Create(rand.NextDouble() < 0.5);

                case "enum":
                    if (def.TryGetPropertyValue("values", out var valuesNode) && valuesNode is JsonArray valArr && valArr.Count > 0)
                    {
                        return JsonValue.Create(valArr[rand.Next(valArr.Count)]?.ToString());
                    }
                    return JsonValue.Create("Unknown");

                case "uptime":
                    return JsonValue.Create($"{rand.Next(0, 10)} days, {rand.Next(0, 24)} hrs");

                case "timestamp":
                    return JsonValue.Create(DateTime.UtcNow.ToString("o"));

                case "ip":
                    return JsonValue.Create($"192.168.{rand.Next(0, 255)}.{rand.Next(1, 255)}");

                case "mac":
                    return JsonValue.Create(string.Join(":", Enumerable.Range(0, 6).Select(_ => rand.Next(0, 256).ToString("X2"))));

                case "dBm":
                    return JsonValue.Create($"-{rand.Next(40, 80)} dBm");

                case "dataVolume":
                    return JsonValue.Create($"{(rand.NextDouble() * 10):F1} GB");

                case "ssid":
                    return JsonValue.Create("Office_Network_5G");

                case "array":
                    {
                        var list = new JsonArray();
                        int arrCount = def.TryGetPropertyValue("count", out var arrCountNode) && int.TryParse(arrCountNode?.ToString(), out var c) ? c : 1;

                        if (def.TryGetPropertyValue("values", out var valNode) && valNode is JsonArray valTypeArr && valTypeArr.Count > 0)
                        {
                            var elementType = valTypeArr[0]?.ToString() ?? "int";
                            for (int i = 0; i < arrCount; i++)
                                list.Add(GenerateValue(elementType, def, rand));
                            return list;
                        }

                        if (def.TryGetPropertyValue("items", out var itemsNode) && itemsNode is JsonObject itemDef)
                        {
                            for (int i = 0; i < arrCount; i++)
                            {
                                var element = new JsonObject();
                                foreach (var prop in itemDef)
                                {
                                    var propName = prop.Key;
                                    if (prop.Value is JsonObject propSchema && propSchema.TryGetPropertyValue("type", out var typeNode))
                                    {
                                        element[propName] = GenerateValue(typeNode!.ToString(), propSchema, rand);
                                    }
                                }
                                list.Add(element);
                            }
                            return list;
                        }

                        for (int i = 0; i < arrCount; i++)
                            list.Add(rand.Next(1, 100));

                        return list;
                    }


                case "pickN":
                    if (def.TryGetPropertyValue("values", out var pickVals) && pickVals is JsonArray pickArr)
                    {
                        var shuffled = pickArr.OrderBy(_ => rand.Next()).Take(count);
                        var resultArray = new JsonArray();
                        foreach (var item in shuffled)
                        {
                            resultArray.Add(item?.DeepClone());
                        }
                        return resultArray;
                    }
                    return new JsonArray();

                case "expression":
                case "condition":
                case "dependent":
                    return JsonValue.Create("Evaluated at runtime");

                default:
                    return JsonValue.Create("Unsupported Type");
            }
        }
    }
}
