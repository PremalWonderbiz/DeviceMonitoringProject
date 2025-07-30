import React from "react";
import { render, screen } from "@testing-library/react";
import KeyValueField from "@/components/customcomponents/Propertypanel/KeyValueField";
import '@testing-library/jest-dom';
const { areEqual } = require("@/components/customcomponents/Propertypanel/KeyValueField");

jest.mock("@/styles/scss/PropertyPanel.module.scss", () => ({
    kvRow: "kvRow",
    kvKey: "kvKey",
    kvValue: "kvValue",
    highlight: "highlight",
    "depth-0": "depth-0",
    "depth-1": "depth-1",
    "depth-2": "depth-2",
    "depth-3": "depth-3",
}));

describe("KeyValueField", () => {
    const defaultProps = {
        keyName: "Test Key",
        value: "Test Value",
        depth: 1,
        fullPath: "root.test",
        highlightedPaths: [],
    };

    it("renders key and value correctly", () => {
        render(<KeyValueField {...defaultProps} />);
        expect(screen.getByText("Test Key")).toBeInTheDocument();
        expect(screen.getByText("Test Value")).toBeInTheDocument();
    });

    it("applies correct depth class", () => {
        render(<KeyValueField {...defaultProps} depth={3} />);
        const keyElement = screen.getByText("Test Key");
        expect(keyElement.className).toContain("depth-3");
    });

    it("renders boolean value as 'Yes' or 'No'", () => {
        const { rerender } = render(
            <KeyValueField {...defaultProps} value={true} />
        );
        expect(screen.getByText("Yes")).toBeInTheDocument();

        rerender(<KeyValueField {...defaultProps} value={false} />);
        expect(screen.getByText("No")).toBeInTheDocument();
    });

    it("applies highlight class when path is highlighted", () => {
        render(
            <KeyValueField
                {...defaultProps}
                highlightedPaths={["root.test"]}
                fullPath="root.test"
            />
        );
        const valueElement = screen.getByText("Test Value");
        expect(valueElement.className).toContain("highlight");
    });

    it("does not apply highlight class when path is not highlighted", () => {
        render(
            <KeyValueField
                {...defaultProps}
                highlightedPaths={["other.path"]}
                fullPath="root.test"
            />
        );
        const valueElement = screen.getByText("Test Value");
        expect(valueElement.className).not.toContain("highlight");
    });

    //areEqual function tests
    describe("areEqual", () => {
        it("returns true if value and highlight status are unchanged", () => {
            const prevProps = {
                value: "foo",
                highlightedPaths: ["a.b"],
                fullPath: "a.b"
            };
            const nextProps = {
                value: "foo",
                highlightedPaths: ["a.b"],
                fullPath: "a.b"
            };
            expect(areEqual(prevProps, nextProps)).toBe(true);
        });

        it("returns false if value has changed", () => {
            const prevProps = {
                value: "foo",
                highlightedPaths: ["a.b"],
                fullPath: "a.b"
            };
            const nextProps = {
                value: "bar",
                highlightedPaths: ["a.b"],
                fullPath: "a.b"
            };
            expect(areEqual(prevProps, nextProps)).toBe(false);
        });

        it("returns false if highlight status changes from not highlighted to highlighted", () => {
            const prevProps = {
                value: "foo",
                highlightedPaths: [],
                fullPath: "a.b"
            };
            const nextProps = {
                value: "foo",
                highlightedPaths: ["a.b"],
                fullPath: "a.b"
            };
            expect(areEqual(prevProps, nextProps)).toBe(false);
        });

        it("returns false if highlight status changes from highlighted to not highlighted", () => {
            const prevProps = {
                value: "foo",
                highlightedPaths: ["a.b"],
                fullPath: "a.b"
            };
            const nextProps = {
                value: "foo",
                highlightedPaths: [],
                fullPath: "a.b"
            };
            expect(areEqual(prevProps, nextProps)).toBe(false);
        });

        it("returns true if fullPath is not in highlightedPaths in both prev and next", () => {
            const prevProps = {
                value: "foo",
                highlightedPaths: ["x.y"],
                fullPath: "a.b"
            };
            const nextProps = {
                value: "foo",
                highlightedPaths: ["z.w"],
                fullPath: "a.b"
            };
            expect(areEqual(prevProps, nextProps)).toBe(true);
        });
    });
});
