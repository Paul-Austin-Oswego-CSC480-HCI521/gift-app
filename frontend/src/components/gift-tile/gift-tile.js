import { LitElement, html, css } from "lit";
import "@carbon/web-components/es/components/tile/tile.js";
import "@carbon/web-components/es/components/tile/clickable-tile.js";
import "@carbon/web-components/es/components/icon-button/index.js";
import { iconLoader } from "@carbon/web-components/es/globals/internal/icon-loader.js";
import Add16 from "@carbon/icons/es/add/16.js";
import ArrowRight16 from "@carbon/icons/es/arrow--right/16.js";

// Figma component set "Gift Card" (node 5:4463), `Type` property. State (Enabled/Hover/Focus)
// comes from Carbon's tile; typography is up to the slotted content.
export const TILE_TYPES = ["base", "section", "metric", "preference", "person", "add"];

export class GiftTile extends LitElement {
  static properties = {
    type: { type: String, reflect: true },
    href: { type: String },
    addLabel: { type: String, attribute: "add-label" },
  };

  static styles = css`
    :host {
      display: block;
      max-inline-size: 22.5rem; /* Figma Base/Clickable/Metric: 360 */
    }

    :host([type="section"]) {
      max-inline-size: 19.25rem; /* 308 */
    }

    :host([type="person"]),
    :host([type="add"]) {
      max-inline-size: 15.625rem; /* 250 */
    }

    :host([type="preference"]) {
      max-inline-size: 10.75rem; /* 172 */
    }

    /* The page-level brand rule for cds-tile (brand-theme.css) cannot cross this shadow root, and a
       slotted layout rules out light DOM, so the same tile override is applied here. Every type
       gets it except preference, which stays a plain Carbon tile in Figma. */
    :host(:not([type="preference"])) cds-tile,
    :host(:not([type="preference"])) cds-clickable-tile {
      --cds-layer: var(--cds-background);
      border-radius: var(--tile-radius);
      box-shadow: 6px 5px 4px 0 var(--cds-border-interactive); /* Figma: x6 y5 blur4 */
    }

    /* The clickable tile's inner link is square and would cover the rounded border. */
    cds-clickable-tile {
      overflow: hidden;
    }

    /* Person (Figma "Long name"): a long name is cut to two lines with an ellipsis, not wrapped on. */
    :host([type="person"]) ::slotted(:not([slot])) {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      overflow-wrap: anywhere;
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: var(--cds-spacing-03);
    }
  `;

  constructor() {
    super();
    this.type = "base";
    this.addLabel = "Add";
  }

  #onAdd() {
    this.dispatchEvent(new CustomEvent("gift-tile-add", { bubbles: true, composed: true }));
  }

  #renderContent() {
    const isAdd = this.type === "add";
    return html`
      <div class="content">
        <slot name="title"></slot>
        <slot name="description"></slot>
        <slot></slot>
        ${isAdd
          ? html`<cds-icon-button kind="primary" size="lg" @click=${this.#onAdd}>
              ${iconLoader(Add16, { slot: "icon" })}
              <span slot="tooltip-content">${this.addLabel}</span>
            </cds-icon-button>`
          : ""}
      </div>
    `;
  }

  render() {
    // Clickable is a Figma Type of its own, but it is really "a tile with a destination", so any
    // type with an href becomes a Carbon clickable tile (Carbon supplies hover and focus). Carbon only
    // draws its own arrow behind a feature flag, so the Figma arrow is slotted in explicitly.
    return this.href
      ? html`<cds-clickable-tile href=${this.href} link-role="link">
          ${this.#renderContent()}${iconLoader(ArrowRight16, { slot: "icon" })}
        </cds-clickable-tile>`
      : html`<cds-tile>${this.#renderContent()}</cds-tile>`;
  }
}

customElements.define("gift-tile", GiftTile);
