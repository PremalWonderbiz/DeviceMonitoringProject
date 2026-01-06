import { jest } from "@jest/globals";

jest.mock("@/utils/helpervariables", () => ({
  websocketGatewayUrl: "ws://mock-url",
}));

// Typed mocks for SignalR
let mockStart: jest.MockedFunction<() => Promise<void>>;
let mockBuild: jest.MockedFunction<() => any>;
let mockWithAutomaticReconnect: jest.MockedFunction<() => any>;
let mockWithUrl: jest.MockedFunction<() => any>;

mockStart = jest.fn();
mockWithUrl = jest.fn();
mockWithAutomaticReconnect = jest.fn();
mockBuild = jest.fn();

jest.mock("@microsoft/signalr", () => {
  mockWithUrl.mockReturnValue({
    withAutomaticReconnect: mockWithAutomaticReconnect,
  });
  mockWithAutomaticReconnect.mockReturnValue({ build: mockBuild });
  mockBuild.mockReturnValue({ start: mockStart });

  return {
    HubConnectionBuilder: jest.fn(() => ({
      withUrl: mockWithUrl,
      withAutomaticReconnect: mockWithAutomaticReconnect,
      build: mockBuild,
    })),
  };
});

const mockConsole = {
  log: jest.spyOn(console, "log").mockImplementation(() => {}),
  warn: jest.spyOn(console, "warn").mockImplementation(() => {}),
};

describe("getSignalRConnection", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    mockStart.mockReset();
  });

  it("should create and start a new SignalR connection", async () => {
    mockStart.mockResolvedValue();

    const { getSignalRConnection } = await import(
      "../sockets/signalRConnection"
    );
    const conn = await getSignalRConnection();

    expect(conn.start).toBe(mockStart);
    expect(mockConsole.log).toHaveBeenCalledWith(
      "SignalR connected to GatewayHub."
    );
  });

  it("should return cached connection if called twice", async () => {
    mockStart.mockResolvedValue();

    const { getSignalRConnection } = await import(
      "../sockets/signalRConnection"
    );
    const first = await getSignalRConnection();
    const second = await getSignalRConnection();

    expect(first).toBe(second);
  });

  it("should log warning if start() fails", async () => {
    const error = new Error("failed");
    mockStart.mockRejectedValue(error);

    const { getSignalRConnection } = await import(
      "../sockets/signalRConnection"
    );
    await getSignalRConnection();

    expect(mockConsole.warn).toHaveBeenCalledWith(
      "SignalR connection failed:",
      error
    );
  });
});
