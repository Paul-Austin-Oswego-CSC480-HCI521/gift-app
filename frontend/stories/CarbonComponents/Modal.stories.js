import "@carbon/web-components/es/components/modal/index.js";
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/button/index.js";
import { html } from "lit";
import { expect, userEvent, waitFor } from "storybook/test";
import { nativeInput } from "../helpers/shadow.js";
import "../../src/styles/brand-theme.css";
import "../../src/styles/carbon-page-layout.css";

// Add Gift / Add Recipient pop-ups (Gifts 2 - pop up 1323:2392, Recipient pop up 1323:6717).
// Card on --cds-background with --radius-large corners, a 32/40 title, labelled inputs and one
// primary button. Colours in those frames are stale Carbon grays, so tokens come from the
// brand theme instead. `open` is forced so the modal renders in the canvas.
const addIcon = html`<svg slot="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" width="16" height="16"><path d="M17 15 17 8 15 8 15 15 8 15 8 17 15 17 15 24 17 24 17 17 24 17 24 15z"/></svg>`;

const modal = ({ title, fields, action }) => html`
  <cds-modal class="gift-modal" open aria-label=${title}>
    <cds-modal-header>
      <cds-modal-close-button></cds-modal-close-button>
      <cds-modal-heading>${title}</cds-modal-heading>
    </cds-modal-header>
    <cds-modal-body>
      <div class="gift-modal__form">
        ${fields.map(
          ([label, placeholder]) => html`<cds-text-input size="lg" label=${label} placeholder=${placeholder}></cds-text-input>`
        )}
        <cds-button kind="primary">${action}${addIcon}</cds-button>
      </div>
    </cds-modal-body>
  </cds-modal>
`;

export default { title: "Carbon Components/Modal", parameters: { layout: "fullscreen" } };

const fillAndClose = async ({ canvasElement, step }, values) => {
  const modalEl = canvasElement.querySelector("cds-modal");
  const inputs = [...canvasElement.querySelectorAll("cds-text-input")];
  await step("Type into every field", async () => {
    for (const [i, input] of inputs.entries()) {
      const field = await nativeInput(input);
      await userEvent.type(field, values[i]);
      await waitFor(() => expect(field).toHaveValue(values[i]));
    }
  });
  await step("Close with the X button", async () => {
    expect(modalEl.open).toBe(true);
    const closeButton = canvasElement.querySelector("cds-modal-close-button");
    await closeButton.updateComplete;
    await userEvent.click(closeButton);
    await waitFor(() => expect(modalEl.open).toBe(false));
  });
};

export const AddGift = {
  render: () =>
    modal({
      title: "Add Gift",
      fields: [["Gift 1", "Gift, gift, gift..."], ["Gift 2", "Gift, gift, gift..."], ["Gift 3", "Gift, gift, gift..."]],
      action: "Input Gift",
    }),
  play: (ctx) => fillAndClose(ctx, ["Lego set", "Scarf", "Book"]),
};

export const AddRecipient = {
  render: () =>
    modal({
      title: "Add Recipient",
      fields: [["Full Name", "Jane Cooper"], ["Email", "Jane@gmail.com"], ["Phone Number", "123-456-7890"]],
      action: "Input Recipient",
    }),
  play: (ctx) => fillAndClose(ctx, ["Jane Cooper", "jane@example.com", "123-456-7890"]),
};
