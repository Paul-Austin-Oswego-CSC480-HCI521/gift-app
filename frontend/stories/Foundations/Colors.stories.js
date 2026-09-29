import { html } from "lit";
import "../../src/styles/brand-theme.css";
import "../../src/styles/carbon-page-layout.css";

// Documents the tokens brand-theme.css overrides on top of Carbon's defaults (applied via
// data-carbon-theme="brand"). Keep this list in sync with src/styles/brand-theme.css - it's
// a visual reference for that file, not a source of truth.
const GROUPS = [
  {
    name: "Backgrounds & layers",
    tokens: [
      ["--cds-background", "#FCFBF4"],
      ["--cds-background-inverse", "#393939 (Carbon default - see brand-theme.css note)"],
      ["--cds-layer-01", "#EAF5F0"],
      ["--cds-layer-02", "#F1F8F5"],
      ["--cds-field-01", "#F3F2ED"],
      ["--cds-field-02", "#F1F0EA"],
    ],
  },
  {
    name: "Text",
    tokens: [
      ["--cds-text-primary", "#0A0A0A"],
      ["--cds-text-secondary", "#5A4D4A"],
      ["--cds-text-helper", "#7A6864"],
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
    <div data-carbon-theme="brand" style="display: flex; flex-direction: column; gap: 2rem;">
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
