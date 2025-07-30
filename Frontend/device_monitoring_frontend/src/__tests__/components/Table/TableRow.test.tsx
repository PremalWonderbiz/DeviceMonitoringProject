import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react";
import TableRow from "@/components/customcomponents/Table/TableRow";
import '@testing-library/jest-dom';
import { areEqual } from "@/components/customcomponents/Table/TableRow";

// Mock styles import
jest.mock("@/styles/scss/Table.module.scss", () => ({
    row: "row",
    rowSelected: "rowSelected",
    cell: "cell",
    highlightedCell: "highlightedCell",
}));

// Mock flexRender
jest.mock("@tanstack/react-table", () => ({
    flexRender: jest.fn((renderer, ctx) => {
        if (typeof renderer === "function") return renderer(ctx);
        return renderer;
    }),
    Row: jest.fn(),
}));

const getMockRow = (overrides: any = {}) => ({
    original: {
        macId: "mac-123",
        status: "online",
        connectivity: "wifi",
        id: "row-1",
        ...overrides.original,
    },
    getVisibleCells: () => [
        {
            id: "cell-1",
            column: { id: "status", columnDef: { cell: (ctx: any) => ctx.row.original.status } },
            getContext: () => ({ row: { original: { macId: "mac-123", status: "online" } } }),
        },
        {
            id: "cell-2",
            column: { id: "connectivity", columnDef: { cell: (ctx: any) => ctx.row.original.connectivity } },
            getContext: () => ({ row: { original: { macId: "mac-123", connectivity: "wifi" } } }),
        },
    ],
});

describe("TableRow", () => {
    jest.useFakeTimers();

    const setIsPropertyPanelOpen = jest.fn();

    it("renders row and cells correctly", () => {
        const row = getMockRow();
        const { getByText } = render(
            <table>
                <tbody>
                    <TableRow
                        row={row as any} // row is of type Row<any>
                        setIsPropertyPanelOpen={setIsPropertyPanelOpen}
                        updatedFieldsMap={null}
                        refreshDeviceDataKey={1}
                        currentDeviceId={null}
                    />
                </tbody>
            </table>
        );
        expect(getByText("online")).toBeInTheDocument();
        expect(getByText("wifi")).toBeInTheDocument();
    });

    it("applies rowSelected class when currentDeviceId matches macId", () => {
        const row = getMockRow();
        const { container } = render(
            <table>
                <tbody>
                    <TableRow
                        row={row as any}
                        setIsPropertyPanelOpen={setIsPropertyPanelOpen}
                        updatedFieldsMap={null}
                        refreshDeviceDataKey={1}
                        currentDeviceId="mac-123"
                    />
                </tbody>
            </table>
        );
        expect(container.querySelector("tr")?.className).toContain("rowSelected");
    });

    it("calls setIsPropertyPanelOpen with macId on row click", () => {
        const row = getMockRow();
        const { container } = render(
            <table>
                <tbody>
                    <TableRow
                        row={row as any}
                        setIsPropertyPanelOpen={setIsPropertyPanelOpen}
                        updatedFieldsMap={null}
                        refreshDeviceDataKey={1}
                        currentDeviceId={null}
                    />
                </tbody>
            </table>
        );
        fireEvent.click(container.querySelector("tr")!);
        expect(setIsPropertyPanelOpen).toHaveBeenCalledWith("mac-123");
    });

    it("highlights updated fields and removes highlight after 3 seconds", async () => {
        const row = getMockRow();
        const updatedFieldsMap = { "mac-123": ["status"] };
        const { container } = render(
            <table>
                <tbody>
                    <TableRow
                        row={row as any}
                        setIsPropertyPanelOpen={setIsPropertyPanelOpen}
                        updatedFieldsMap={updatedFieldsMap}
                        currentDeviceId={null}
                    />
                </tbody>
            </table>
        );

        // Advance timers by 0 to flush any immediate timer-based updates
        act(() => {
            jest.advanceTimersByTime(1000);
        });

        // Wait for DOM update so <td> elements are guaranteed rendered
        await waitFor(() => {
            const tds = container.querySelectorAll("td");
            expect(tds.length).toBeGreaterThan(0);
        });

        let tds = container.querySelectorAll("td");

        expect(tds[0].classList.contains("highlightedCell")).toBe(true);
        expect(tds[1].classList.contains("highlightedCell")).toBe(false);

        // Advance timers by 3 seconds to remove highlight
        act(() => {
            jest.advanceTimersByTime(3000);
        });

        // Query again and check class removal
        await waitFor(() => {
            tds = container.querySelectorAll("td");
        });
        expect(tds[0].classList.contains("highlightedCell")).toBe(false);
    });

    it("removes highlight when refreshDeviceDataKey changes", () => {
        const row = getMockRow();
        const updatedFieldsMap = { "mac-123": ["status"] };
        const { rerender, container } = render(
            <table>
                <tbody>
                    <TableRow
                        row={row as any}
                        setIsPropertyPanelOpen={setIsPropertyPanelOpen}
                        updatedFieldsMap={updatedFieldsMap}
                        currentDeviceId={null}
                    />
                </tbody>
            </table>
        );
        // status cell should be highlighted
        expect(container.querySelectorAll("td")[0].classList.contains("highlightedCell")).toBe(true);

        // Change refreshDeviceDataKey
        rerender(
            <table>
                <tbody>
                    <TableRow
                        row={row as any}
                        setIsPropertyPanelOpen={setIsPropertyPanelOpen}
                        updatedFieldsMap={updatedFieldsMap}
                        refreshDeviceDataKey={2}
                        currentDeviceId={null}
                    />
                </tbody>
            </table>
        );
        expect(container.querySelectorAll("td")[0].classList.contains("highlightedCell")).toBe(false);
    });

    // areEqual function tests
    describe("areEqual", () => {
        const getProps = (overrides: any = {}): any => ({
            row: { original: { macId: "mac-123", status: "online", connectivity: "wifi", ...(overrides.row?.original || {}) } },
            setIsPropertyPanelOpen,
            updatedFieldsMap: overrides.updatedFieldsMap ?? { "mac-123": ["status"] },
            refreshDeviceDataKey: overrides.refreshDeviceDataKey ?? 1,
            currentDeviceId: overrides.currentDeviceId ?? "mac-123",
        });

        it("returns false if refreshDeviceDataKey changes", () => {
            const prevProps = getProps({ refreshDeviceDataKey: 1 });
            const nextProps = getProps({ refreshDeviceDataKey: 2 });
            expect(areEqual(prevProps, nextProps)).toBe(false);
        });

        it("returns false if currentDeviceId changes", () => {
            const prevProps = getProps({ currentDeviceId: "mac-123" });
            const nextProps = getProps({ currentDeviceId: "mac-456" });
            expect(areEqual(prevProps, nextProps)).toBe(false);
        });

        it("returns false if macId changes", () => {
            const prevProps = getProps({ row: { original: { macId: "mac-123", status: "online", connectivity: "wifi" } } });
            const nextProps = getProps({ row: { original: { macId: "mac-456", status: "online", connectivity: "wifi" } } });
            expect(areEqual(prevProps, nextProps)).toBe(false);
        });

        it("returns false if status changes", () => {
            const prevProps = getProps({ row: { original: { macId: "mac-123", status: "online", connectivity: "wifi" } } });
            const nextProps = getProps({ row: { original: { macId: "mac-123", status: "offline", connectivity: "wifi" } } });
            expect(areEqual(prevProps, nextProps)).toBe(false);
        });

        it("returns false if connectivity changes", () => {
            const prevProps = getProps({ row: { original: { macId: "mac-123", status: "online", connectivity: "wifi" } } });
            const nextProps = getProps({ row: { original: { macId: "mac-123", status: "online", connectivity: "ethernet" } } });
            expect(areEqual(prevProps, nextProps)).toBe(false);
        });

        it("returns false if updatedFieldsMap contents change (length)", () => {
            const prevProps = getProps({ updatedFieldsMap: { "mac-123": ["status"] } });
            const nextProps = getProps({ updatedFieldsMap: { "mac-123": ["status", "macId"] } });
            expect(areEqual(prevProps, nextProps)).toBe(false);
        });

        it("returns false if updatedFieldsMap contents change (value)", () => {
            const prevProps = getProps({ updatedFieldsMap: { "mac-123": ["status"] } });
            const nextProps = getProps({ updatedFieldsMap: { "mac-123": [] } });
            expect(areEqual(prevProps, nextProps)).toBe(false);
        });

        it("returns true if nothing relevant changes", () => {
            const prevProps = getProps();
            const nextProps = getProps();
            expect(areEqual(prevProps, nextProps)).toBe(true);
        });
    });

});