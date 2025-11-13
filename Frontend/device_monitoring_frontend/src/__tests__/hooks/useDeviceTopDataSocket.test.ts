import { renderHook, act } from "@testing-library/react";
import { getSignalRConnection } from "@/sockets/signalRConnection";
import { useDevicesTopDataSocket } from "@/utils/customhooks/useDevicesTopDataSocket";

// Mock getSignalRConnection import
jest.mock("@/sockets/signalRConnection", () => ({
  getSignalRConnection: jest.fn(),
}));

// Create a fake SignalR connection mock
const mockOn = jest.fn();
const mockOff = jest.fn();

const mockConnection = {
  on: mockOn,
  off: mockOff,
};

describe("useDevicesTopDataSocket", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("sets up SignalR connection and subscribes to ReceiveUpdate", async () => {
    // Mock getSignalRConnection to return a fake connection
    (getSignalRConnection as jest.Mock).mockResolvedValue(mockConnection);

    const onUpdate = jest.fn();

    await act(async () => {
      renderHook(() => useDevicesTopDataSocket(onUpdate));
    });

    expect(getSignalRConnection).toHaveBeenCalledTimes(1);
    expect(mockOn).toHaveBeenCalledWith("ReceiveUpdate", expect.any(Function));
  });

  test("calls onUpdate when ReceiveUpdate handler is triggered", async () => {
    let handler: any;
    (getSignalRConnection as jest.Mock).mockResolvedValue({
      on: (event: string, fn: any) => {
        if (event === "ReceiveUpdate") handler = fn;
      },
      off: jest.fn(),
    });

    const onUpdate = jest.fn();
    await act(async () => {
      renderHook(() => useDevicesTopDataSocket(onUpdate));
    });

    const mockData = { id: 1, name: "Device A" };
    handler(mockData);

    expect(onUpdate).toHaveBeenCalledWith(mockData);
  });

  test("cleans up the event listener on unmount", async () => {
    (getSignalRConnection as jest.Mock).mockResolvedValue(mockConnection);

    const { unmount } = renderHook(() =>
      useDevicesTopDataSocket(jest.fn())
    );

    await act(async () => {}); // wait for effect to settle

    unmount();

    expect(mockOff).toHaveBeenCalledWith("ReceiveUpdate", expect.any(Function));
  });

  test("logs a warning when no connection is available", async () => {
    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    (getSignalRConnection as jest.Mock).mockResolvedValue(null);

    await act(async () => {
      renderHook(() => useDevicesTopDataSocket(jest.fn()));
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith("SignalR connection not available");
    consoleWarnSpy.mockRestore();
  });
});
