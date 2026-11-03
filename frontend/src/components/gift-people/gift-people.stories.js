import { html } from "lit";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { renderedForm, typeInto } from "../../../stories/helpers/shadow.js";
import { people } from "../../mocks/people.js";
import "./gift-people.js";

export default {
  title: "Custom Components/People",
  render: ({ people, onAddPerson }) =>
    html`<gift-people .people=${people} @add-person=${onAddPerson}></gift-people>`,
  args: { people, onAddPerson: fn() },
  argTypes: { onAddPerson: { table: { disable: true } } },
};

export const Default = {};

const tileNames = (root) =>
  [...root.querySelectorAll("gift-tile[type='person']")].map((tile) => tile.textContent.trim());

export const Search = {
  play: async ({ canvasElement, step }) => {
    const { root } = await renderedForm(canvasElement, "gift-people");
    await step("Search limits the people shown", async () => {
      await typeInto(root.querySelector("cds-search"), "river");
      await waitFor(() => expect(tileNames(root)).toEqual(["River Stone"]));
    });
    await step("A search with no match shows the info message", async () => {
      const input = root.querySelector("cds-search").shadowRoot.querySelector("input");
      await userEvent.type(input, "zzz");
      await waitFor(() => expect(root.querySelector(".message").textContent).toContain("No matching people"));
    });
  },
};

export const AddPerson = {
  play: async ({ canvasElement, args, step }) => {
    const { host, root } = await renderedForm(canvasElement, "gift-people");
    await step("Add Person opens the form", async () => {
      const add = root.querySelector(".toolbar cds-button");
      await add.updateComplete;
      await userEvent.click(add.shadowRoot.querySelector("button"));
      await waitFor(() => expect(root.querySelector("form")).not.toBeNull());
      await host.updateComplete;
    });
    await step("Saving without a name shows an error and emits nothing", async () => {
      const save = root.querySelector('cds-button[type="submit"]');
      await save.updateComplete;
      await userEvent.click(save.shadowRoot.querySelector("button"));
      await waitFor(() => expect(root.querySelector("cds-inline-notification")).not.toBeNull());
      expect(args.onAddPerson).not.toHaveBeenCalled();
    });
    await step("Saving a name emits add-person", async () => {
      await typeInto(root.querySelector('[name="firstName"]'), "Ada");
      await typeInto(root.querySelector('[name="lastName"]'), "Lovelace");
      const save = root.querySelector('cds-button[type="submit"]');
      await userEvent.click(save.shadowRoot.querySelector("button"));
      await waitFor(() => expect(args.onAddPerson).toHaveBeenCalledTimes(1));
      expect(args.onAddPerson.mock.calls[0][0].detail).toEqual({ firstName: "Ada", lastName: "Lovelace" });
    });
  },
};
