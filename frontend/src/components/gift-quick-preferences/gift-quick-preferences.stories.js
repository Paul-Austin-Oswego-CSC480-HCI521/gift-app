import { html } from "lit";
import { expect, fn, userEvent } from "storybook/test";
import "./gift-quick-preferences.js";

export default {
  title: "Custom Components/Quick Preferences",
};

export const Default = {
  render: () => html`
    <gift-quick-preferences></gift-quick-preferences>
  `,
};

export const SavePreferences = {
  args: { onSave: fn() },
  argTypes: { onSave: { table: { disable: true } } },
  render: ({ onSave }) => html`<gift-quick-preferences @preferences-save=${onSave}></gift-quick-preferences>`,
  play: async ({ canvasElement, args, step }) => {
    const page = canvasElement.querySelector("gift-quick-preferences");
    await page.updateComplete;
    const color = page.shadowRoot.querySelector("cds-text-input");
    const save = page.shadowRoot.querySelector("cds-button");
    await Promise.all([color.updateComplete, save.updateComplete]);
    await step("Enter a favorite color and save", async () => {
      await userEvent.type(color.shadowRoot.querySelector("input"), "Teal");
      await userEvent.click(save.shadowRoot.querySelector("button"));
      expect(args.onSave).toHaveBeenCalledWith(
        expect.objectContaining({ detail: expect.objectContaining({ "favorite-color": "Teal" }) })
      );
    });
  },
};
