import { describe, expect, it } from "vitest";
import { within } from "@testing-library/dom";
import "./gift-nav-header.js";

async function renderNavHeader(attrs = "", innerHtml = "") {
  const el = document.createElement("div");
  el.innerHTML = `<gift-nav-header ${attrs}>${innerHtml}</gift-nav-header>`;
  document.body.append(el);
  const header = el.querySelector("gift-nav-header");
  await header.updateComplete;
  return header;
}

describe("gift-nav-header", () => {
  it("defaults to the 'Gift App' product name", async () => {
    const header = await renderNavHeader();

    const name = within(header.shadowRoot).getByText("Gift App");
    expect(name).toBeInTheDocument();
  });

  it("renders the product-name attribute instead of the default", async () => {
    const header = await renderNavHeader('product-name="Test App"');

    expect(within(header.shadowRoot).getByText("Test App")).toBeInTheDocument();
    expect(within(header.shadowRoot).queryByText("Gift App")).not.toBeInTheDocument();
  });

  it("projects slotted content through the default slot", async () => {
    const header = await renderNavHeader("", '<span id="nav-link">Gifts</span>');

    const slot = header.shadowRoot.querySelector("slot");
    const assigned = slot.assignedElements();
    expect(assigned).toHaveLength(1);
    expect(assigned[0].id).toBe("nav-link");
  });
});
