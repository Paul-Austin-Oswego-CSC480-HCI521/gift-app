import { describe, expect, it } from "vitest";
import "./gift-gradient-container.js";

async function renderGradientContainer(innerHtml = "") {
  const el = document.createElement("div");
  el.innerHTML = `<gift-gradient-container>${innerHtml}</gift-gradient-container>`;
  document.body.append(el);
  const container = el.querySelector("gift-gradient-container");
  await container.updateComplete;
  return container;
}

describe("gift-gradient-container", () => {
  it("renders an empty <main> when given no content", async () => {
    const container = await renderGradientContainer();

    const main = container.shadowRoot.querySelector("main");
    expect(main).not.toBeNull();
    expect(main.querySelector("slot").assignedNodes()).toHaveLength(0);
  });

  it("projects page content through the default slot", async () => {
    const container = await renderGradientContainer("<h1>Page content</h1>");

    const slot = container.shadowRoot.querySelector("slot");
    const [assigned] = slot.assignedElements();
    expect(assigned.tagName).toBe("H1");
    expect(assigned.textContent).toBe("Page content");
  });
});
