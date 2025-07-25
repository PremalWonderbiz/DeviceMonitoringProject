using Application.Dtos;
using Application.Interfaces;
using Infrastructure.RealTime;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DevicesController : ControllerBase
    {
        private readonly string _dataDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Data", "DeviceData");
        private readonly IDeviceService _deviceService;
        private readonly IHubContext<DeviceHub> _hubContext;

        public DevicesController(IDeviceService deviceService, IHubContext<DeviceHub> hubContext)
        {
            _deviceService = deviceService;
            _hubContext = hubContext;
        }
        
        [HttpPost("search/metadata/{input}")]
        public IActionResult GetSearchedDeviceMetadataPaginated(DeviceTopLevelSortOptions options, string input="")
        {
            var data = _deviceService.GetSearchedDeviceMetadataPaginated(options, input);

            var formattedData = data.DeviceMetadata.Select(m => new DeviceTopLevelData
            {
                Name = m.Name,
                Type = m.Type,
                Status = m.Status,
                MacId = m.MacId,
                Connectivity = m.Connectivity
            }).ToList();

            return Ok(new
            {
                totalCount = data.TotalCount,
                data = formattedData
            });
        }
        
        [HttpPost("metadata")]
        public IActionResult GetDeviceMetadataPaginatedandSorted(DeviceTopLevelSortOptions request)
        {
            var data = _deviceService.GetAllDeviceMetadataPaginatedandSorted(request);

            var formattedData = data.DeviceMetadata.Select(m => new DeviceTopLevelData
            {
                Name = m.Name,
                Type = m.Type,
                Status = m.Status,
                MacId = m.MacId,
                Connectivity = m.Connectivity,
                LastUpdated = m.LastUpdated
            }).ToList();

            return Ok(new
            {
                totalCount = data.TotalCount,
                data = formattedData
            });
        }
        
        [HttpPost("refreshCache/{input}")]
        public async Task<IActionResult> GetRefreshedData(DeviceTopLevelSortOptions request, string input = "")
        {
            var data = await _deviceService.GetAllDataRefereshedFromCache(request, input);

            var formattedData = data.DeviceMetadata.Select(m => new DeviceTopLevelData
            {
                Name = m.Name,
                Type = m.Type,
                Status = m.Status,
                MacId = m.MacId,
                Connectivity = m.Connectivity,
                LastUpdated = m.LastUpdated
            }).ToList();

            return Ok(new
            {
                totalCount = data.TotalCount,
                data = formattedData
            });
        }
        
        [HttpGet("getDevicesNameMacIdList")]
        public async Task<IActionResult> GetDevicesNameMacIdList()
        {
            var data = await _deviceService.GetDevicesNameMacIdList();

            return Ok(data);
        }

        [HttpGet("getMacIdToFileNameMap")]
        public async Task<IActionResult> GetMacIdToFileNameMap()
        {
            var res = _deviceService.GetMacIdToFileNameMap();
            return Ok(res);
        }

        [HttpGet("getPropertyPanelData/{devicename}")]
        public async Task<IActionResult> GetPropertyPanelDataForDevice(string devicename)
        {
            try
            {
                var res = await _deviceService.GetPropertyPanelDataForDevice(devicename);

                return Ok(res);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving data for device {devicename}: {ex.Message}");
            }

        }

        [HttpPost("uploadFile")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            var res = await _deviceService.UploadFile(file);

            return Ok(new { message = res, fileName = file.FileName });
        }

    }
}
