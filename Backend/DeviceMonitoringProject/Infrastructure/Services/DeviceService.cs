using System.Text.Encodings.Web;
using System.Text.Json.Nodes;
using System.Text.Json;
using Application.Dtos;
using Domain.Entities;
using Infrastructure.RealTime;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Application.Interfaces;
using Microsoft.Extensions.Options;

namespace Infrastructure.Services
{
    public class DeviceService : IDeviceService
    {
        private List<DeviceMetadata> devices;
        private readonly Random random = new();
        private readonly ILogger<DeviceService> _logger;
        private readonly string[] statuses = { "Online", "Offline" };
        private readonly string[] conns = { "Low", "Medium", "High" };
        private readonly IHubContext<DeviceHub> _hubContext;
        private readonly IDynamicDataHelper _dynamicDataHelper;
        private readonly string _dataDirectory;

        public DeviceService(IOptions<DeviceServiceOptions> options,ILogger<DeviceService> logger, IHubContext<DeviceHub> hubContext, IDynamicDataHelper dynamicDataHelper)
        {
            _logger = logger;
            _hubContext = hubContext;
            _dynamicDataHelper = dynamicDataHelper;
            _dataDirectory = options.Value.DataDirectory;
            devices = GetAllDeviceMetadata();
        }

        public List<DeviceMetadata> GetAllDeviceMetadata()
        {
            var deviceFiles = Directory.GetFiles(_dataDirectory, "*.json");

            var metadataList = new List<DeviceMetadata>();

            foreach (var file in deviceFiles)
            {
                try
                {
                    using var jsonStream = System.IO.File.OpenRead(file);

                    var metadata = JsonSerializer.Deserialize<DeviceMetadata>(
                        jsonStream,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    if (metadata != null)
                    {
                        metadata.FileName = Path.GetFileName(file);
                        metadataList.Add(metadata);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error parsing file {file}: {ex.Message}");
                }
            }


            return metadataList;
        }

        public DeviceMetadataPaginated GetAllDeviceMetadataPaginated(int pageNumber = 1, int pageSize = 10)
        {
            var deviceFiles = Directory.GetFiles(_dataDirectory, "*.json");

            var metadataList = new List<DeviceMetadata>();

            foreach (var file in deviceFiles)
            {
                try
                {
                    using var jsonStream = System.IO.File.OpenRead(file);

                    var metadata = JsonSerializer.Deserialize<DeviceMetadata>(
                        jsonStream,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    if (metadata != null)
                    {
                        metadata.FileName = Path.GetFileName(file);
                        metadataList.Add(metadata);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error parsing file {file}: {ex.Message}");
                }
            }

            int totalCount = metadataList.Count;

            var paginated = metadataList
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return new DeviceMetadataPaginated()
            {
                TotalCount = totalCount,
                DeviceMetadata = paginated
            }; ;
        }

        public Dictionary<string, string> GetMacIdToFileNameMap()
        {
            var deviceFiles = Directory.GetFiles(_dataDirectory, "*.json");
            var macIdToFileMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

            foreach (var file in deviceFiles)
            {
                try
                {
                    using var jsonStream = File.OpenRead(file);
                    var metadata = JsonSerializer.Deserialize<DeviceMetadata>(
                        jsonStream,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    if (metadata != null && !string.IsNullOrEmpty(metadata.MacId))
                    {
                        macIdToFileMap[metadata.MacId] = Path.GetFileName(file);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error parsing file {file}: {ex.Message}");
                }
            }

            return macIdToFileMap;
        }

        public async Task<DeviceDetails> GetPropertyPanelDataForDevice(string deviceFileName)
        {
            var deviceFile = Path.Combine(_dataDirectory, $"{deviceFileName}");

            if (!System.IO.File.Exists(deviceFile))
                throw new Exception("Device data not found");

            var json = await System.IO.File.ReadAllTextAsync(deviceFile);

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            var deviceDetails = JsonSerializer.Deserialize<DeviceDetails>(json, options);

            return deviceDetails;
        }

        public async Task<bool> GenerateAndSendLiveUpdatesDevicesData()
        {
            //Pick 6 random devices for top-level updates
            var selectedDevices = devices.OrderBy(_ => random.Next()).Take(6).ToList();

            //Update top-level fields for selected devices
            foreach (var device in selectedDevices)
            {
                device.Status = GetRandomStatus();
                device.Connectivity = GetRandomConnectivity();
            }

            var updatedDeviceDetails = new List<(string MacId, string EventName, object DetailPayload)>();

            // Step 3: Apply updates to file and prepare updates for all devices
            foreach (var device in devices)
            {
                string file = Path.Combine(_dataDirectory, device.FileName);

                try
                {
                    string jsonText = File.ReadAllText(file);
                    JsonNode rootNode = JsonNode.Parse(jsonText)!;

                    if (selectedDevices.Any(d => d.MacId == device.MacId))
                    {
                        rootNode["Status"] = device.Status;
                        rootNode["Connectivity"] = device.Connectivity;
                    }

                    JsonNode? dynamicPropsNode = rootNode["dynamicProperties"];
                    if (dynamicPropsNode != null)
                    {
                        switch (device.Name)
                        {
                            case "IP Camera":
                                _dynamicDataHelper.UpdateIpCameraDynamic(dynamicPropsNode);
                                break;
                            case "Air Conditioner":
                                _dynamicDataHelper.UpdateRoomAcDynamic(dynamicPropsNode);
                                break;
                            case "Network Switch":
                                _dynamicDataHelper.UpdateSwitchDynamic(dynamicPropsNode);
                                break;
                            case "Printer":
                                _dynamicDataHelper.UpdatePrinterDynamic(dynamicPropsNode);
                                break;
                            case "Raspberry Pi":
                                _dynamicDataHelper.UpdateRaspberryPiDynamic(dynamicPropsNode);
                                break;
                            case "Mobile":
                                _dynamicDataHelper.UpdateMobileDynamic(dynamicPropsNode);
                                break;
                            case "NAS Server":
                                _dynamicDataHelper.UpdateNasDynamic(dynamicPropsNode);
                                break;
                            case "Laptop":
                                _dynamicDataHelper.UpdateLaptopDynamic(dynamicPropsNode);
                                break;
                            case "WiFi Router":
                                _dynamicDataHelper.UpdateWifiRouterDynamic(dynamicPropsNode);
                                break;
                            case "Smart TV":
                                _dynamicDataHelper.UpdateSmartTvDynamic(dynamicPropsNode);
                                break;
                            default:
                                _logger.LogWarning("No dynamic update logic for device type: {DeviceType}", device.Name);
                                break;
                        }
                    }

                    // Write updated data back to json file
                    try
                    {
                        string safeJson = JsonNode.Parse(rootNode.ToJsonString())!
                            .ToJsonString(new JsonSerializerOptions
                            {
                                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                                WriteIndented = true
                            });

                        File.WriteAllText(file, safeJson);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error writing updated JSON to file {file}", file);
                    }

                    // Read structured payload (uses updated file)
                    var detailPayload = await GetPropertyPanelDataForDevice(device.FileName);

                    updatedDeviceDetails.Add((
                        MacId: device.MacId,
                        EventName: $"DeviceUpdate-{device.MacId}",
                        DetailPayload: detailPayload
                    ));
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing file {file}", file);
                }
            }

            // Broadcast per-device updates
            foreach (var update in updatedDeviceDetails)
            {
                var serializedDetail = JsonSerializer.Serialize(update.DetailPayload, new JsonSerializerOptions
                {
                    Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                });

                await _hubContext.Clients.Group($"device-{update.MacId}")
                    .SendAsync(update.EventName, serializedDetail);
            }

            // Broadcast top-level data updates
            var topLevelLiveData = devices.Select(d => new DevicesTopLevelLiveData
            {
                Status = d.Status,
                MacId = d.MacId,
                Connectivity = d.Connectivity
            }).ToList();

            var serializedSummary = JsonSerializer.Serialize(topLevelLiveData, new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                WriteIndented = true
            });

            await _hubContext.Clients.All.SendAsync("ReceiveUpdate", serializedSummary);

            return true;
        }

        private string GetRandomStatus()
        {
            return statuses[random.Next(statuses.Length)];
        }

        private string GetRandomConnectivity()
        {
            return conns[random.Next(conns.Length)];
        }

    }
}
