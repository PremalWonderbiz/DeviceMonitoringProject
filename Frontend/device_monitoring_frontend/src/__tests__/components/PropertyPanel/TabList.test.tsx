import React from "react";
import { render, fireEvent } from "@testing-library/react";
import TabList from "@/components/customcomponents/Propertypanel/TabList";
import '@testing-library/jest-dom';

// Mock styles
jest.mock("@/styles/scss/PropertyPanel.module.scss", () => ({
    tabListUL: "tabListUL",
    tabListLi: "tabListLi",
    tabListLiActive: "tabListLiActive",
    highlightedTitle: "highlightedTitle",
}));

// Mock AccordionVisibilityContext
const toggleMock = jest.fn();
const getStateMock = jest.fn();
const useAccordionStateMock = jest.fn();

jest.mock(
    "@/components/customcomponents/Propertypanel/AccordionVisibilityContext",
    () => ({
        useAccordionState: () => useAccordionStateMock(),
    })
);

describe("TabList", () => {
    const setActiveTab = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders both tabs", () => {
        useAccordionStateMock.mockReturnValue({});
        const { getByText } = render(
            <TabList highlightedPaths={[]} activeTab="Static" setActiveTab={setActiveTab} />
        );
        expect(getByText("Static")).toBeInTheDocument();
        expect(getByText("Health")).toBeInTheDocument();
    });

    it("calls setActiveTab and toggle when a tab is clicked", () => {
        useAccordionStateMock.mockReturnValue({
            state: true,
            toggle: toggleMock,
            getState: getStateMock,
        });
        const { getByText } = render(
            <TabList highlightedPaths={[]} activeTab="Static" setActiveTab={setActiveTab} />
        );
        fireEvent.click(getByText("Health"));
        expect(setActiveTab).toHaveBeenCalledWith("Health");
        expect(toggleMock).toHaveBeenCalledWith("Health", true);
    });

    it("applies active class to the active tab", () => {
        useAccordionStateMock.mockReturnValue({});
        const { getByText } = render(
            <TabList highlightedPaths={[]} activeTab="Health" setActiveTab={setActiveTab} />
        );
        const healthTab = getByText("Health");
        expect(healthTab.className).toContain("tabListLiActive");
    });

    it("applies highlightedTitle class when conditions are met", () => {
        getStateMock.mockReturnValue(false);
        useAccordionStateMock.mockReturnValue({
            getState: getStateMock,
        });
        const { getByText } = render(
            <TabList highlightedPaths={["/some/path"]} activeTab="Health" setActiveTab={setActiveTab} />
        );
        const healthTab = getByText("Health");
        expect(healthTab.className).toContain("highlightedTitle");
    });

    it("does not apply highlightedTitle class when conditions are not met", () => {
        getStateMock.mockReturnValue(true);
        useAccordionStateMock.mockReturnValue({
            getState: getStateMock,
        });
        const { getByText } = render(
            <TabList highlightedPaths={[]} activeTab="Health" setActiveTab={setActiveTab} />
        );
        const healthTab = getByText("Health");
        expect(healthTab.className).not.toContain("highlightedTitle");
    });
});