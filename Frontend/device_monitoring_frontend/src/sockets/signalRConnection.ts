import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

async function startConnection(retryCount = 0) {
  if (!connection) return;
  try {
    await connection.start();
    console.log("SignalR connected.");
  } catch (err) {
    console.warn("SignalR connection failed:", err);
  }
}

export async function getSignalRConnection(): Promise<signalR.HubConnection> {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7127/devicehub")
      .withAutomaticReconnect()
      .build();

    await startConnection();
  }

  return connection;
}
