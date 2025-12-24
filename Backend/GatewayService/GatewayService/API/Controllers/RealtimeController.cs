using System.Text.Json;
using API.RealTime;
using HotChocolate.Subscriptions;
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
        private readonly ITopicEventSender _eventSender;

        public RealtimeController(IHubContext<GatewayHub> hubContext, ITopicEventSender eventSender)
        {
            _hubContext = hubContext;
            _eventSender = eventSender;
        }

        [HttpPost("device-update")]
        public async Task<IActionResult> SendDeviceUpdate([FromBody] JsonElement json)
        {
            var rawJson = json.GetRawText();
            await _hubContext.Clients.All.SendAsync("ReceiveUpdate", rawJson);
            await _eventSender.SendAsync("DeviceUpdates", rawJson);
            return Ok();
        }


        [HttpPost("alarm-update")]
        public async Task<IActionResult> SendAlarmUpdate([FromBody] JsonElement json)
        {
            var rawJson = json.GetRawText();
            await _hubContext.Clients.All.SendAsync("ReceiveMainPageUpdates", rawJson);
            await _eventSender.SendAsync("AlarmUpdates", rawJson);
            return Ok();
        }

        [HttpPost("device-group-update/{deviceId}")]
        public async Task<IActionResult> SendDeviceGroupUpdate(string deviceId, [FromBody] JsonElement json)
        {
            var rawJson = json.GetRawText();
            await _hubContext.Clients.Group($"device-{deviceId}").SendAsync($"DeviceUpdate-{deviceId}", rawJson);
            await _eventSender.SendAsync($"DeviceGroupUpdates_{deviceId}", rawJson);
            return Ok();
        }

        [HttpPost("alarmPanel-alarm-update")]
        public async Task<IActionResult> SendAlarmPanelGroupUpdate([FromBody] JsonElement json)
        {
            var rawJson = json.GetRawText();
            await _hubContext.Clients.Group($"AlarmPanelGroup").SendAsync("ReceiveAlarmPanelUpdates", rawJson);
            await _eventSender.SendAsync("AlarmPanelUpdates", rawJson);
            return Ok();
        }

        [HttpPost("propertyPanel-alarm-update/{deviceId}")]
        public async Task<IActionResult> SendAlarmGroupUpdate(string deviceId, [FromBody] JsonElement json)
        {
            var rawJson = json.GetRawText();
            await _hubContext.Clients.Group($"Alarm-{deviceId}").SendAsync("ReceivePropertyPanelAlarmUpdates", rawJson);
            await _eventSender.SendAsync($"PropertyPanelAlarmUpdates_{deviceId}", rawJson);
            return Ok();
        }
    }
}
