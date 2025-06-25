import { getSignalRConnection } from "@/sockets/signalRConnection";
import { useEffect } from "react";

export function useDevicesTopDataSocket(onUpdate: (data: any) => void) {
  useEffect(() => {
    let conn: signalR.HubConnection | null = null;
    const handler = (data: any) => onUpdate(data);

    const setupConnection = async () => {
      conn = await getSignalRConnection("devicehub","https://localhost:7127/devicehub");
      if (!conn) {
        console.warn("SignalR connection not available");
        return;
      }

      console.log("SignalR connection obtained");
      console.log("Subscribing to 'ReceiveUpdate'");
      conn.on("ReceiveUpdate", handler);
    };

    setupConnection();

    return () => {
      if (conn) {
        console.log("Cleaning up 'ReceiveUpdate' listener");
        conn.off("ReceiveUpdate", handler);
      }
    };
  }, [onUpdate]);
}
