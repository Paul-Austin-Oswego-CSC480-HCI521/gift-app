import "@carbon/web-components/es/components/ui-shell/index.js";
import { html } from "lit";

// cds-header-nav / cds-header-nav-item are the Carbon primitives that gift-nav-header
// (see Custom Components/Nav Header) projects into its default slot. Documented here on
// their own, wrapped in a bare cds-header since Carbon requires that shell for correct
// layout and accessibility semantics.
export default {
  title: "Carbon Components/Header Nav",
  render: ({ menuBarLabel }) => html`
    <cds-header aria-label="Header nav example">
      <cds-header-name href="/" prefix="">Carbon</cds-header-name>
      <cds-header-nav menu-bar-label=${menuBarLabel}>
        <cds-header-nav-item href="/" is-active>Lorem</cds-header-nav-item>
        <cds-header-nav-item href="/ipsum">Ipsum</cds-header-nav-item>
        <cds-header-nav-item href="/dolor">Dolor</cds-header-nav-item>
      </cds-header-nav>
    </cds-header>
  `,
  argTypes: {
    menuBarLabel: { control: "text" },
  },
  args: {
    menuBarLabel: "Example navigation",
  },
};

export const Default = {};
