import { html } from "lit";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { renderedForm } from "../../../stories/helpers/shadow.js";
import { preferences } from "../../mocks/preferences.js";
import "./gift-full-preferences.js";
export default {
  title: "Custom Components/Full Preferences",
  args: { values: preferences, onSave: fn(), loading: false, saving: false, loadFailed: false, error: "" },
  argTypes: { onSave: { table: { disable: true } } },
  render: args => html`<gift-full-preferences .values=${args.values} ?loading=${args.loading} ?saving=${args.saving} .loadFailed=${args.loadFailed} .error=${args.error} @preferences-save=${args.onSave}></gift-full-preferences>`,
};
export const Default = {};
export const Loading = { args: { loading: true } };
export const LoadError = { args: { loadFailed: true, error: "Check your connection and retry." } };
export const Saving = { args: { saving: true } };
export const EditAndSave = {
  play: async ({ canvasElement, args, step }) => {
    const { host, root } = await renderedForm(canvasElement, "gift-full-preferences");
    await step("Change multiple colors", async () => {
      const colors = root.querySelector("cds-multi-select");
      await userEvent.click(colors.shadowRoot.querySelector('[role="combobox"]'));
      await userEvent.click(colors.querySelector('[value="Red"]'));
      await waitFor(() => expect(host.values["Favorite Colors"]).toContain("Red"));
      await userEvent.keyboard("{Escape}");
    });
    await step("Edit a prefilled preference and save", async () => {
      const likes = root.querySelector('cds-textarea[label="Likes"]');
      await likes.updateComplete;
      await userEvent.click(likes.shadowRoot.querySelector("textarea"));
      await userEvent.keyboard("{Control>}a{/Control}{Backspace}");
      await userEvent.type(likes.shadowRoot.querySelector("textarea"), "Books and puzzles");
      await userEvent.click(root.querySelector("cds-button").shadowRoot.querySelector("button"));
      await waitFor(() => expect(args.onSave).toHaveBeenCalled());
      expect(host.values.Likes).toBe("Books and puzzles");
      expect(args.onSave.mock.calls.at(-1)[0].detail["Favorite Colors"]).toEqual(expect.arrayContaining(["Green", "Blue", "Red"]));
    });
  },
};
