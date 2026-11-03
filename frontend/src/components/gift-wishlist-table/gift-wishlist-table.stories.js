import { html } from "lit";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { renderedForm, typeInto } from "../../../stories/helpers/shadow.js";
import { wishlistItems as sampleItems } from "../../mocks/wishlist.js";
import "./gift-wishlist-table.js";

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

export const Filter = {
  play: async ({ canvasElement, step }) => {
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
  },
};
