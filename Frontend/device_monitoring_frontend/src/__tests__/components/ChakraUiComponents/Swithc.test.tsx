import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import SwitchComponent from "@/components/chakrauicomponents/SwitchComponent"
import '@testing-library/jest-dom';

// Mock chakra Switch subcomponents
jest.mock("@chakra-ui/react", () => {
    const Root = ({ checked, children, ...rest }: any) => (
        <div
            data-testid="switch-root"
            data-checked={String(checked)}
            data-colorpalette={rest.colorPalette}
            data-size={rest.size}
        >
            {children}
        </div>
    )
    const HiddenInput = () => <input data-testid="hidden-input" />
    const Control = ({ onClick, children }: any) => (
        <button data-testid="switch-control" onClick={onClick}>
            {children}
        </button>
    )
    const Thumb = ({ children }: any) => <div data-testid="switch-thumb">{children}</div>
    const ThumbIndicator = ({ fallback, children }: any) => (
        <div data-testid="switch-thumb-indicator">{children ? children : fallback}</div>
    )

    return {
        Switch: {
            Root,
            HiddenInput,
            Control,
            Thumb,
            ThumbIndicator,
        },
    }
})

// Mock react-icons/hi to render simple text nodes for predictable queries
jest.mock("react-icons/hi", () => ({
    HiCheck: () => <span data-testid="hi-check">HiCheck</span>,
    HiX: () => <span data-testid="hi-x">HiX</span>,
}))

// Mock local Tooltip component used by the component under test
jest.mock("../../../components/ui/tooltip", () => {
    return {
        Tooltip: ({ children, content }: any) => (
            <div data-testid="tooltip">
                {children}
                <div data-testid="tooltip-content">
                    {content}
                </div>
            </div>
        ),
    }
})


describe("SwitchComponent - returnSwitch", () => {
    test("renders switch with checked state and invokes toggle on control click", () => {
        const toggle = jest.fn()
        render(<SwitchComponent enabled={true} toggle={toggle} />)

        const root = screen.getByTestId("switch-root")
        expect(root).toHaveAttribute("data-checked", "true")
        expect(root).toHaveAttribute("data-colorpalette", "green")
        expect(root).toHaveAttribute("data-size", "md")

        // Icon present
        expect(screen.getByTestId("hi-check")).toBeInTheDocument()

        // Click the control to invoke toggle
        const control = screen.getByTestId("switch-control")
        fireEvent.click(control)
        expect(toggle).toHaveBeenCalledTimes(1)
    })

    test("wraps switch with Tooltip when tooltip prop provided and still clickable", () => {
        const toggle = jest.fn()
        const tooltipText = "Helpful tooltip"
        render(<SwitchComponent enabled={false} toggle={toggle} tooltip={tooltipText} />)

        // Tooltip wrapper exists and contains provided tooltip text
        const tooltip = screen.getByTestId("tooltip")
        expect(tooltip).toBeInTheDocument()
        expect(screen.getByTestId("tooltip-content")).toHaveTextContent(tooltipText)

        // Switch root reflects disabled state
        const root = screen.getByTestId("switch-root")
        expect(root).toHaveAttribute("data-checked", "false")

        // Clicking inside tooltip-wrapped control still triggers toggle
        const control = screen.getByTestId("switch-control")
        fireEvent.click(control)
        expect(toggle).toHaveBeenCalledTimes(1)
    })
})