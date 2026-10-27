import { LitElement, html, css } from "lit";
import "@carbon/web-components/es/components/tile/index.js";

// Static design preview until the preferences API and editing flow are defined.
export class GiftPreferencesHeader extends LitElement {
  static styles = css`
    :host { display: block; min-width: 0; }
    .panel { background: var(--cds-layer-01); border-radius: var(--radius-large); }
    h2 { margin: 0; font-family: var(--font-family-heading); font-size: var(--cds-heading-compact-01-font-size, 1rem); font-weight: var(--cds-heading-compact-01-font-weight, 600); }
    p { margin: var(--cds-spacing-03, .5rem) 0 var(--cds-spacing-05, 1rem); }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr)); gap: var(--cds-spacing-05, 1rem); }
    .card { background: var(--card-background); border-radius: var(--radius-small); }
    h3 { margin: 0 0 var(--cds-spacing-03, .5rem); font-family: var(--font-family-heading); font-size: var(--cds-label-01-font-size, .75rem); font-weight: var(--cds-heading-compact-01-font-weight, 600); }
    .colors { display: flex; flex-wrap: wrap; gap: var(--cds-spacing-02, .25rem); }
    .swatch { width: var(--cds-spacing-05, 1rem); height: var(--cds-spacing-05, 1rem); border-radius: 50%; background: var(--swatch); }
    .red { --swatch: var(--cds-support-error); }
    .green { --swatch: var(--cds-support-success); }
    .teal { --swatch: var(--cds-button-primary); }
    .blue { --swatch: var(--cds-support-info); }
    .yellow { --swatch: var(--cds-support-warning); }
    .note { margin-bottom: 0; color: var(--cds-text-secondary); font-size: var(--cds-helper-text-01-font-size, .75rem); }
  `;
  render() {
    return html`<section aria-labelledby="preferences-title"><cds-tile class="panel">
      <h2 id="preferences-title">Preferences</h2>
      <p>Things you like, your go-to sizes, favorite colors, and more</p>
      <div class="cards">
        <cds-tile class="card"><h3>Favorite Colors</h3>
          <div class="colors" role="img" aria-label="Example colors: red, green, teal, blue, and yellow">
            ${["red", "green", "teal", "blue", "yellow"].map(color => html`<span class="swatch ${color}" aria-hidden="true"></span>`)}
          </div>
        </cds-tile>
        ${[["Sizes", "Unknown"], ["Interests", "Music"], ["Dislikes", "Reading"]].map(([label, value]) => html`<cds-tile class="card"><h3>${label}</h3><span>${value}</span></cds-tile>`)}
      </div>
      <p class="note">Preview only — these are sample preferences, not saved account information.</p>
    </cds-tile></section>`;
  }
}
customElements.define("gift-preferences-header", GiftPreferencesHeader);
