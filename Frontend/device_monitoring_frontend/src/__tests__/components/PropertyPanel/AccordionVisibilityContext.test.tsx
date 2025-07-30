import React from "react";
import { render, act } from "@testing-library/react";
import { AccordionStateProvider, useAccordionState } from "@/components/customcomponents/Propertypanel/AccordionVisibilityContext";
import '@testing-library/jest-dom';

const TestComponent = () => {
    const context = useAccordionState();
    if (!context) return null;
    const { register, toggle, getState } = context;

    // For testing, register and toggle on mount
    React.useEffect(() => {
        register("panel1", false);
        register("panel2", true);
        toggle("panel1", true);
        toggle("panel2", false);
    }, []);

    return (
        <div>
            <span data-testid="panel1">{String(getState("panel1"))}</span>
            <span data-testid="panel2">{String(getState("panel2"))}</span>
            <span data-testid="panel3">{String(getState("panel3"))}</span>
        </div>
    );
};

describe("AccordionVisibilityContext", () => {
    it("registers and toggles accordion state correctly", () => {
        const { getByTestId } = render(
            <AccordionStateProvider>
                <TestComponent />
            </AccordionStateProvider>
        );

        // panel1 was registered as false, then toggled to true in useEffect of TestComponent
        expect(getByTestId("panel1").textContent).toBe("true");
        // panel2 was registered as true, then toggled to false in useEffect of TestComponent
        expect(getByTestId("panel2").textContent).toBe("false");
        // panel3 was never registered
        expect(getByTestId("panel3").textContent).toBe("undefined");
    });

    it("does not overwrite existing registration", () => {
        let context: ReturnType<typeof useAccordionState> | null = null;

        const RegisterTwice = () => {
            context = useAccordionState();
            React.useEffect(() => {
                context?.register("panelX", false);
                context?.register("panelX", true); // Should not overwrite
            }, []);
            return <span data-testid="panelX">{String(context?.getState("panelX"))}</span>;
        };

        const { getByTestId } = render(
            <AccordionStateProvider>
                <RegisterTwice />
            </AccordionStateProvider>
        );

        expect(getByTestId("panelX").textContent).toBe("false");
    });

    it("returns undefined for unregistered panels", () => {
        let context: ReturnType<typeof useAccordionState> | null = null;

        const Unregistered = () => {
            context = useAccordionState();
            return <span data-testid="unregistered">{String(context?.getState("notRegistered"))}</span>;
        };

        const { getByTestId } = render(
            <AccordionStateProvider>
                <Unregistered />
            </AccordionStateProvider>
        );

        expect(getByTestId("unregistered").textContent).toBe("undefined");
    });
});