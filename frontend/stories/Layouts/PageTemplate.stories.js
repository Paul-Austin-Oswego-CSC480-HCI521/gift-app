import { html } from "lit";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/link/index.js";
import "@carbon/web-components/es/components/ui-shell/index.js";
import "../../src/components/gift-nav-header/gift-nav-header.js";
import "../../src/components/gift-site-footer/gift-site-footer.js";
import "../../src/components/gift-gradient-container/gift-gradient-container.js";
import "../../src/styles/brand-theme.css";

// Compiles the Carbon components already used in production (header nav, buttons,
// links, gradient container, footer) into one page-shaped preview so the brand
// retheme (brand-theme.css) can be reviewed across all of them at once, rather
// than as a disconnected swatch sheet. Copy below is placeholder lorem ipsum only.
export default {
  title: "Layouts/Page Template",
  render: () => html`
    <div data-carbon-theme="brand" class="no-scrolling">
      <gift-nav-header product-name="Gift App">
        <cds-header-nav menu-bar-label="Gift App navigation">
          <cds-header-nav-item href="/" is-active>Lorem</cds-header-nav-item>
          <cds-header-nav-item href="/ipsum">Ipsum</cds-header-nav-item>
          <cds-header-nav-item href="/dolor">Dolor</cds-header-nav-item>
        </cds-header-nav>
      </gift-nav-header>

      <gift-gradient-container>
        <div style="padding: 0 2rem; display: flex; flex-direction: column; gap: 1rem;">
          <h1 style="margin: 0;">Lorem ipsum dolor sit amet</h1>
          <p style="margin: 0; max-width: 40em;">
            Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua. Ut enim ad minim veniam.
          </p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <cds-button kind="primary">Primary action</cds-button>
            <cds-button kind="secondary">Secondary action</cds-button>
            <cds-button kind="tertiary">Tertiary action</cds-button>
          </div>
        </div>
      </gift-gradient-container>

      <main style="display: flex; flex: 1; flex-direction: column; gap: 2rem; align-items: flex-start; align-self: stretch; padding: 2rem; background: var(--cds-background); box-sizing: border-box;">
        <section style="display: flex; flex-direction: column; gap: 0.75rem;">
          <h2 style="margin: 0; color: var(--cds-text-primary);">Ut enim ad minim veniam</h2>
          <p style="margin: 0; max-width: 40em; color: var(--cds-text-secondary);">
            Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat. Duis aute irure dolor in reprehenderit.
          </p>
          <p style="margin: 0; color: var(--cds-text-helper);">
            Helper text: excepteur sint occaecat cupidatat non proident.
          </p>
        </section>

        <section style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <cds-button kind="primary">Confirm lorem</cds-button>
          <cds-button kind="secondary">Cancel ipsum</cds-button>
          <cds-button kind="danger">Delete dolor</cds-button>
          <cds-button kind="ghost">Ghost sit</cds-button>
          <cds-button kind="primary" disabled>Disabled amet</cds-button>
        </section>

        <section style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
          <cds-link href="#">Lorem ipsum link</cds-link>
          <cds-link href="#">Dolor sit link</cds-link>
          <cds-link href="#" disabled>Disabled consectetur link</cds-link>
        </section>
      </main>

      <gift-site-footer></gift-site-footer>
    </div>
  `,
};

export const Default = {};
