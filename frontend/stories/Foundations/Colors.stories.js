import { html } from "lit";
import "../../src/styles/brand-theme.css";
import "../../src/styles/carbon-page-layout.css";
import "../../src/styles/page-templates.css";

// Documents the tokens brand-theme.css overrides on top of Carbon's defaults (applied by the
// .storybook/preview.js decorator). Keep this list in sync with src/styles/brand-theme.css - it's
// a visual reference for that file, not a source of truth.
const GROUPS = [
  {
    name: "Backgrounds & layers",
    tokens: [
      ["--cds-background", "#FFFFFF"],
      ["--side-nav-background", "#FAF8F1 (side nav only, Navigation frame)"],
      ["--cds-background-inverse", "#1C544A (brand green, 8.69:1 vs white - see brand-theme.css note)"],
      ["--cds-layer-01", "#EAF5F0"],
      ["--cds-layer-02", "#F1F8F5"],
      ["--cds-field-01", "#F3F2ED"],
      ["--cds-field-02", "#F1F0EA"],
      ["--cds-layer-accent-01", "#D5EBE0 (data table header)"],
      ["--cds-layer-accent-02", "#DDEEE5"],
      ["--cds-layer-accent-hover-01", "#C8E3D7"],
      ["--cds-layer-accent-hover-02", "#D0E8DD"],
      ["--card-background", "#FCFBF4 (dashboard cards and pop-ups)"],
      ["--card-heading", "#1C544A (card heading green; lightened to #8CC4B6 in dark)"],
    ],
  },
  {
    name: "Text",
    tokens: [
      ["--cds-text-primary", "#0A0A0A"],
      ["--cds-text-secondary", "#5A4D4A"],
      ["--cds-text-helper", "#7A6864"],
      ["--cds-text-placeholder", "#B1A29F"],
      ["--cds-text-error", "#da1e28"],
      ["--cds-text-inverse", "#ffffff"],
    ],
  },
  {
    name: "Icons",
    tokens: [
      ["--cds-icon-primary", "#161616"],
      ["--cds-icon-secondary", "#5A4D4A"],
      ["--cds-icon-inverse", "#ffffff"],
      ["--cds-icon-interactive", "#1C544A"],
    ],
  },
  {
    name: "Borders & focus",
    tokens: [
      ["--cds-border-subtle", "#e9dad7"],
      ["--cds-border-subtle-00", "#e9dad7"],
      ["--cds-border-subtle-01", "#ccc2c0 (tab and table dividers)"],
      ["--cds-border-subtle-02", "#ccc2c0"],
      ["--cds-border-strong", "#9B847F"],
      ["--cds-border-strong-01", "#9B847F"],
      ["--cds-border-interactive", "#7F0302"],
      ["--cds-focus", "#7F0302"],
    ],
  },
  {
    name: "Buttons & links",
    tokens: [
      ["--cds-button-primary", "#1C544A"],
      ["--cds-button-primary-hover", "#3C6C63"],
      ["--cds-button-primary-active", "#72958F"],
      ["--cds-button-secondary", "#3E3634"],
      ["--cds-button-secondary-hover", "#5E4F4C"],
      ["--cds-button-secondary-active", "#937A75"],
      ["--cds-button-danger-primary", "#da1e28"],
      ["--cds-button-danger-primary-hover", "#DF3E46"],
      ["--cds-button-danger-primary-active", "#E8747A"],
      ["--cds-link-primary", "#0f62fe"],
    ],
  },
  {
    name: "Status / support",
    tokens: [
      ["--cds-support-error", "#f8000d"],
      ["--cds-support-success", "#23a227"],
      ["--cds-support-warning", "#ab8c61"],
      ["--cds-support-info", "#0043ce"],
      ["Notifications (scoped to cds-*-notification)", "light tint surface (--cds-notification-background-*) + dark text; accents error #f8000d, info #0043ce, success #1e8a22, warning #8a6a3a, all 3:1+ on their tint - see brand-theme.css"],
    ],
  },
];

const swatch = ([token, value]) => html`
  <div class="token-swatch">
    <div class="token-swatch-color" style="background: var(${token});"></div>
    <code class="token-swatch-code">${token}</code>
    <span class="token-swatch-value">${value}</span>
  </div>
`;

export default {
  title: "Foundations/Colors",
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      ${GROUPS.map(
        (group) => html`
          <section class="page-section">
            <h3 class="page-section-heading">${group.name}</h3>
            <div class="token-swatch-grid">
              ${group.tokens.map(swatch)}
            </div>
          </section>
        `
      )}
    </div>
  `,
};

export const Default = {};
