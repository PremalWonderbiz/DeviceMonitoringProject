using System;
using System.Collections.Generic;
using System.Text.Json;

namespace Common.Helper_Classes
{
    public static class JsonFlattener
    {
        /// <summary>
        /// Flattens a JsonElement (usually dynamicProperties) into a dictionary.
        /// Each nested property is represented with a full path key (e.g., dynamicProperties.cpu.usage).
        /// </summary>
        public static Dictionary<string, string> FlattenJson(JsonElement element, string prefix = "dynamicProperties")
        {
            var result = new Dictionary<string, string>();
            FlattenJsonElement(element, prefix, result);
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
                        dict[prefix] = d.ToString("G", System.Globalization.CultureInfo.InvariantCulture);
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
