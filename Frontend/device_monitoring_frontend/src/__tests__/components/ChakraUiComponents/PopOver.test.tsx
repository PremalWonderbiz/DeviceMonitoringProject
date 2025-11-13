import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import PopOver from "@/components/chakrauicomponents/PopOver";


jest.mock("@chakra-ui/react", () => {
    const React = require("react");
    const PopoverContext = React.createContext({ open: false });

    const Root = ({ children, open }: any) =>
        React.createElement(PopoverContext.Provider, { value: { open } }, children);

    const Trigger = ({ children }: any) => children;

    const Portal = ({ children }: any) => children;

    const Positioner = ({ children }: any) => {
        const { open } = React.useContext(PopoverContext);
        return open ? React.createElement("div", { "data-testid": "positioner" }, children) : null;
    };

    const Content = ({ children, bgColor }: any) =>
        React.createElement("div", { "data-testid": "content", style: { backgroundColor: bgColor } }, children);

    const Body = ({ children, onMouseEnter, onMouseLeave }: any) =>
        React.createElement("div", { onMouseEnter, onMouseLeave }, children);

    const Button = ({ children, ...rest }: any) =>
        React.createElement("button", rest, children || "button");

    return {
        Button,
        Popover: {
            Root,
            Trigger,
            Positioner,
            Content,
            Body,
        },
        Portal,
    };
});



describe("PopOver component", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("renders default trigger when no triggerContent is provided", () => {
        render(<PopOver isOpen={false}>Hidden</PopOver>);
        expect(screen.getByText("Open PopOver")).toBeInTheDocument();
    });

    test("renders custom trigger content when provided", () => {
        render(
            <PopOver isOpen={false} triggerContent={<button>My Trigger</button>}>
                Hidden
            </PopOver>
        );
        expect(screen.getByText("My Trigger")).toBeInTheDocument();
    });

    test("shows children when isOpen is true", () => {
        render(<PopOver isOpen={true}>Visible Popover Content</PopOver>);
        expect(screen.getByText("Visible Popover Content")).toBeInTheDocument();
    });

    test("does not render children when isOpen is false", () => {
        render(<PopOver isOpen={false}>Hidden Popover Content</PopOver>);
        expect(screen.queryByText("Hidden Popover Content")).toBeNull();
    });
});