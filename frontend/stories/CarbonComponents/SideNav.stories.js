import "@carbon/web-components/es/components/ui-shell/index.js";
import { html } from "lit";

// cds-side-nav / cds-side-nav-items / cds-side-nav-link are the Carbon primitives used
// for the left navigation in Layouts/Page Template. Documented here on their own so the
// brand retheme can be reviewed against them in isolation.
export default {
  title: "Carbon Components/Side Nav",
  render: ({ expanded }) => html`
    <cds-side-nav ?expanded=${expanded} collapse-mode="fixed" aria-label="Example side nav">
      <cds-side-nav-items>
        <cds-side-nav-link href="#" is-active>Lorem</cds-side-nav-link>
        <cds-side-nav-link href="#">Ipsum</cds-side-nav-link>
        <cds-side-nav-link href="#">Dolor</cds-side-nav-link>
      </cds-side-nav-items>
    </cds-side-nav>
  `,
  argTypes: {
    expanded: { control: "boolean" },
  },
  args: {
    expanded: true,
  },
};

export const Default = {};
