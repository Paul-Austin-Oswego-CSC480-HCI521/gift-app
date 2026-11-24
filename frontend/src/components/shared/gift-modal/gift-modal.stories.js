import { html } from "lit";
import Add16 from "@carbon/icons/es/add/16.js";
import { iconLoader } from "@carbon/web-components/es/globals/internal/icon-loader.js";
import "@carbon/web-components/es/components/date-picker/index.js";
import "@carbon/web-components/es/components/link/index.js";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { nativeInput } from "../../../../stories/helpers/shadow.js";
import "./gift-modal.js";

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
// Happo's "accessibility" target runs its own axe pass and ignores the a11y config above (it has
// no per-rule setting), so these stories skip that target and keep the visual one. The Storybook
// test runner still checks every other axe rule on them.
const carbonRadioAriaReadonly = {
  a11y: { config: { rules: [{ id: "aria-allowed-attr", enabled: false }] } },
  happo: { targets: ["chrome-large"] },
};

export const Default = {
  render: () => html`<gift-modal type="add-gift" open></gift-modal>`,
  parameters: carbonRadioAriaReadonly,
};

// Waits for gift-modal and the Carbon elements it rendered, then returns the pieces a user touches.
const renderedModal = async (canvasElement) => {
  const host = canvasElement.querySelector("gift-modal") || canvasElement.querySelector("gift-modal");
  if (!host) {
    throw new Error("Modal host element not found in canvas");
  }
  await host.updateComplete;

  const root = host.shadowRoot;
  if (!root) {
    return { host, dialog: null, named: () => null };
  }

  const allElements = [...root.querySelectorAll("*")];
  await Promise.all(allElements.map((el) => el.updateComplete ?? Promise.resolve()));

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
  render: () => html`
    <gift-modal
      open
      .people=${[{ id: "example-person", fullName: "Example Recipient" }]}
    ></gift-modal>
  `,
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

export const AddGiftMockup = {
  parameters: carbonRadioAriaReadonly,
  render: () => html`
    <gift-modal
      type="custom"
      heading="Add Gift"
      submit-label="Add gift"
      open
      .fields=${html`
        <cds-dropdown data-testid="gift-modal-mockup-list" name="list" title-text="Choose a list" label="Choose a list" size="sm">
          <cds-dropdown-item value="holiday">Holiday gifts</cds-dropdown-item>
        </cds-dropdown>
        <cds-link data-testid="gift-modal-mockup-create-list" href="#create-list" size="sm">
          Create a list ${iconLoader(Add16, { slot: "icon", "aria-hidden": "true" })}
        </cds-link>
        <cds-text-input data-testid="gift-modal-mockup-name" name="gift-name" label="Gift Name" placeholder="Add Name" size="sm"></cds-text-input>
        <cds-text-input data-testid="gift-modal-mockup-link" name="product-link" label="Product Link" placeholder="Insert link" size="sm" type="url"></cds-text-input>
        <cds-dropdown data-testid="gift-modal-mockup-recipient" name="recipient" title-text="Recipient" label="Choose recipient" size="sm">
          <cds-dropdown-item value="sam">Sam Rivera</cds-dropdown-item>
        </cds-dropdown>
        <cds-dropdown data-testid="gift-modal-mockup-occasion" name="occasion" title-text="Occasion" label="Choose Occasion" size="sm">
          <cds-dropdown-item value="birthday">Birthday</cds-dropdown-item>
        </cds-dropdown>
        <cds-date-picker data-testid="gift-modal-mockup-date" name="date" allow-input>
          <cds-date-picker-input kind="single" label-text="Date" placeholder="mm/dd/yyyy" size="sm" is-fluid></cds-date-picker-input>
        </cds-date-picker>
        <cds-dropdown data-testid="gift-modal-mockup-reminder" name="reminder" title-text="Set a reminder" label="No Reminder" size="sm">
          <cds-dropdown-item value="none">No Reminder</cds-dropdown-item>
          <cds-dropdown-item value="week">One week before</cds-dropdown-item>
        </cds-dropdown>
        <cds-radio-button-group data-testid="gift-modal-mockup-status" name="status" legend-text="Select a status" orientation="vertical" label-position="right">
          <cds-radio-button value="need-to-buy" label-text="Need to buy"></cds-radio-button>
          <cds-radio-button value="purchased" label-text="Purchased"></cds-radio-button>
        </cds-radio-button-group>
      `}
    ></gift-modal>
  `,
};

export const SubmitCustomForm = {
  args: { onItemSubmit: fn() },
  argTypes: { onItemSubmit: { table: { disable: true } } },
  render: ({ onItemSubmit }) => html`
    <gift-modal
      type="custom"
      heading="Add Person"
      submit-label="Save Person"
      open
      @item-submit=${onItemSubmit}
      .fields=${html`
        <cds-text-input
          data-testid="gift-modal-custom-name-input"
          data-modal-primary-focus
          name="full-name"
          label="Full Name"
        ></cds-text-input>
      `}
    ></gift-modal>
  `,
  play: async ({ args, canvasElement, step }) => {
    const { host, named } = await renderedModal(canvasElement);
    const name = named("full-name");

    await step("Fill in the supplied field", async () => {
      await userEvent.type(await nativeInput(name), "Sam Rivera");
    });

    await step("Submit the custom form", async () => {
      await userEvent.click(host.shadowRoot.querySelector("cds-button"));
      await waitFor(() => expect(args.onItemSubmit).toHaveBeenCalledTimes(1));
      const [{ detail }] = args.onItemSubmit.mock.calls[0];
      expect(detail.form.contains(name)).toBe(true);
      expect(name.value).toBe("Sam Rivera");
      expect(host.open).toBe(true);
    });
  },
};
