import React from "react";
import { render, fireEvent, screen, getByTestId } from "@testing-library/react";
import Pagination from "@/components/customcomponents/Pagination";
import '@testing-library/jest-dom';

describe("Pagination", () => {
    const defaultProps = {
        currentPage: 2,
        totalPages: 5,
        pageSize: 10,
        pageSizeOptions: [5, 10, 20],
        setCurrentPage: jest.fn(),
        setPageSize: jest.fn(),
    };

    it("renders page numbers and navigation buttons", () => {
        render(<Pagination {...defaultProps} />);
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.getByTestId("previous-button")).toBeInTheDocument();
        expect(screen.getByTestId("next-button")).toBeInTheDocument();
    });

    it("calls setCurrentPage when a page number is clicked", () => {
        render(<Pagination {...defaultProps} />);
        fireEvent.click(screen.getByText("3"));
        expect(defaultProps.setCurrentPage).toHaveBeenCalledWith(3);
    });

    it("disables previous button on first page", () => {
        render(<Pagination {...defaultProps} currentPage={1} />);
        expect(screen.getByTestId("previous-button")).toBeDisabled();
    });

    it("disables next button on last page", () => {
        render(<Pagination {...defaultProps} currentPage={5} />);
        expect(screen.getByTestId("next-button")).toBeDisabled();
    });

    it("calls setCurrentPage when previous and next buttons are clicked", () => {
        render(<Pagination {...defaultProps} />);
        fireEvent.click(screen.getByTestId("previous-button"));
        expect(defaultProps.setCurrentPage).toHaveBeenCalledWith(1);
        fireEvent.click(screen.getByTestId("next-button"));
        expect(defaultProps.setCurrentPage).toHaveBeenCalledWith(3);
    });

    it("renders page size options and calls setPageSize on change", () => {
        render(<Pagination {...defaultProps} />);
        const select = screen.getByRole("combobox");
        fireEvent.change(select, { target: { value: "5" } });
        expect(defaultProps.setPageSize).toHaveBeenCalledWith(5);
    });

    it("shows correct page info", () => {
        render(<Pagination {...defaultProps} />);
        expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
    });

    it("renders ellipsis for large number of pages", () => {
        render(
            <Pagination
                {...defaultProps}
                totalPages={10}
                currentPage={1}
            />
        );
        expect(screen.getAllByText("...").length).toBeGreaterThan(0);
    });

    it("shows ChevronDown when select is closed", () => {
        const { getByRole } = render(<Pagination {...defaultProps} />);
        // Initially, select is closed
        expect(getByRole("combobox")).toBeInTheDocument();
        // Should show ChevronDown
        expect(screen.getByTestId("pageSize-chevrondown")).toBeInTheDocument();
    });

    it("shows ChevronUp when select is open", () => {
        const { getByRole } = render(<Pagination {...defaultProps} />);
        const select = getByRole("combobox");
        // Focus the select to open
        fireEvent.focus(select);
        // Should show ChevronUp
        expect(screen.getByTestId("pageSize-chevronup")).toBeInTheDocument();
    });
});