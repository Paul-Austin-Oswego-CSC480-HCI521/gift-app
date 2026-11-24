import { html } from "lit";
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

  it("renders caller-supplied fields and hands submission back to the caller", async () => {
    const modal = await renderModal('type="custom" open heading="Add Person" submit-label="Save Person"');
    modal.fields = html`<cds-text-input name="full-name" label="Full Name"></cds-text-input>`;
    await modal.updateComplete;

    const root = modal.shadowRoot;
    const form = root.querySelector("form");
    expect(root.querySelector("cds-modal")).toHaveAttribute("aria-label", "Add Person");
    expect(root.querySelector("cds-modal-heading")).toHaveTextContent("Add Person");
    const submitButton = root.querySelector("cds-button");
    const nameInput = form.querySelector("cds-text-input");
    expect(submitButton).toHaveTextContent("Save Person");
    expect(nameInput).toHaveAttribute("name", "full-name");
    expect(form.querySelector('[name="gift-name"]')).toBeNull();

    const onSubmit = vi.fn();
    modal.parentElement.addEventListener("item-submit", onSubmit);

    submitButton.click();
    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit.mock.calls[0][0].detail.form).toBe(form);

    nameInput.dispatchEvent(new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
    }));
    expect(onSubmit).toHaveBeenCalledTimes(2);
    expect(modal.open).toBe(true);
  });

  it("falls back to Add Gift for an unknown type", async () => {
    const modal = await renderModal('type="nope"');
    expect(modal.shadowRoot.querySelector("cds-modal-heading")).toHaveTextContent("Add Gift");
  });
});
