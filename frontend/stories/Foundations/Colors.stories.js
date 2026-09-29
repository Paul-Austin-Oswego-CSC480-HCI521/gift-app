import { html } from "lit";
import "../../src/styles/brand-theme.css";

// Documents the tokens brand-theme.css overrides on top of Carbon's defaults (applied via
// data-carbon-theme="brand"). Keep this list in sync with src/styles/brand-theme.css - it's
// a visual reference for that file, not a source of truth.
const GROUPS = [
  {
    name: "Backgrounds & layers",
    tokens: [
      ["--cds-background", "#FCFBF4"],
      ["--cds-background-inverse", "#393939 (Carbon default - see brand-theme.css note)"],
      ["--cds-layer-01", "#F3F5F4"],
      ["--cds-layer-02", "#ffffff"],
      ["--cds-field-01", "#f4f4f4"],
      ["--cds-field-02", "#ffffff"],
    ],
  },
  {
    name: "Text",
    tokens: [
      ["--cds-text-primary", "#0A0A0A"],
      ["--cds-text-secondary", "#525252"],
      ["--cds-text-helper", "#6f6f6f"],
      ["--cds-text-error", "#da1e28"],
      ["--cds-text-inverse", "#ffffff"],
    ],
  },
  {
    name: "Icons",
    tokens: [
      ["--cds-icon-primary", "#161616"],
      ["--cds-icon-secondary", "#525252"],
      ["--cds-icon-inverse", "#ffffff"],
      ["--cds-icon-interactive", "#1C544A"],
    ],
  },
  {
    name: "Borders & focus",
    tokens: [
      ["--cds-border-subtle", "#e9dad7"],
      ["--cds-border-subtle-00", "#e9dad7"],
      ["--cds-border-strong", "#8d8d8d"],
      ["--cds-border-strong-01", "#8d8d8d"],
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
      ["--cds-button-secondary", "#393939"],
      ["--cds-button-secondary-hover", "#555555"],
      ["--cds-button-secondary-active", "#848484"],
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
  <div style="display: flex; flex-direction: column; gap: 0.25rem;">
    <div
      style="width: 100%; height: 3rem; border-radius: 4px; border: 1px solid #e0e0e0; background: var(${token});"
    ></div>
    <code style="font-size: 0.75rem;">${token}</code>
    <span style="font-size: 0.75rem; color: #525252;">${value}</span>
  </div>
`;

export default {
  title: "Foundations/Colors",
  render: () => html`
    <div data-carbon-theme="brand" style="display: flex; flex-direction: column; gap: 2rem;">
      ${GROUPS.map(
        (group) => html`
          <section>
            <h3 style="margin: 0 0 0.75rem;">${group.name}</h3>
            <div
              style="display: grid; grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr)); gap: 1rem;"
            >
              ${group.tokens.map(swatch)}
            </div>
          </section>
        `
      )}
    </div>
  `,
};

export const Default = {};
