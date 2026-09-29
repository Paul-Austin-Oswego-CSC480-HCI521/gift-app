import { html } from "lit";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/link/index.js";
import "@carbon/web-components/es/components/ui-shell/index.js";
import "@carbon/web-components/es/components/notification/index.js";
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/checkbox/index.js";
import "@carbon/web-components/es/components/tag/index.js";
import "@carbon/web-components/es/components/tile/index.js";
import "@carbon/web-components/es/components/accordion/index.js";
import "../../src/components/gift-nav-header/gift-nav-header.js";
import "../../src/styles/brand-theme.css";
import "../../src/styles/brand-theme-dark.css";
import "../../src/styles/carbon-page-layout.css";

const THEMES = {
  light: { carbonClass: "cds--white", brandTheme: "brand" },
  dark: { carbonClass: "cds--g100", brandTheme: "brand-dark" },
};

// Backgrounds & layers group duplicated from Foundations/Colors so the reference
// accordion below stays a self-contained swatch sheet. Keep in sync with that file
// and with src/styles/brand-theme.css - it's a visual reference, not a source of truth.
const BACKGROUND_LAYER_TOKENS = [
  ["--cds-background", "#FCFBF4"],
  ["--cds-background-inverse", "Carbon default (#393939)"],
  ["--cds-layer-01", "#EAF5F0"],
  ["--cds-layer-02", "#F1F8F5"],
  ["--cds-field-01", "#F3F2ED"],
  ["--cds-field-02", "#F1F0EA"],
];

const tokenSwatch = ([token, value]) => html`
  <div class="token-swatch">
    <div class="token-swatch-color" style="background: var(${token});"></div>
    <code class="token-swatch-code">${token}</code>
    <span class="token-swatch-value">${value}</span>
  </div>
`;

// Mirrors this preview: (1) a real Carbon shell (header/side-nav/notification/text-input/
// checkbox/tag/tile/accordion) so the brand retheme can be reviewed in a page-shaped
// context, and (2) placeholder lorem-ipsum content everywhere except the disclaimer
// banner and the section labels called out in the sidenav, which use real words on
// purpose. See PR/issue discussion for the prototype this reproduces.
export default {
  title: "Layouts/Page Template",
  render: (_args, context) => {
    const { carbonClass, brandTheme } = THEMES[context.globals.theme] ?? THEMES.light;
    return html`
    <div data-carbon-theme="${brandTheme}" class="${carbonClass} no-scrolling">
      <gift-nav-header product-name="Gift App">
        <cds-header-nav menu-bar-label="Gift App navigation">
          <cds-header-nav-item href="/gifts" is-active>Gifts</cds-header-nav-item>
          <cds-header-nav-item href="/recipients">Recipients</cds-header-nav-item>
          <cds-header-nav-item href="/dates">Dates</cds-header-nav-item>
        </cds-header-nav>
        <div class="page-header-user">
          <span class="page-header-avatar">JD</span>
          <span class="page-header-username">Jane Doe</span>
        </div>
      </gift-nav-header>

      <div>
        <!-- cds-side-nav positions itself with position:fixed internally (Carbon's app-shell
             pattern: pinned nav, independently scrolling content), so it contributes no width
             to a flex layout here. main below is given a matching margin-inline-start instead
             of relying on flexbox to place them side by side. That also means cds-side-nav's
             own box isn't where you'd expect: its visible fixed-position panel is an internal
             shadow-DOM div with no exposed ::part, so a border on the <cds-side-nav> host
             itself lands on an invisible, uninvolved box. main's border-inline-start below
             (at the same x-position, since its margin-inline-start matches the panel's
             rendered width) is what actually draws at the seam. -->
        <cds-side-nav
          expanded
          collapse-mode="fixed"
          aria-label="Page sections"
        >
          <cds-side-nav-items>
            <cds-side-nav-link href="#upcoming">Upcoming</cds-side-nav-link>
            <cds-side-nav-link href="#quick-actions">Quick actions</cds-side-nav-link>
            <cds-side-nav-link href="#recently-added">Recently added</cds-side-nav-link>
            <cds-side-nav-link href="#gift-checklist">Gift checklist</cds-side-nav-link>
          </cds-side-nav-items>
          <div class="page-sidenav-panel">
            <cds-tile class="page-sidenav-tile">
              <span class="page-tile-label">Gift checklist</span>
              <span class="page-summary-value">3 still pending</span>
            </cds-tile>
          </div>
        </cds-side-nav>

        <main class="page-main">
          <cds-callout-notification kind="warning" low-contrast title="Concept only — not a real dashboard.">
            <span slot="subtitle">
              This page, its content, and its information architecture are made up, generated
              only to preview what Carbon Web Components could look like with our color scheme.
              Nothing here reflects final product decisions.
            </span>
          </cds-callout-notification>

          <section class="page-section">
            <h2 class="page-section-heading">Ut enim ad minim veniam</h2>
            <p class="page-section-body">
              Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </section>

          <section id="upcoming" class="page-section page-section--tight">
            <h3 class="page-section-heading">Upcoming</h3>
            <div class="page-tile-row">
              ${["Lorem ipsum", "Dolor sit amet", "Consectetur"].map(
                (label, i) => html`
                  <cds-tile class="page-tile">
                    <span class="page-tile-label">${label}</span>
                    <span class="page-tile-value">${(i + 1) * 2}</span>
                  </cds-tile>
                `
              )}
            </div>
          </section>

          <section id="quick-actions" class="page-section page-section--tight">
            <h3 class="page-section-heading">Quick actions</h3>
            <div class="page-actions-row">
              <cds-text-input label="Lorem ipsum" placeholder="Dolor sit amet"></cds-text-input>
              <cds-text-input label="Consectetur adipiscing" placeholder="Elit sed do"></cds-text-input>
              <cds-text-input label="Eiusmod tempor" placeholder="Incididunt ut"></cds-text-input>
              <cds-button kind="primary">Lorem ipsum action</cds-button>
            </div>
          </section>

          <section id="recently-added" class="page-section page-section--tight">
            <h3 class="page-section-heading">Recently added</h3>
            <table class="page-table">
              <thead>
                <tr>
                  <th>Lorem</th>
                  <th>Ipsum</th>
                  <th>Dolor</th>
                </tr>
              </thead>
              <tbody>
                ${[1, 2, 3].map(
                  (row) => html`
                    <tr>
                      <td>Sit amet ${row}</td>
                      <td>Consectetur ${row}</td>
                      <td>Adipiscing ${row}</td>
                    </tr>
                  `
                )}
              </tbody>
            </table>
          </section>

          <section id="gift-checklist" class="page-section page-section--loose">
            <h3 class="page-section-heading">Gift checklist</h3>
            <div class="page-checklist">
              <div class="page-checklist-group">
                <cds-tag type="gray">Pending lorem</cds-tag>
                <cds-checkbox label-text="Ipsum dolor sit amet"></cds-checkbox>
                <cds-checkbox label-text="Consectetur adipiscing elit"></cds-checkbox>
              </div>
              <div class="page-checklist-group">
                <cds-tag type="green">Active lorem</cds-tag>
                <cds-checkbox label-text="Sed do eiusmod tempor" checked></cds-checkbox>
              </div>
              <div class="page-checklist-group">
                <cds-tag type="cyan">Info lorem</cds-tag>
                <cds-checkbox label-text="Incididunt ut labore"></cds-checkbox>
                <cds-checkbox label-text="Et dolore magna aliqua"></cds-checkbox>
              </div>
              <div class="page-checklist-group">
                <cds-tag type="cool-gray">Neutral lorem</cds-tag>
                <cds-checkbox label-text="Ut enim ad minim veniam"></cds-checkbox>
              </div>
            </div>
          </section>

          <cds-accordion>
            <cds-accordion-item title="Reference: notification kinds (visual audit only)">
              <div class="page-reference-group">
                <cds-inline-notification kind="error" title="Error lorem" subtitle="Ipsum dolor sit amet" hide-close-button></cds-inline-notification>
                <cds-inline-notification kind="success" title="Success lorem" subtitle="Ipsum dolor sit amet" hide-close-button></cds-inline-notification>
                <cds-inline-notification kind="warning" title="Warning lorem" subtitle="Ipsum dolor sit amet" hide-close-button></cds-inline-notification>
                <cds-inline-notification kind="info" title="Info lorem" subtitle="Ipsum dolor sit amet" hide-close-button></cds-inline-notification>
              </div>
            </cds-accordion-item>
            <cds-accordion-item title="Reference: background & layer tokens (visual audit only)">
              <div class="token-swatch-grid">
                ${BACKGROUND_LAYER_TOKENS.map(tokenSwatch)}
              </div>
            </cds-accordion-item>
          </cds-accordion>
        </main>
      </div>
    </div>
  `;
  },
};

export const Default = {};
