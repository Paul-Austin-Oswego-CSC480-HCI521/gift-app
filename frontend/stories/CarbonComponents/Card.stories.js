import "@carbon/web-components/es/components/tile/index.js";
import "@carbon/web-components/es/components/checkbox/index.js";
import "@carbon/web-components/es/components/link/index.js";
import { html } from "lit";
import "../../src/styles/brand-theme.css";
import "../../src/styles/carbon-page-layout.css";

// Dashboard content card (Dashboard frame 1476:6134, e.g. "Upcoming Dates"): --cds-background
// surface with --radius-large corners, a 20px green heading, a 1px rule, a checklist and a
// "View All →" link. Built from cds-tile; the radius and heading treatment live in
// brand-theme.css, the markup here is only content.
const arrowRight = html`<svg slot="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" width="20" height="20"><path d="M18 6 16.57 7.393 24.15 15 4 15 4 17 24.15 17 16.57 24.573 18 26 28 16z"/></svg>`;

const card = ({ heading, items }) => html`
  <cds-tile class="gift-card">
    <div class="gift-card__header">
      <h3 class="gift-card__heading">${heading}</h3>
      <cds-link href="#">View All ${arrowRight}</cds-link>
    </div>
    <div class="gift-card__body">
      ${items.map(([label, checked]) => html`<cds-checkbox label-text=${label} ?checked=${checked}></cds-checkbox>`)}
    </div>
  </cds-tile>
`;

export default {
  title: "Carbon Components/Card",
  // The card shares its #FCFBF4 with --cds-background in light mode (Figma shows it on a white
  // page), so the canvas gets a white surround in light mode or the radius would be invisible.
  render: (_args, { globals }) => html`
    <div style="padding: 1.5rem; background: ${globals.theme === "dark" ? "var(--cds-background)" : "#fff"};">
      ${card({
      heading: "Upcoming Dates",
      items: [["Checkbox label", true], ["Checkbox label", true], ["Checkbox label", false], ["Checkbox label", false], ["Checkbox label", false], ["Checkbox label", false]],
      })}
    </div>
  `,
};

export const Default = {};
