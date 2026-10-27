import { html } from "lit";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { renderedForm, typeInto } from "../../../stories/helpers/shadow.js";
import "./gift-wishlist-table.js";

const names = ["Marvel Dice Throne Battle Chest", "Project L", "We Didn't Playtest This at All", "Picky Eaters", "Dutz Blitz", "Betrayal at the House on the Hill", "Skull King", "Cascadia", "Azul"];
const sampleItems = names.map((giftName, index) => ({
  id: index + 1, giftName, value: "25.00", priority: index % 2 ? "Low" : "High",
  status: index % 3 ? "Wanted" : "Received", added: "2026-10-27",
}));
export default {
  title: "Custom Components/Wishlist Table",
  render: ({ items, onSave }) => html`<gift-wishlist-table .items=${items} @wishlist-save=${onSave}></gift-wishlist-table>`,
  args: { items: sampleItems, onSave: fn() },
  argTypes: { onSave: { table: { disable: true } } },
};
export const Default = {};
export const SearchAndPagination = {
  play: async ({ canvasElement, step }) => {
    const { host, root } = await renderedForm(canvasElement, "gift-wishlist-table");
    await step("Search limits the rows", async () => {
      await typeInto(root.querySelector("cds-search"), "Skull");
      await waitFor(() => expect(root.querySelectorAll("cds-table-row")).toHaveLength(1));
      expect(root.querySelector("cds-table-row").textContent).toContain("Skull King");
    });
    await step("Clearing search restores the first seven rows", async () => {
      const search = root.querySelector("cds-search");
      await userEvent.click(search.shadowRoot.querySelector("input"));
      await userEvent.keyboard("{Control>}a{/Control}{Backspace}");
      await waitFor(() => expect(root.querySelectorAll("cds-table-row")).toHaveLength(7));
      const pagination = root.querySelector("cds-pagination");
      await pagination.updateComplete;
      const next = [...pagination.shadowRoot.querySelectorAll("cds-button")].at(-1);
      await next.updateComplete;
      await userEvent.click(next.shadowRoot.querySelector("button"));
      await waitFor(() => expect(root.querySelectorAll("cds-table-row")).toHaveLength(2));
      expect(host._page).toBe(2);
    });
  },
};
export const AddItem = {
  play: async ({ canvasElement, args, step }) => {
    const { host, root } = await renderedForm(canvasElement, "gift-wishlist-table");
    await step("Open the editor and enter an item and price", async () => {
      const add = root.querySelector(".toolbar > cds-button");
      await add.updateComplete;
      await userEvent.click(add.shadowRoot.querySelector("button"));
      await host.updateComplete;
      await typeInto(root.querySelector('[name="giftName"]'), "New board game");
      await typeInto(root.querySelector('[name="value"]'), "29.99");
    });
    await step("Save emits the item without directly calling an API", async () => {
      const save = root.querySelector("cds-modal-footer cds-button:last-child");
      await save.updateComplete;
      await userEvent.click(save.shadowRoot.querySelector("button"));
      await waitFor(() => expect(args.onSave).toHaveBeenCalledTimes(1));
      expect(args.onSave.mock.calls[0][0].detail).toMatchObject({ giftName: "New board game", value: "29.99" });
      host.closeEditor();
    });
  },
};

export const FilterAndEdit = {
  play: async ({ canvasElement, args, step }) => {
    const { host, root } = await renderedForm(canvasElement, "gift-wishlist-table");
    const click = async element => { await element.updateComplete; await userEvent.click(element.shadowRoot.querySelector("button")); };
    await step("Apply a priority filter", async () => {
      await click(root.querySelector("#filter-toggle"));
      await host.updateComplete;
      const high = [...root.querySelectorAll("cds-checkbox")].find(el => el.labelText === "High");
      await high.updateComplete;
      await userEvent.click(high.shadowRoot.querySelector("input"));
      await click(root.querySelector(".actions cds-button:last-child"));
      await waitFor(() => expect(root.querySelectorAll("cds-table-row")).toHaveLength(5));
    });
    await step("Edit an existing item", async () => {
      await click(root.querySelector("cds-table-row cds-button"));
      await host.updateComplete;
      const input = root.querySelector('[name="value"]');
      await input.updateComplete;
      await userEvent.click(input.shadowRoot.querySelector("input"));
      await userEvent.keyboard("{Control>}a{/Control}35.00");
      await click(root.querySelector("cds-modal-footer cds-button:last-child"));
      await waitFor(() => expect(args.onSave).toHaveBeenCalledTimes(1));
      expect(args.onSave.mock.calls[0][0].detail).toMatchObject({ id: 1, value: "35.00" });
      host.closeEditor();
    });
  },
};
