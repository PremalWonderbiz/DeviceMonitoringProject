import '@testing-library/jest-dom';
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "@/components/customcomponents/SideBar";
import { Provider } from '@/components/ui/provider';

// Mock window.matchMedia for tests
beforeAll(() => {
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
});

describe("Sidebar", () => {
    const closeIconMsg = "Close sidebar";
    const openIconMsg = "Open sidebar";
    const children = <div data-testid="sidebar-content">Sidebar Content</div>;

    const renderWithProvider = (ui: React.ReactElement) =>
        render(<Provider>{ui}</Provider>);

    it("renders children", () => {
        renderWithProvider(
            <Sidebar isOpen={true} closeIconMsg={closeIconMsg} openIconMsg={openIconMsg}>
                {children}
            </Sidebar>
        );
        expect(screen.getByTestId("sidebar-content")).toBeInTheDocument();
    });

    //left sidebar tests
    it("shows close button when open (left)", () => {
        renderWithProvider(
            <Sidebar position="left" isOpen={true} closeIconMsg={closeIconMsg} openIconMsg={openIconMsg} />
        );
        expect(screen.getByTestId("Leftsidebar-close-button")).toBeInTheDocument();
    });

    it("shows open icon when closed (left)", () => {
        renderWithProvider(
            <Sidebar position="left" isOpen={false} closeIconMsg={closeIconMsg} openIconMsg={openIconMsg} />
        );
        expect(screen.getByTestId("Leftsidebar-open-button")).toBeInTheDocument();
    });

    it("calls setIsOpen(false) when close button clicked (left)", () => {
        const setIsOpen = jest.fn();
        renderWithProvider(
            <Sidebar position="left" isOpen={true} setIsOpen={setIsOpen} closeIconMsg={closeIconMsg} openIconMsg={openIconMsg} />
        );
        fireEvent.click(screen.getByTestId("Leftsidebar-close-button"));
        expect(setIsOpen).toHaveBeenCalledWith(false);
    });

    it("calls setIsOpen(true) when open icon clicked (left)", () => {
        const setIsOpen = jest.fn();
        renderWithProvider(
            <Sidebar position="left" isOpen={false} setIsOpen={setIsOpen} closeIconMsg={closeIconMsg} openIconMsg={openIconMsg} />
        );
        fireEvent.click(screen.getByTestId("Leftsidebar-open-button"));
        expect(setIsOpen).toHaveBeenCalledWith(true);
    });

    //right sidebar tests
    it("shows close button when open (right)", () => {
        renderWithProvider(
            <Sidebar position="right" isOpen={true} closeIconMsg={closeIconMsg} openIconMsg={openIconMsg} />
        );
        expect(screen.getByTestId("Rightsidebar-close-button")).toBeInTheDocument();
    });

    it("shows open icon when closed (right)", () => {
        renderWithProvider(
            <Sidebar position="right" isOpen={false} closeIconMsg={closeIconMsg} openIconMsg={openIconMsg} />
        );
        expect(screen.getByTestId("Rightsidebar-open-button")).toBeInTheDocument();
    });

    it("calls closeSidebar() when close button clicked (right)", () => {
        const closeSidebar = jest.fn();
        renderWithProvider(
            <Sidebar position="right" isOpen={true} closeSidebar={closeSidebar} closeIconMsg={closeIconMsg} openIconMsg={openIconMsg} />
        );
        fireEvent.click(screen.getByTestId("Rightsidebar-close-button"));
        expect(closeSidebar).toHaveBeenCalled();
    });

    it("calls setIsOpen(true) when open icon clicked (right)", () => {
        const setIsOpen = jest.fn();
        renderWithProvider(
            <Sidebar position="right" isOpen={false} setIsOpen={setIsOpen} closeIconMsg={closeIconMsg} openIconMsg={openIconMsg} />
        );
        fireEvent.click(screen.getByTestId("Rightsidebar-open-button"));
        expect(setIsOpen).toHaveBeenCalledWith(true);
    });
    
});