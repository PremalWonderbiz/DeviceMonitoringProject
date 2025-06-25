using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Infrastructure.RealTime
{
    public class AlertHub : Hub
    {
        //public async Task SendUpdate(string message)
        //{
        //    await Clients.All.SendAsync("ReceiveUpdate", message);
        //}
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
