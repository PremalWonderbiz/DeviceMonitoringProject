using Application.Dtos;
using Application.Interfaces;
using Infrastructure.RealTime;
using Infrastructure.Services;
using Microsoft.AspNetCore.Http;
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

        [HttpGet("metadata/{pageNumber}/{pageSize}")]
        public IActionResult GetAllDeviceMetadata(int pageNumber = 1, int pageSize = 10)
        {
            var data = _deviceService.GetAllDeviceMetadataPaginated(pageNumber, pageSize);

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
    }
}
