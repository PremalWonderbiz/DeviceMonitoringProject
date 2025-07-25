import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react";
import TableRow from "@/components/customcomponents/Table/TableRow";
import '@testing-library/jest-dom';

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
                        refreshDeviceDataKey={1}
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
        console.log("td count:", tds.length);
        tds.forEach((td, i) => console.log(`td[${i}] text:`, td.textContent, "class:", td.className));

        expect(tds[0].classList.contains("highlightedCell")).toBe(true);
        expect(tds[1].classList.contains("highlightedCell")).toBe(false);

        // Advance timers by 3 seconds to remove highlight
        act(() => {
            jest.advanceTimersByTime(3000);
        });

        // Query again and check class removal
        tds = container.querySelectorAll("td");
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
                        refreshDeviceDataKey={1}
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
});