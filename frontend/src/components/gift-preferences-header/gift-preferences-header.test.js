import { expect, it } from "vitest";
import "./gift-preferences-header.js";

it("identifies sample preferences and exposes color names without relying on color alone", async () => {
  const host = document.createElement("gift-preferences-header");
  document.body.append(host);
  try {
    await host.updateComplete;
    expect(host.shadowRoot.querySelector('[role="img"]').getAttribute("aria-label")).toContain("red, green, teal, blue, and yellow");
    expect(host.shadowRoot.textContent).toContain("not saved account information");
    expect(host.shadowRoot.querySelectorAll("h3")).toHaveLength(4);
  } finally { host.remove(); }
});
