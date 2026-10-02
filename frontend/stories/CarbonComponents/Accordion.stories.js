import "@carbon/web-components/es/components/accordion/index.js";
import { html } from "lit";

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

export const Default = {};
