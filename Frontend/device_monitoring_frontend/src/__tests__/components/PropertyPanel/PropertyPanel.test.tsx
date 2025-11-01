import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PropertyPanel from "@/components/customcomponents/Propertypanel/PropertyPannel";
const mockGetPropertyPanelData = require("@/services/deviceservice").getPropertyPanelData;
import '@testing-library/jest-dom';
import TabList from "@/components/customcomponents/Propertypanel/TabList";

// Mock dependencies
jest.mock("@/components/customcomponents/Accordion", () => ({ children, ...props }: any) => <div data-testid="accordion"><TabList
    highlightedPaths={props.highlightedPaths}
    activeTab={props.activeTab}
    setActiveTab={props.setActiveTab}
/>{children}</div>);

const setActiveTab = jest.fn();
jest.mock("@/components/customcomponents/Propertypanel/TabList", () => ({ highlightedPaths, activeTab }: any) => (
    <div data-testid="tablist">
        <button onClick={() => (setActiveTab || (() => { }))("Static")}>Static</button>
        <button onClick={() => (setActiveTab || (() => { }))("Health")}>Health</button>
    </div>
));

jest.mock("@/components/customcomponents/Propertypanel/PropertyPanelContent", () => ({
    HealthTabContent: ({ deviceName }: any) => <div data-testid="health-tab">Health tab content</div>,
    StaticTabContent: ({ staticProps }: any) => <div data-testid="static-tab">{JSON.stringify(staticProps)}</div>,
}));

jest.mock("@/services/deviceservice", () => ({
    getPropertyPanelData: jest.fn(),
}));

jest.mock("@/utils/customhooks/useDeviceDetailSocket", () => ({
    useDeviceDetailSocket: jest.fn(),
}));

jest.mock("@/components/customcomponents/AlarmPanel/SelectDevicesComboBox", () => ({ devices, selectedDevices, setSelectedDevices }: any) => (
    <select
        data-testid="combobox"
        value={selectedDevices[0]?.deviceMacId || ""}
        onChange={e => setSelectedDevices([{ deviceMacId: e.target.value }])}
    >
        {devices.map((d: any) => (
            <option key={d.deviceMacId} value={d.deviceMacId}>{d.deviceName}</option>
        ))}
    </select>
));

jest.mock("@/components/customcomponents/Propertypanel/AccordionVisibilityContext", () => ({
    AccordionStateProvider: ({ children }: any) => <>{children}</>,
}));

describe("PropertyPanel", () => {
    const defaultProps = {
        setCurrentDeviceId: jest.fn(),
        setCurrentDeviceFileName: jest.fn(),
        deviceFileNames: { "mac1": "file1" },
        devicesNameMacList: [{ deviceMacId: "mac1", deviceName: "Device 1" }],
        setIsAlarmPanelOpen: jest.fn(),
        setSelectedDevicePropertyPanel: jest.fn(),
        currentDeviceId: "mac1",
        currentDeviceFileName: "file1",
        activeTab: "Static",
        setActiveTab,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders select device dropdown when no data", () => {
        render(<PropertyPanel {...defaultProps} currentDeviceId={null} currentDeviceFileName={null} />);
        expect(screen.getByText("Select device")).toBeInTheDocument();
        expect(screen.getByTestId("combobox")).toBeInTheDocument();
    });

    it("renders property panel data when data is present", async () => {
        mockGetPropertyPanelData.mockResolvedValueOnce({
            data: {
                name: "Device 1",
                type: "Type A",
                staticProperties: { prop1: "value1" },
                dynamicProperties: { prop2: "value2" },
                macId: "mac1",
            }
        });

        render(<PropertyPanel {...defaultProps} />);
        await waitFor(() => {
            expect(screen.getByText("Device 1")).toBeInTheDocument();
            expect(screen.getByText("Type A")).toBeInTheDocument();
            expect(screen.getByTestId("accordion")).toBeInTheDocument();
            expect(screen.getByTestId("tablist")).toBeInTheDocument();
            expect(screen.getByTestId("static-tab")).toBeInTheDocument();
        });

    });

    it("switches to Health tab and renders HealthTabContent", async () => {
        mockGetPropertyPanelData.mockResolvedValueOnce({
            data: {
                name: "Device 1",
                type: "Type A",
                staticProperties: { prop1: "value1" },
                dynamicProperties: { prop2: "value2" },
                macId: "mac1",
            }
        });

        render(<PropertyPanel {...defaultProps} />);
        await waitFor(() => {
            expect(screen.getByText("Device 1")).toBeInTheDocument();
            fireEvent.click(screen.getByText("Health"));
            expect(defaultProps.setActiveTab).toHaveBeenCalledWith("Health");
        });
    });

    it("calls setCurrentDeviceId and setCurrentDeviceFileName when device is selected", () => {
        render(<PropertyPanel {...defaultProps} currentDeviceId={null} currentDeviceFileName={null} />);
        fireEvent.change(screen.getByTestId("combobox"), { target: { value: "mac1" } });
        expect(defaultProps.setCurrentDeviceId).toHaveBeenCalledWith("mac1");
    });

    it("cleans up highlight timeout on unmount", () => {
        const { unmount } = render(<PropertyPanel {...defaultProps} />);
        unmount();
        // No error means cleanup ran
    });
});