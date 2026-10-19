import { describe, expect, it } from "vitest";
import "./gift-image-container.js";

async function renderImageContainer(innerHtml = "") {
  const el = document.createElement("div");
  el.innerHTML = `<gift-image-container>${innerHtml}</gift-image-container>`;
  document.body.append(el);
  const container = el.querySelector("gift-image-container");
  await container.updateComplete;
  return container;
}

describe("gift-image-container", () => {
  it("renders an empty <main> when given no content", async () => {
    const container = await renderImageContainer();

    const main = container.shadowRoot.querySelector("main");
    expect(main).not.toBeNull();
    expect(main.querySelector("slot").assignedNodes()).toHaveLength(0);
  });

  it("projects page content through the default slot", async () => {
    const container = await renderImageContainer("<h1>Page content</h1>");

    const slot = container.shadowRoot.querySelector("slot");
    const [assigned] = slot.assignedElements();
    expect(assigned.tagName).toBe("H1");
    expect(assigned.textContent).toBe("Page content");
  });
});
