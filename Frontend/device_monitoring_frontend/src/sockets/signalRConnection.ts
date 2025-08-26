import { websocketGatewayUrl } from "@/utils/helpervariables";
import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

async function startConnection(conn: signalR.HubConnection) {
  try {
    await conn.start();
    console.log("SignalR connected to GatewayHub.");
  } catch (err) {
    console.warn("SignalR connection failed:", err);
    // Retry logic can be added if needed
  }
}

export async function getSignalRConnection(): Promise<signalR.HubConnection> {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(websocketGatewayUrl)
      .withAutomaticReconnect()
      .build();

    await startConnection(connection);
  }

  return connection;
}
