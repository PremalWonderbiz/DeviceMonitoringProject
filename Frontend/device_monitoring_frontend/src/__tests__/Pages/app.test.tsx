import React from "react";
import { render, screen } from "@testing-library/react";
import App from "@/pages/_app";

jest.mock("rsuite", () => ({
    CustomProvider: ({ children, ...rest }: any) => (
        <div data-testid="rsuite-provider" {...rest}>
            {children}
        </div>
    ),
}));

jest.mock("@/components/ui/provider", () => ({
    Provider: ({ children }: any) => <div data-testid="app-provider">{children}</div>,
}));

// minimal mock router to satisfy Next.js _app props
const mockRouter = {
    pathname: "/",
    route: "/",
    asPath: "/",
    query: {},
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    beforePopState: jest.fn(),
    events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
    isFallback: false,
} as any;

describe("App", () => {
    it("renders the page component and passes pageProps", () => {
        const Page = ({ text }: any) => <div>{text}</div>;
        render(<App Component={Page} pageProps={{ text: "hello world" }} router={mockRouter} />);
        expect(screen.getByText("hello world")).toBeTruthy();
    });

    it("wraps the page with CustomProvider and Provider (correct nesting)", () => {
        const Page = () => <div>inner</div>;
        render(<App Component={Page} pageProps={{}} router={mockRouter} />);
        const rsuite = screen.getByTestId("rsuite-provider");
        const appProvider = screen.getByTestId("app-provider");
        expect(rsuite).toBeTruthy();
        expect(appProvider).toBeTruthy();
        expect(rsuite.contains(appProvider)).toBe(true);
    });
});
