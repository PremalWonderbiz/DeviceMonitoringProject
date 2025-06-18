import { getSignalRConnection } from "@/sockets/signalRConnection";
import { useEffect } from "react";

export function useDeviceDetailSocket(deviceId: string, onDetailUpdate: (data: any) => void) {
   useEffect(() => {
    if (!deviceId) return;

    let isSubscribed = true;
    let conn: signalR.HubConnection | null = null;
    const eventName = `DeviceUpdate-${deviceId}`;
    const handler = (data: any) => {
      if (isSubscribed) {
        onDetailUpdate(data);
      }
    };

    const setup = async () => {
      conn = await getSignalRConnection();
      if (!conn) {
        console.warn("SignalR connection not available");
        return;
      }

      try {
        await conn.invoke("JoinDeviceGroup", deviceId);
      } catch (err) {
        console.log("JoinDeviceGroup failed:", err);
      }

      conn.on(eventName, handler);
    };

    setup();

    return () => {
      isSubscribed = false;

      if (conn) {
        console.log("Cleaning up 'DeviceDetailsUpdate' listener");
        conn.off(eventName, handler);
        conn.invoke("LeaveDeviceGroup", deviceId).catch(console.error);
      }
    };
  }, [deviceId]);
}
