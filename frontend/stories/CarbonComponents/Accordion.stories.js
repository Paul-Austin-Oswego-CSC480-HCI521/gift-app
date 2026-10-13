import "@carbon/web-components/es/components/accordion/index.js";
import { html } from "lit";
import { expect, userEvent, waitFor } from "storybook/test";

export default {
  title: "Carbon Components/Accordion",
  render: () => html`
    <cds-accordion>
      <cds-accordion-item title="Lorem ipsum dolor sit amet">
        <p>Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
      </cds-accordion-item>
      <cds-accordion-item title="Ut enim ad minim veniam">
        <p>Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.</p>
      </cds-accordion-item>
    </cds-accordion>
  `,
};

export const Default = {
  play: async ({ canvasElement, step }) => {
    const [first, second] = canvasElement.querySelectorAll("cds-accordion-item");
    await Promise.all([first.updateComplete, second.updateComplete]);
    const toggle = (item) => userEvent.click(item.shadowRoot.querySelector("button"));

    await step("Items start closed", async () => {
      expect(first.open).toBe(false);
      expect(second.open).toBe(false);
    });
    await step("Opening an item reveals it", async () => {
      await toggle(first);
      await waitFor(() => expect(first.open).toBe(true));
    });
    await step("Items open independently", async () => {
      await toggle(second);
      await waitFor(() => expect(second.open).toBe(true));
      expect(first.open).toBe(true);
    });
    await step("Closing an item collapses it", async () => {
      await toggle(first);
      await waitFor(() => expect(first.open).toBe(false));
      expect(second.open).toBe(true);
    });
  },
};
