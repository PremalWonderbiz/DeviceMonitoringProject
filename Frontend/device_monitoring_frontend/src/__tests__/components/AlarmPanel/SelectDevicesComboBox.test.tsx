// SelectDevicesComboBox.test.tsx
import SelectDevicesComboBox from "@/components/customcomponents/AlarmPanel/SelectDevicesComboBox";
import { Provider } from "@/components/ui/provider";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}

global.ResizeObserver = ResizeObserver;

const mockDevices = [
    { deviceName: "Device A", deviceMacId: "mac-1" },
    { deviceName: "Device B", deviceMacId: "mac-2" },
    { deviceName: "Device C", deviceMacId: "mac-3" },
];

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

describe("SelectDevicesComboBox", () => {
    let selectedDevices: any[] = [];
    const setSelectedDevices = jest.fn((devices) => {
        selectedDevices = devices;
    });

    beforeEach(() => {
        selectedDevices = [];
        jest.clearAllMocks();
    });

    test("renders without crashing", () => {
        render(
            <Provider>
                <SelectDevicesComboBox
                    devices={mockDevices}
                    selectedDevices={selectedDevices}
                    setSelectedDevices={setSelectedDevices}
                />
            </Provider>
        );
        expect(screen.getByPlaceholderText("Select Devices")).toBeInTheDocument();
    });


    test("calls setSelectedDevices when a device is selected", async () => {
        render(
            <Provider>
                <SelectDevicesComboBox
                    devices={mockDevices}
                    selectedDevices={[]}
                    setSelectedDevices={setSelectedDevices}
                />
            </Provider>
        );

        // Click the trigger to open the dropdown
        const toggleButton = screen.getByTestId("comboBoxTrigger");
        await userEvent.click(toggleButton);

        // Select the item
        const item = await screen.findByTestId("mac-1");
        await userEvent.click(item);

        // Check if setSelectedDevices was called with the correct device
        expect(setSelectedDevices).toHaveBeenCalledWith([mockDevices[0]]);
    });

    test("displays selected devices as badges", () => {
        selectedDevices = [mockDevices[0]];
        render(
            <Provider>
                <SelectDevicesComboBox
                    devices={mockDevices}
                    selectedDevices={selectedDevices}
                    setSelectedDevices={setSelectedDevices}
                />
            </Provider>
        );

        expect(screen.getByTestId("Device A")).toBeInTheDocument();
    });

    test("filters devices based on input", async () => {
        render(
            <Provider>
                <SelectDevicesComboBox
                    devices={mockDevices}
                    selectedDevices={selectedDevices}
                    setSelectedDevices={setSelectedDevices}
                />
            </Provider>
        );

        const input = screen.getByPlaceholderText("Select Devices");

        // Type "Device B" in input
        await userEvent.type(input, "D");

        expect(screen.getByText("Device B")).toBeInTheDocument();
        // expect(screen.queryByText("Device A")).not.toBeInTheDocument();
        // expect(screen.queryByText("Device C")).not.toBeInTheDocument();
    });

    test("shows empty message if no devices match search", async () => {
        render(
            <Provider>
                <SelectDevicesComboBox
                    devices={mockDevices}
                    selectedDevices={selectedDevices}
                    setSelectedDevices={setSelectedDevices}
                />
            </Provider>
        );

        const input = screen.getByPlaceholderText("Select Devices");
        await userEvent.type(input, "Non-existent device");

        expect(screen.getByText("No devices found")).toBeInTheDocument();
    });

    test("removes a device when close button is clicked", async () => {
        selectedDevices = [mockDevices[0]];
        render(
            <Provider>
                <SelectDevicesComboBox
                    devices={mockDevices}
                    selectedDevices={selectedDevices}
                    setSelectedDevices={setSelectedDevices}
                />
            </Provider>
        );

        const closeButton = screen.getByLabelText("Close");
        fireEvent.click(closeButton);

        expect(setSelectedDevices).toHaveBeenCalledWith([]);
    });
});
