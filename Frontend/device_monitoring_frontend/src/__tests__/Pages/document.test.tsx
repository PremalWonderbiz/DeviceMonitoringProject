import Document from "@/pages/_document";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

jest.mock("next/document", () => {
    return {
        Html: ({ children, ...props }: any) =>
            React.createElement("html", props, children),
        Head: ({ children }: any) => React.createElement("head", null, children),
        Main: () =>
            React.createElement("div", { "data-testid": "main" }, "MAIN_PLACEHOLDER"),
        NextScript: () =>
            React.createElement(
                "script",
                { "data-testid": "next-script" },
                "NEXT_SCRIPT"
            ),
    };
});


describe("Document", () => {
    it("renders an html element with lang=\"en\"", () => {
        const html = renderToStaticMarkup(<Document />);
        expect(html).toContain('<html lang="en"');
    });

    it("includes Head, Main and NextScript output", () => {
        const html = renderToStaticMarkup(<Document />);
        expect(html).toContain("<head");
        expect(html).toContain("MAIN_PLACEHOLDER");
        expect(html).toContain("NEXT_SCRIPT");
    });
});