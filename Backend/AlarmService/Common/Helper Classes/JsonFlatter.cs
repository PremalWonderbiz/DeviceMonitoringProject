using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Dtos;
using static System.Net.Mime.MediaTypeNames;

namespace Common.Helper_Classes
{
    public static class JsonFlattener
    {
        public static Dictionary<string, string> FlattenDeviceData(LiveDeviceDataDto dto)
        {
            var result = new Dictionary<string, string>
            {
                ["Status"] = dto.Status,
                ["Connectivity"] = dto.Connectivity
            };

            FlattenJsonElement(dto.DynamicProperties, "dynamicProperties", result);

            return result;
        }

        private static void FlattenJsonElement(JsonElement element, string prefix, Dictionary<string, string> dict)
        {
            switch (element.ValueKind)
            {
                case JsonValueKind.Object:
                    foreach (var prop in element.EnumerateObject())
                    {
                        var newPrefix = $"{prefix}.{prop.Name}";
                        FlattenJsonElement(prop.Value, newPrefix, dict);
                    }
                    break;

                case JsonValueKind.Array:
                    int index = 0;
                    foreach (var item in element.EnumerateArray())
                    {
                        var indexedPrefix = $"{prefix}[{index}]";
                        FlattenJsonElement(item, indexedPrefix, dict);
                        index++;
                    }
                    break;

                case JsonValueKind.String:
                    dict[prefix] = element.GetString() ?? string.Empty;
                    break;

                case JsonValueKind.Number:
                    if (element.TryGetInt64(out long l))
                        dict[prefix] = l.ToString();
                    else if (element.TryGetDouble(out double d))
                        dict[prefix] = d.ToString("G", System.Globalization.CultureInfo.InvariantCulture); // avoid comma in some locales
                    else
                        dict[prefix] = element.ToString(); 
                    break;

                case JsonValueKind.True:
                case JsonValueKind.False:
                    dict[prefix] = element.GetBoolean().ToString();
                    break;

                case JsonValueKind.Null:
                case JsonValueKind.Undefined:
                    dict[prefix] = string.Empty;
                    break;

                default:
                    dict[prefix] = element.ToString() ?? string.Empty;
                    break;
            }
        }
    }
}
