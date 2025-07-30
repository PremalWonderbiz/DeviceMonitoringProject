import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { HealthTabContent, StaticTabContent } from "@/components/customcomponents/Propertypanel/PropertyPanelContent";
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock("@/styles/scss/PropertyPanel.module.scss", () => ({
    propertyPanelTabContent: "propertyPanelTabContent",
    keyValueSection: "keyValueSection",
    alarmCard: "alarmCard",
    message: "message",
    time: "time",
    viewBtn: "viewBtn",
}));
jest.mock("@/components/customcomponents/Badge", () => (props: any) => <div data-testid="badge">{props.label}</div>);
jest.mock("@/services/alarmservice", () => ({
    getLatestAlarmForDevice: jest.fn(),
}));
jest.mock("@/utils/helperfunctions", () => ({
    formatRelativeTime: jest.fn((date) => "2 minutes ago"),
    getCollapsedAncestorsToHighlight: jest.fn(() => ["foo"]),
}));
jest.mock("@/utils/customhooks/useDeviceAlertSocket", () => ({
    useDeviceAlertSocket: jest.fn(),
}));
jest.mock("@/components/customcomponents/Propertypanel/AccordionVisibilityContext", () => ({
    useAccordionState: jest.fn(() => ({ state: {} })),
}));
jest.mock("@/utils/propertypanelfunctions", () => ({
    renderKeyValueSection: jest.fn((key, value) => (
        <span data-testid="kv">{`${key}:${value}`}</span>
    )),
    renderObject: jest.fn((key, value) => (
        <div key={key} data-testid="object">{`${key}:${JSON.stringify(value)}`}</div>
    )),
}));

describe("StaticTabContent", () => {
    it("renders key-value pairs for primitive values", () => {
        render(<StaticTabContent staticProps={{ foo: "bar", num: 42 }} />);
        expect(screen.getByText("foo:bar")).toBeInTheDocument();
        expect(screen.getByText("num:42")).toBeInTheDocument();
    });

    it("renders objects using renderObject", () => {
        render(<StaticTabContent staticProps={{ obj: { a: 1 } }} />);
        expect(screen.getByTestId("object")).toHaveTextContent("obj:{\"a\":1}");
    });
});

describe("HealthTabContent", () => {
    const mockSetIsAlarmPanelOpen = jest.fn();
    const mockSetSelectedDevicePropertyPanel = jest.fn();
    const deviceMacId = "mac123";
    const deviceName = "Device1";
    const dynamicProps = { temp: 25, nested: { humidity: 60 } };
    const highlightedPaths = ["nested"];

    beforeEach(() => {
        jest.clearAllMocks();
        (require("@/services/alarmservice").getLatestAlarmForDevice as jest.Mock).mockResolvedValue({
            data: { alarm: { message: "Overheat", raisedAt: "2024-01-01T00:00:00Z" }, totalAlarms: 3 },
        });
    });

    it("renders alarm card when alarm exists", async () => {
        render(
            <HealthTabContent
                highlightedPaths={highlightedPaths}
                deviceName={deviceName}
                setIsAlarmPanelOpen={mockSetIsAlarmPanelOpen}
                setSelectedDevicePropertyPanel={mockSetSelectedDevicePropertyPanel}
                deviceMacId={deviceMacId}
                dynamicProps={dynamicProps}
            />
        );
        await waitFor(() => {
            expect(screen.getByText("Overheat")).toBeInTheDocument();
            expect(screen.getByText("2 minutes ago")).toBeInTheDocument();
            expect(screen.getByTestId("badge")).toHaveTextContent("3");
        });
    });

    it("sets alarm and totalAlarmsForDevice to null/0 when getLatestAlarmForDevice returns no data", async () => {
        // Mock the service to return no data
        (require("@/services/alarmservice").getLatestAlarmForDevice as jest.Mock).mockResolvedValue({});

        render(
            <HealthTabContent
                highlightedPaths={highlightedPaths}
                deviceName={deviceName}
                setIsAlarmPanelOpen={mockSetIsAlarmPanelOpen}
                setSelectedDevicePropertyPanel={mockSetSelectedDevicePropertyPanel}
                deviceMacId={deviceMacId}
                dynamicProps={dynamicProps}
            />
        );

        // Wait for the DOM to update
        await waitFor(() => {
            // Alarm card should not be rendered
            expect(screen.queryByText("Overheat")).not.toBeInTheDocument();
            // Badge should not be rendered
            expect(screen.queryByTestId("badge")).not.toBeInTheDocument();
        });
    });

    it("calls setIsAlarmPanelOpen and setSelectedDevicePropertyPanel on button click", async () => {
        render(
            <HealthTabContent
                highlightedPaths={highlightedPaths}
                deviceName={deviceName}
                setIsAlarmPanelOpen={mockSetIsAlarmPanelOpen}
                setSelectedDevicePropertyPanel={mockSetSelectedDevicePropertyPanel}
                deviceMacId={deviceMacId}
                dynamicProps={dynamicProps}
            />
        );
        await waitFor(() => screen.getByText("View related alarms"));
        fireEvent.click(screen.getByText("View related alarms"));
        expect(mockSetIsAlarmPanelOpen).toHaveBeenCalledWith(true);
        expect(mockSetSelectedDevicePropertyPanel).toHaveBeenCalledWith({ deviceMacId, deviceName });
    });

    it("calls getCollapsedAncestorsToHighlight with {} when accordionContext.state is undefined", async () => {
        jest.mock("@/components/customcomponents/Propertypanel/AccordionVisibilityContext", () => ({
            useAccordionState: jest.fn(() => ({})), // state is undefined
        }));
        // Override the mock for this test only
        const mockGetCollapsedAncestorsToHighlight = require("@/utils/helperfunctions").getCollapsedAncestorsToHighlight;
        const mockUseAccordionState = require("@/components/customcomponents/Propertypanel/AccordionVisibilityContext").useAccordionState;
        mockUseAccordionState.mockImplementation(() => ({})); // state is undefined

        render(
            <HealthTabContent
                highlightedPaths={["foo"]}
                deviceName="Device1"
                setIsAlarmPanelOpen={jest.fn()}
                setSelectedDevicePropertyPanel={jest.fn()}
                deviceMacId="mac123"
                dynamicProps={{}}
            />
        );

        // Wait for useEffect/useMemo to run
        await waitFor(() => {
            expect(mockGetCollapsedAncestorsToHighlight).toHaveBeenCalledWith(["foo"], {});
        });
    });

    it("renders dynamicProps using renderObject and renderKeyValueSection", async () => {
        render(
            <HealthTabContent
                highlightedPaths={highlightedPaths}
                deviceName={deviceName}
                setIsAlarmPanelOpen={mockSetIsAlarmPanelOpen}
                setSelectedDevicePropertyPanel={mockSetSelectedDevicePropertyPanel}
                deviceMacId={deviceMacId}
                dynamicProps={dynamicProps}
            />
        );
        await waitFor(() => {
            expect(screen.getByText("temp:25")).toBeInTheDocument();
            expect(screen.getByTestId("object")).toHaveTextContent("nested:{\"humidity\":60}");
        });
    });

    //handle update function 
    it("handleAlertUpdates sets alarm and totalAlarmsForDevice when incomingUpdates is valid", async () => {
        // Mock useDeviceAlertSocket to call the handler with a valid message
        const mockUseDeviceAlertSocket = require("@/utils/customhooks/useDeviceAlertSocket").useDeviceAlertSocket;
        let handler: any;
        mockUseDeviceAlertSocket.mockImplementation((_: any, h: any) => { handler = h; });

        const { container } = render(
            <HealthTabContent
                highlightedPaths={["foo"]}
                deviceName="Device1"
                setIsAlarmPanelOpen={jest.fn()}
                setSelectedDevicePropertyPanel={jest.fn()}
                deviceMacId="mac123"
                dynamicProps={{}}
            />
        );

        // Wait for the initial alarm to render
        await waitFor(() => {
            expect(screen.getByText("Overheat")).toBeInTheDocument();
            expect(screen.getByTestId("badge")).toHaveTextContent("3");
        });

        // Simulate receiving a valid message
        act(() => {
            handler(JSON.stringify({ alarm: { message: "Test Alarm", raisedAt: "2024-01-01T00:00:00Z" }, totalAlarms: 7 }));
        });

        // Wait for the new alarm to render
        await waitFor(() => {
            expect(screen.getByText("Test Alarm")).toBeInTheDocument();
            expect(screen.getByTestId("badge")).toHaveTextContent("7");
        });
    });

    it("handleAlertUpdates sets alarm and totalAlarmsForDevice to null/0 when incomingUpdates is falsy", async () => {
        // Mock useDeviceAlertSocket to call the handler with a falsy message
        const mockUseDeviceAlertSocket = require("@/utils/customhooks/useDeviceAlertSocket").useDeviceAlertSocket;
        let handler: any;
        mockUseDeviceAlertSocket.mockImplementation((_: any, h: any) => { handler = h; });

        render(
            <HealthTabContent
                highlightedPaths={["foo"]}
                deviceName="Device1"
                setIsAlarmPanelOpen={jest.fn()}
                setSelectedDevicePropertyPanel={jest.fn()}
                deviceMacId="mac123"
                dynamicProps={{}}
            />
        );

        // Simulate receiving a falsy message
        act(() => {
            handler("null");
        });

        // Wait for the DOM to update after the state change
        await waitFor(() => {
            expect(screen.queryByText("Test Alarm")).not.toBeInTheDocument();
            expect(screen.queryByTestId("badge")).not.toBeInTheDocument();
        });
    });

    // Access the memo compare function
    const memoCompare = (HealthTabContent as any).type?.compare || (HealthTabContent as any).compare;

    describe("HealthTabContent memo compare", () => {
        it("returns true when deviceMacId and highlightedPaths are equal", () => {
            const prevProps = { deviceMacId: "mac1", highlightedPaths: ["a", "b"] };
            const nextProps = { deviceMacId: "mac1", highlightedPaths: ["a", "b"] };
            expect(memoCompare(prevProps, nextProps)).toBe(true);
        });

        it("returns false when deviceMacId is different", () => {
            const prevProps = { deviceMacId: "mac1", highlightedPaths: ["a", "b"] };
            const nextProps = { deviceMacId: "mac2", highlightedPaths: ["a", "b"] };
            expect(memoCompare(prevProps, nextProps)).toBe(false);
        });

        it("returns false when highlightedPaths is different", () => {
            const prevProps = { deviceMacId: "mac1", highlightedPaths: ["a", "b"] };
            const nextProps = { deviceMacId: "mac1", highlightedPaths: ["a", "c"] };
            expect(memoCompare(prevProps, nextProps)).toBe(false);
        });
    });
});