import { describe, expect, it } from "vitest";
import { within } from "@testing-library/dom";
import "./gift-brand.js";

describe("gift-brand", () => {
  it("renders the app name and a decorative logo", async () => {
    const el = document.createElement("gift-brand");
    document.body.append(el);
    await el.updateComplete;

    expect(within(el.shadowRoot).getByText("Gift App")).toBeInTheDocument();
    expect(el.shadowRoot.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});
