using System.Text.Json;
using API.RealTime;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace API.Controllers
{
    [ApiController]
    [Route("api/realtime")]
    public class RealtimeController : ControllerBase
    {
        private readonly IHubContext<GatewayHub> _hubContext;

        public RealtimeController(IHubContext<GatewayHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpPost("device-update")]
        public async Task<IActionResult> SendDeviceUpdate([FromBody] JsonElement json)
        {
            var rawJson = json.GetRawText();
            await _hubContext.Clients.All.SendAsync("ReceiveUpdate", json);
            return Ok();
        }

        [HttpPost("alarm-update")]
        public async Task<IActionResult> SendAlarmUpdate([FromBody] string serializedData)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveMainPageUpdates", serializedData);
            return Ok();
        }

        [HttpPost("device-group-update/{deviceId}")]
        public async Task<IActionResult> SendDeviceGroupUpdate(string deviceId, [FromBody] string json)
        {
            await _hubContext.Clients.Group($"device-{deviceId}").SendAsync($"DeviceUpdate-{deviceId}", json);
            return Ok();
        }

        [HttpPost("alarmPanel-alarm-update")]
        public async Task<IActionResult> SendAlarmPanelGroupUpdate(string alarmId, [FromBody] string json)
        {
            await _hubContext.Clients.Group($"AlarmPanelGroup").SendAsync("ReceiveAlarmPanelUpdates", json);
            return Ok();
        }
        
        [HttpPost("propertyPanel-alarm-update/{deviceId}")]
        public async Task<IActionResult> SendAlarmGroupUpdate(string deviceId, [FromBody] string json)
        {
            await _hubContext.Clients.Group($"Alarm-{deviceId}").SendAsync("ReceivePropertyPanelAlarmUpdates", json);
            return Ok();
        }
    }
}
