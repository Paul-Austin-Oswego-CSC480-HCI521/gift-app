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
  ["--cds-layer-01", "#F3F5F4"],
  ["--cds-layer-02", "#ffffff"],
  ["--cds-field-01", "#f4f4f4"],
  ["--cds-field-02", "#ffffff"],
];

const tokenSwatch = ([token, value]) => html`
  <div style="display: flex; flex-direction: column; gap: 0.25rem;">
    <div
      style="width: 100%; height: 3rem; border-radius: 4px; border: 1px solid #e0e0e0; background: var(${token});"
    ></div>
    <code style="font-size: 0.75rem;">${token}</code>
    <span style="font-size: 0.75rem; color: #525252;">${value}</span>
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
        <div
          style="display: flex; align-items: center; gap: 0.5rem; margin-left: auto; padding: 0 1rem; color: var(--cds-text-on-color, #fff);"
        >
          <!-- Hardcoded brand mint, not var(--cds-background-inverse): that token is pinned
               to Carbon's dark default so Carbon-internal white-on-dark pairings (e.g. the
               checked cds-checkbox tick) keep working - see brand-theme.css note. -->
          <span
            style="display: flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; border-radius: 50%; background: #BBE4DF; color: #0A0A0A; font-size: 0.75rem; font-weight: 600; flex-shrink: 0;"
          >
            JD
          </span>
          <span style="font-size: 0.875rem;">Jane Doe</span>
        </div>
      </gift-nav-header>

      <div>
        <!-- cds-side-nav positions itself with position:fixed internally (Carbon's app-shell
             pattern: pinned nav, independently scrolling content), so it contributes no width
             to a flex layout here. main below is given a matching margin-inline-start instead
             of relying on flexbox to place them side by side. -->
        <cds-side-nav expanded collapse-mode="fixed" aria-label="Page sections">
          <cds-side-nav-items>
            <cds-side-nav-link href="#upcoming">Upcoming</cds-side-nav-link>
            <cds-side-nav-link href="#quick-actions">Quick actions</cds-side-nav-link>
            <cds-side-nav-link href="#recently-added">Recently added</cds-side-nav-link>
            <cds-side-nav-link href="#gift-checklist">Gift checklist</cds-side-nav-link>
          </cds-side-nav-items>
          <div style="padding: 1rem;">
            <cds-tile style="display: flex; flex-direction: column; gap: 0.5rem;">
              <span style="font-size: 0.75rem; color: var(--cds-text-secondary);">Gift checklist</span>
              <span style="font-size: 0.875rem; font-weight: 600;">3 still pending</span>
            </cds-tile>
          </div>
        </cds-side-nav>

        <main
          style="display: flex; flex-direction: column; gap: 2rem; align-items: stretch; margin-inline-start: 16rem; padding: 2rem; background: var(--cds-background); box-sizing: border-box; min-height: calc(100vh - 3rem);"
        >
          <cds-callout-notification kind="warning" low-contrast title="Concept only — not a real dashboard.">
            <span slot="subtitle">
              This page, its content, and its information architecture are made up, generated
              only to preview what Carbon Web Components could look like with our color scheme.
              Nothing here reflects final product decisions.
            </span>
          </cds-callout-notification>

          <!-- low-contrast: without it, cds-inline-notification uses --cds-background-inverse,
               which is Carbon's *opposite-of-page* polarity by design (dark card on a light
               page, light card on a dark page) - correct for a toast-style notification, but
               wrong for a banner that should blend with the page like the callout above it. -->
          <cds-inline-notification
            kind="info"
            title="Lorem ipsum dolor sit amet"
            subtitle="Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
            hide-close-button
            low-contrast
          ></cds-inline-notification>

          <section style="display: flex; flex-direction: column; gap: 0.5rem;">
            <h2 style="margin: 0; color: var(--cds-text-primary);">Ut enim ad minim veniam</h2>
            <p style="margin: 0; max-width: 40em; color: var(--cds-text-secondary);">
              Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </section>

          <section id="upcoming" style="display: flex; flex-direction: column; gap: 0.75rem;">
            <h3 style="margin: 0; color: var(--cds-text-primary);">Upcoming</h3>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              ${["Lorem ipsum", "Dolor sit amet", "Consectetur"].map(
                (label, i) => html`
                  <cds-tile
                    style="display: flex; flex-direction: column; gap: 0.5rem; min-width: 10rem;"
                  >
                    <span style="font-size: 0.75rem; color: var(--cds-text-secondary);">${label}</span>
                    <span style="font-size: 1.5rem; font-weight: 600;">${(i + 1) * 2}</span>
                  </cds-tile>
                `
              )}
            </div>
          </section>

          <section id="quick-actions" style="display: flex; flex-direction: column; gap: 0.75rem;">
            <h3 style="margin: 0; color: var(--cds-text-primary);">Quick actions</h3>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: flex-end;">
              <cds-text-input label="Lorem ipsum" placeholder="Dolor sit amet"></cds-text-input>
              <cds-text-input label="Consectetur adipiscing" placeholder="Elit sed do"></cds-text-input>
              <cds-text-input label="Eiusmod tempor" placeholder="Incididunt ut"></cds-text-input>
              <cds-button kind="primary">Lorem ipsum action</cds-button>
            </div>
          </section>

          <section id="recently-added" style="display: flex; flex-direction: column; gap: 0.75rem;">
            <h3 style="margin: 0; color: var(--cds-text-primary);">Recently added</h3>
            <table style="border-collapse: collapse; width: 100%; max-width: 48rem;">
              <thead>
                <tr>
                  <th style="text-align: left; padding: 0.5rem; border-bottom: 1px solid var(--cds-border-subtle, #e0e0e0);">Lorem</th>
                  <th style="text-align: left; padding: 0.5rem; border-bottom: 1px solid var(--cds-border-subtle, #e0e0e0);">Ipsum</th>
                  <th style="text-align: left; padding: 0.5rem; border-bottom: 1px solid var(--cds-border-subtle, #e0e0e0);">Dolor</th>
                </tr>
              </thead>
              <tbody>
                ${[1, 2, 3].map(
                  (row) => html`
                    <tr>
                      <td style="padding: 0.5rem; border-bottom: 1px solid var(--cds-border-subtle, #e0e0e0);">Sit amet ${row}</td>
                      <td style="padding: 0.5rem; border-bottom: 1px solid var(--cds-border-subtle, #e0e0e0);">Consectetur ${row}</td>
                      <td style="padding: 0.5rem; border-bottom: 1px solid var(--cds-border-subtle, #e0e0e0);">Adipiscing ${row}</td>
                    </tr>
                  `
                )}
              </tbody>
            </table>
          </section>

          <section id="gift-checklist" style="display: flex; flex-direction: column; gap: 1rem;">
            <h3 style="margin: 0; color: var(--cds-text-primary);">Gift checklist</h3>
            <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 32rem;">
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <cds-tag type="gray">Pending lorem</cds-tag>
                <cds-checkbox label-text="Ipsum dolor sit amet"></cds-checkbox>
                <cds-checkbox label-text="Consectetur adipiscing elit"></cds-checkbox>
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <cds-tag type="green">Active lorem</cds-tag>
                <cds-checkbox label-text="Sed do eiusmod tempor" checked></cds-checkbox>
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <cds-tag type="cyan">Info lorem</cds-tag>
                <cds-checkbox label-text="Incididunt ut labore"></cds-checkbox>
                <cds-checkbox label-text="Et dolore magna aliqua"></cds-checkbox>
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <cds-tag type="cool-gray">Neutral lorem</cds-tag>
                <cds-checkbox label-text="Ut enim ad minim veniam"></cds-checkbox>
              </div>
            </div>
          </section>

          <cds-accordion>
            <cds-accordion-item title="Reference: notification kinds (visual audit only)">
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <cds-inline-notification kind="error" title="Error lorem" subtitle="Ipsum dolor sit amet" hide-close-button></cds-inline-notification>
                <cds-inline-notification kind="success" title="Success lorem" subtitle="Ipsum dolor sit amet" hide-close-button></cds-inline-notification>
                <cds-inline-notification kind="warning" title="Warning lorem" subtitle="Ipsum dolor sit amet" hide-close-button></cds-inline-notification>
                <cds-inline-notification kind="info" title="Info lorem" subtitle="Ipsum dolor sit amet" hide-close-button></cds-inline-notification>
              </div>
            </cds-accordion-item>
            <cds-accordion-item title="Reference: background & layer tokens (visual audit only)">
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr)); gap: 1rem;">
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
