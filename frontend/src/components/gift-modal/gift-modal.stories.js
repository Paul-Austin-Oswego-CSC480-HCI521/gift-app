import { html } from "lit";
import { expect, userEvent, waitFor } from "storybook/test";
import { nativeInput } from "../../../stories/helpers/shadow.js";
import "./gift-modal.js";

// One story per modal type; `type` selects which modal gift-modal renders. Add a story here
// whenever a new type is added to MODALS in gift-modal.js.
export default {
  title: "Custom Components/Modal",
  component: "gift-modal",
  parameters: {
    layout: "fullscreen",
  },
};

// Carbon's cds-radio-button renders aria-readonly="false" on its inner <input type="radio">
// (radio-button.js in @carbon/web-components), which axe's aria-allowed-attr rule rejects.
// It is Carbon's own markup, always "false" here, and can't be changed from outside the shadow
// root, so only that rule is disabled, only on stories that contain the radio group.
const carbonRadioAriaReadonly = {
  a11y: { config: { rules: [{ id: "aria-allowed-attr", enabled: false }] } },
};

export const Default = {
  render: () => html`<gift-modal type="add-gift" open></gift-modal>`,
  parameters: carbonRadioAriaReadonly,
};

// Waits for gift-modal and the Carbon elements it rendered, then returns the pieces a user touches.
const renderedModal = async (canvasElement) => {
  const host = canvasElement.querySelector("gift-modal");
  await host.updateComplete;
  const root = host.shadowRoot;
  await Promise.all([...root.querySelectorAll("*")].map((el) => el.updateComplete));
  return {
    host,
    dialog: root.querySelector("cds-modal"),
    named: (name) => root.querySelector(`[name="${name}"]`),
  };
};

export const CloseWithX = {
  render: Default.render,
  parameters: carbonRadioAriaReadonly,
  play: async ({ canvasElement, step }) => {
    const { host, dialog } = await renderedModal(canvasElement);
    await step("Modal starts open", async () => {
      expect(host.open).toBe(true);
      expect(dialog.open).toBe(true);
    });
    await step("Click the X button", async () => {
      const closeButton = dialog.querySelector("cds-modal-close-button");
      await closeButton.updateComplete;
      await userEvent.click(closeButton);
    });
    await step("gift-modal sets open to false", async () => {
      await waitFor(() => expect(host.open).toBe(false));
      expect(dialog.open).toBe(false);
    });
  },
};

export const CloseWithEscape = {
  render: Default.render,
  parameters: carbonRadioAriaReadonly,
  play: async ({ canvasElement, step }) => {
    const { host } = await renderedModal(canvasElement);
    await step("Press Escape", async () => {
      await userEvent.keyboard("{Escape}");
    });
    await step("gift-modal sets open to false", async () => {
      await waitFor(() => expect(host.open).toBe(false));
    });
  },
};

export const FillInGift = {
  render: Default.render,
  parameters: carbonRadioAriaReadonly,
  play: async ({ canvasElement, step }) => {
    const { host, dialog, named } = await renderedModal(canvasElement);
    await step("Type a gift name", async () => {
      const field = await nativeInput(named("gift-name"));
      await userEvent.type(field, "Lego set");
      await waitFor(() => expect(field).toHaveValue("Lego set"));
    });
    await step("Choose a recipient", async () => {
      const dropdown = named("person-id");
      await userEvent.click(dropdown.shadowRoot.querySelector("[part='trigger-button']") ?? dropdown);
      const item = dropdown.querySelector("cds-dropdown-item");
      await waitFor(() => expect(dropdown.open).toBe(true));
      await userEvent.click(item);
      await waitFor(() => expect(dropdown.value).toBe("example-person"));
    });
    await step("Switch status to Purchased", async () => {
      const radios = [...named("status").querySelectorAll("cds-radio-button")];
      const purchased = radios.find((radio) => radio.value === "purchased");
      await purchased.updateComplete;
      await userEvent.click(purchased);
      await waitFor(() => expect(named("status").value).toBe("purchased"));
    });
    await step("Modal stays open", async () => {
      expect(host.open).toBe(true);
      expect(dialog.open).toBe(true);
    });
  },
};
