using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;

namespace API.RealTime
{
    public class GatewayHub : Hub
    {
        // General broadcast (used for common updates)
        public async Task BroadcastUpdate(string message)
        {
            await Clients.All.SendAsync("ReceiveUpdate", message);
        }

        // Device groups
        public async Task JoinDeviceGroup(string deviceId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"device-{deviceId}");
        }

        public async Task LeaveDeviceGroup(string deviceId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"device-{deviceId}");
        }

        // Alarm groups
        public async Task JoinAlarmPanelGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"{groupName}");
        }

        public async Task LeaveAlarmPanelGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"{groupName}");
        }

        public async Task JoinPropertyPanelGroup(string deviceId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Alarm-{deviceId}");
        }

        public async Task LeavePropertyPanelGroup(string deviceId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Alarm-{deviceId}");
        }
    }
}
