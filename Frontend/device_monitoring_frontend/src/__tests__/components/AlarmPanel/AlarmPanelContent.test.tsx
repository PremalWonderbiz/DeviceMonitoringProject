import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {

    DeviceTags,
    CustomTag,
    AlarmPopUp,
    ProfilePopUp,
} from "@/components/customcomponents/AlarmPanel/AlarmPanelContent";

import "@testing-library/jest-dom";

// Mock Chakra UI Tag components
jest.mock("@chakra-ui/react", () => {
    const Tag = ({ children }: any) => <div>{children}</div>;
    Tag.Root = ({ children, ...props }: any) => <div {...props}>{children}</div>;
    Tag.Label = ({ children }: any) => <span>{children}</span>;
    Tag.EndElement = ({ children }: any) => <span>{children}</span>;
    Tag.CloseTrigger = ({ onClick }: any) => (
        <button data-testid="close-trigger" onClick={onClick}>x</button>
    );
    return {
        HStack: ({ children }: any) => <div>{children}</div>,
        Tag,
    };
});

// Mock styles and icons
jest.mock("@/styles/scss/AlarmPanel.module.scss", () => ({}));
jest.mock("lucide-react", () => ({
    MessagesSquare: () => <span>MessagesSquare</span>,
    Settings2: () => <span>Settings2</span>,
    SquareUser: () => <span>SquareUser</span>,
}));
jest.mock("@/utils/helperfunctions", () => ({
    formatRelativeTime: (date: string) => `formatted-${date}`,
}));

describe("AlarmPanelContent Components", () => {
    describe("DeviceTags", () => {
        it("renders tags and calls removeTag on close", () => {
            const tags = [{ deviceName: "Device1" }, { deviceName: "Device2" }];
            const removeTag = jest.fn();
            render(<DeviceTags tags={tags} removeTag={removeTag} />);
            expect(screen.getByText("Device1")).toBeInTheDocument();
            expect(screen.getByText("Device2")).toBeInTheDocument();

            const closeButtons = screen.getAllByTestId("close-trigger");
            fireEvent.click(closeButtons[0]);
            expect(removeTag).toHaveBeenCalledWith(0);
        });
    });

    describe("CustomTag", () => {
        it("renders tag and triggers removeTag", () => {
            const removeTag = jest.fn();
            render(<CustomTag tag="TestTag" index={5} removeTag={removeTag} />);
            expect(screen.getByText("TestTag")).toBeInTheDocument();
            fireEvent.click(screen.getByTestId("close-trigger"));
            expect(removeTag).toHaveBeenCalledWith(5);
        });
    });

    describe("AlarmPopUp", () => {
        it("renders alarms and triggers setIsAlarmPanelOpen", () => {
            const setIsAlarmPanelOpen = jest.fn();
            const latestAlarms = [
                { id: 1, severity: "Critical", message: "Alarm1", raisedAt: "2024-01-01" },
                { id: 2, severity: "Warning", message: "Alarm2", raisedAt: "2024-01-02" },
            ];
            render(
                <AlarmPopUp
                    setIsAlarmPanelOpen={setIsAlarmPanelOpen}
                    latestAlarms={latestAlarms}
                    totalAlarms={2}
                />
            );
            expect(screen.getByText("Alarm1")).toBeInTheDocument();
            expect(screen.getByText("Alarm2")).toBeInTheDocument();
            expect(screen.getByText("formatted-2024-01-01")).toBeInTheDocument();
            expect(screen.getByText("formatted-2024-01-02")).toBeInTheDocument();

            fireEvent.click(screen.getByText("View all"));
            expect(setIsAlarmPanelOpen).toHaveBeenCalledWith(true);
        });
    });

    describe("ProfilePopUp", () => {
        it("renders profile info and buttons", () => {
            render(<ProfilePopUp />);
            expect(screen.getByText("Welcome, Premal Kadam")).toBeInTheDocument();
            expect(screen.getByText("premal.kadam@wonderbiz.in")).toBeInTheDocument();
            expect(screen.getByText("My Account")).toBeInTheDocument();
            expect(screen.getByText("Notifications")).toBeInTheDocument();
            expect(screen.getByText("Settings")).toBeInTheDocument();
            expect(screen.getByText("Logout")).toBeInTheDocument();
        });

        it("logout button stops event propagation", () => {
            const parentClick = jest.fn();
            render(
                <div onClick={parentClick}>
                    <ProfilePopUp />
                </div>
            );

            fireEvent.click(screen.getByText("Logout"));

            // If stopPropagation worked, parentClick should NOT be called
            expect(parentClick).not.toHaveBeenCalled();
        });
    });
});

