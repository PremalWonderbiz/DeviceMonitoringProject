import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import CustomModal from "@/components/customcomponents/AlarmPanel/CustomModal";
import "@testing-library/jest-dom";

jest.useFakeTimers(); // use Jest fake timers for debounce

describe("CustomModal", () => {
  const setIsOpen = jest.fn();
  const actionFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("does not render when isOpen is false", () => {
    render(
      <CustomModal
        isOpen={false}
        setIsOpen={setIsOpen}
        title="Alarm"
        actionFunction={actionFunction}
      />
    );

    expect(screen.queryByText("Alarm")).not.toBeInTheDocument();
  });

  test("renders when isOpen is true", () => {
    render(
      <CustomModal
        isOpen={true}
        setIsOpen={setIsOpen}
        title="Alarm Title"
        actionFunction={actionFunction}
      />
    );

    expect(screen.getByText("Alarm Title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Comment")).toBeInTheDocument();
  });

  test("closes when Close button is clicked", () => {
    render(
      <CustomModal
        isOpen={true}
        setIsOpen={setIsOpen}
        title="Alarm"
        actionFunction={actionFunction}
      />
    );

    fireEvent.click(screen.getByText("×"));
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  test("closes when Cancel button is clicked", () => {
    render(
      <CustomModal
        isOpen={true}
        setIsOpen={setIsOpen}
        title="Alarm"
        actionFunction={actionFunction}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  test("does not call actionFunction when Save clicked and comment empty", () => {
    render(
      <CustomModal
        isOpen={true}
        setIsOpen={setIsOpen}
        title="Alarm"
        actionFunction={actionFunction}
      />
    );

    fireEvent.click(screen.getByText("Save"));
    expect(actionFunction).not.toHaveBeenCalled();
  });

  test("updates comment after debounce and calls actionFunction on Save", async () => {
    render(
      <CustomModal
        isOpen={true}
        setIsOpen={setIsOpen}
        title="Alarm"
        actionFunction={actionFunction}
      />
    );

    const textarea = screen.getByPlaceholderText("Comment");

    // Type into textarea
    fireEvent.change(textarea, { target: { value: "Test Comment" } });

    // Fast-forward debounce timer
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Click Save
    fireEvent.click(screen.getByText("Save"));

    expect(actionFunction).toHaveBeenCalledWith("Test Comment");
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  test("stops click propagation inside modal", () => {
    const parentClick = jest.fn();
    render(
        <div onClick={parentClick}>
            <CustomModal
              isOpen={true}
              setIsOpen={setIsOpen}
              title="Alarm"
              actionFunction={actionFunction}
            />

        </div>
    );

    const wrapper = screen.getByTestId("customModalWrapper");

    fireEvent.click(wrapper);

    expect(parentClick).not.toHaveBeenCalled();
  });
});
