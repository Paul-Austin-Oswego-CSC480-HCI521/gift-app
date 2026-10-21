import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import "./gift-modal.js";

// jsdom has no ResizeObserver, which Carbon's modal body and dropdown items use.
beforeAll(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});

afterEach(() => {
  document.body.replaceChildren();
});

async function renderModal(attrs = "") {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `<gift-modal ${attrs}></gift-modal>`;
  document.body.append(wrapper);
  const modal = wrapper.querySelector("gift-modal");
  await modal.updateComplete;
  return modal;
}

describe("gift-modal", () => {
  it("defaults to the Add Gift modal, closed, with an accessible name", async () => {
    const modal = await renderModal();
    const dialog = modal.shadowRoot.querySelector("cds-modal");
    expect(modal.type).toBe("add-gift");
    expect(dialog.open).toBe(false);
    expect(dialog).toHaveAttribute("aria-label", "Add Gift");
    expect(modal.shadowRoot.querySelector("cds-modal-heading")).toHaveTextContent("Add Gift");
  });

  it("opens and closes through the open property", async () => {
    const modal = await renderModal("open");
    const dialog = modal.shadowRoot.querySelector("cds-modal");
    expect(dialog.open).toBe(true);
    dialog.dispatchEvent(new CustomEvent("cds-modal-closed", { bubbles: true }));
    await modal.updateComplete;
    expect(modal.open).toBe(false);
  });

  it("renders labelled Add Gift fields", async () => {
    const modal = await renderModal('type="add-gift"');
    const labels = [...modal.shadowRoot.querySelectorAll("cds-text-input")].map((input) => input.label);
    expect(labels).toEqual(["Gift Name", "Gift Link", "Quantity", "Occasion"]);
    expect(modal.shadowRoot.querySelector("cds-dropdown")).toHaveAttribute(
      "title-text",
      "Who is this gift for?"
    );
    expect(modal.shadowRoot.querySelector("cds-radio-button-group")).toHaveAttribute(
      "legend-text",
      "Set Status"
    );
  });

  it("falls back to Add Gift for an unknown type", async () => {
    const modal = await renderModal('type="nope"');
    expect(modal.shadowRoot.querySelector("cds-modal-heading")).toHaveTextContent("Add Gift");
  });
});
