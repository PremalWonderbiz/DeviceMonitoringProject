import Accordion from "@/components/customcomponents/Accordion";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';

// Mock styles and icons
jest.mock("@/styles/scss/Accordion.module.scss", () => ({
    accordion: "accordion",
    header: "header",
    tabListHeader: "tabListHeader",
    content: "content",
    open: "open",
}));

jest.mock("lucide-react", () => ({
    ChevronDown: () => <span data-testid="chevron-down" />,
    ChevronUp: () => <span data-testid="chevron-up" />,
}));

// Mock AccordionVisibilityContext
const mockContext = {
    getState: jest.fn(),
    toggle: jest.fn(),
    register: jest.fn(),
};

jest.mock("../../components/customcomponents/Propertypanel/AccordionVisibilityContext", () => ({
    useAccordionState: () => mockContext,
}));

describe("Accordion", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders with title and children", () => {
        render(
            <Accordion title="Test Title">
                <div>Test Content</div>
            </Accordion>
        );
        expect(screen.getByText("Test Title")).toBeInTheDocument();
        expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("shows ChevronUp when open and ChevronDown when closed", () => {
        render(
            <Accordion title="Test Title" defaultOpen={true}>
                <div>Test Content</div>
            </Accordion>
        );
        expect(screen.getByTestId("chevron-up")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Test Title"));
        expect(screen.getByTestId("chevron-down")).toBeInTheDocument();
    });

    it("toggles open/close state when header is clicked (uncontrolled)", () => {
        render(
            <Accordion title="Toggle Test" defaultOpen={false}>
                <div>Toggle Content</div>
            </Accordion>
        );
        expect(screen.getByTestId("chevron-down")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Toggle Test"));
        expect(screen.getByTestId("chevron-up")).toBeInTheDocument();
    });

    it("applies tabListHeader class when isTabList is true", () => {
        render(
            <Accordion title="TabList Test" isTabList>
                <div>TabList Content</div>
            </Accordion>
        );
        const header = screen.getByText("TabList Test").parentElement;
        expect(header?.className).toContain("tabListHeader");
    });

    it("uses context when keyPath is provided", () => {
        mockContext.getState.mockReturnValue(true);
        render(
            <Accordion title="Context Test" keyPath="panel1">
                <div>Context Content</div>
            </Accordion>
        );
        expect(mockContext.register).toHaveBeenCalledWith("panel1", true);
        expect(screen.getByTestId("chevron-up")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Context Test"));
        expect(mockContext.toggle).toHaveBeenCalledWith("panel1", false);
    });
});