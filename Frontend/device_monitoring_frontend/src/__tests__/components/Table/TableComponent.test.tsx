import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TableComponent from "@/components/customcomponents/Table/TableComponent";
import '@testing-library/jest-dom';
import { flexRender } from "@tanstack/react-table";


// Mock dependencies
jest.mock("@/components/customcomponents/Table/TableRow", () => (props: any) => (
    <tr data-testid="tablerow-mock">
        {props.row.getVisibleCells().map((cell: any) => (
            <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
        ))}
    </tr>
));
jest.mock("@/components/customcomponents/Pagination", () => (props: any) => (
    <div data-testid="pagination-mock">
        <button onClick={() => props.setCurrentPage(1)}>Page 1</button>
    </div>
));
jest.mock("@/utils/helperfunctions", () => ({
    capitalizeFirstLetter: (str: string) => str.charAt(0).toUpperCase() + str.slice(1),
    formatDateTime: (val: string) => `formatted-${val}`,
}));

jest.mock("lucide-react", () => ({
    ArrowUp: () => <span data-testid="arrow-up" />,
    ArrowDown: () => <span data-testid="arrow-down" />,
}));

describe("TableComponent", () => {
    const baseProps = {
        currentDeviceId: "device1",
        sorting: [],
        setSorting: jest.fn(),
        refreshDeviceDataKey: 1,
        updatedFieldsMap: {},
        currentPage: 1,
        setCurrentPage: jest.fn(),
        totalPages: 2,
        pageSize: 5,
        setPageSize: jest.fn(),
        setIsPropertyPanelOpen: jest.fn(),
    };

    it("renders 'No data available.' when data is empty", () => {
        render(<TableComponent {...baseProps} data={[]} />);
        expect(screen.getByText("No data available.")).toBeInTheDocument();
    });

    it("renders table headers and rows", () => {
        const data = [
            { id: 1, name: "Device A", lastUpdated: "2024-06-01T12:00:00Z" },
            { id: 2, name: "Device B", lastUpdated: "2024-06-02T12:00:00Z" },
        ];
        render(<TableComponent {...baseProps} data={data} />);
        expect(screen.getByText("Id")).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("LastUpdated")).toBeInTheDocument();
        // TableRow mock renders cell values
        expect(screen.getAllByTestId("tablerow-mock")).toHaveLength(2);
        expect(screen.getByText("Device A")).toBeInTheDocument();
        expect(screen.getByText("Device B")).toBeInTheDocument();
        expect(screen.getByText("formatted-2024-06-01T12:00:00Z")).toBeInTheDocument();
    });

    it("renders Pagination component", () => {
        const data = [{ id: 1, name: "Device A", lastUpdated: "2024-06-01T12:00:00Z" }];
        render(<TableComponent {...baseProps} data={data} />);
        expect(screen.getByTestId("pagination-mock")).toBeInTheDocument();
    });

    it("calls setSorting when header is clicked", () => {
        const data = [
            { id: 1, name: "Device A", lastUpdated: "2024-06-01T12:00:00Z" },
            { id: 2, name: "Device B", lastUpdated: "2024-06-02T12:00:00Z" },
        ];
        const setSorting = jest.fn();
        render(<TableComponent {...baseProps} data={data} setSorting={setSorting} />);
        // Find the first header cell (Id)
        const header = screen.getByText("Id");
        fireEvent.click(header);
        // setSorting should be called (handled by react-table, so we check if it was called at least once)
        expect(setSorting).toHaveBeenCalled();
    });

    it("shows ArrowUp icon when column is sorted ascending", () => {
        const data = [
            { id: 1, name: "Device A", lastUpdated: "2024-06-01T12:00:00Z" },
            { id: 2, name: "Device B", lastUpdated: "2024-06-02T12:00:00Z" },
        ];
        // Simulate sorting state for 'id' column ascending
        render(
            <TableComponent
                {...baseProps}
                data={data}
                sorting={[{ id: "id", desc: false }]}
            />
        );
        // ArrowUp should be in the document
        expect(screen.getByTestId("arrow-up")).toBeInTheDocument();
        // Optionally, check for ArrowUp by title or role if your icon lib supports it
    });

    it("shows ArrowDown icon when column is sorted descending", () => {
        const data = [
            { id: 1, name: "Device A", lastUpdated: "2024-06-01T12:00:00Z" },
            { id: 2, name: "Device B", lastUpdated: "2024-06-02T12:00:00Z" },
        ];
        // Simulate sorting state for 'id' column descending
        render(
            <TableComponent
                {...baseProps}
                data={data}
                sorting={[{ id: "id", desc: true }]}
            />
        );
        // ArrowDown should be in the document
        expect(screen.getByTestId("arrow-down")).toBeInTheDocument();
    });

    it("shows no sort icon when column is not sorted", () => {
        const data = [
            { id: 1, name: "Device A", lastUpdated: "2024-06-01T12:00:00Z" },
            { id: 2, name: "Device B", lastUpdated: "2024-06-02T12:00:00Z" },
        ];
        // No sorting applied
        render(
            <TableComponent
                {...baseProps}
                data={data}
                sorting={[]}
            />
        );
        // No ArrowUp or ArrowDown icon should be present
        expect(screen.queryByTestId("arrow-up")).not.toBeInTheDocument();
        expect(screen.queryByTestId("arrow-down")).not.toBeInTheDocument();
    });

    it("calls sorting handler when sortable header is clicked", () => {
        const data = [{ id: 1, name: "Device A" }];
        const setSorting = jest.fn();
        render(<TableComponent {...baseProps} data={data} setSorting={setSorting} />);
        // Find the sortable header (Id)
        const header = screen.getByText("Id");
        fireEvent.click(header);
        expect(setSorting).toHaveBeenCalled();
    });
});
