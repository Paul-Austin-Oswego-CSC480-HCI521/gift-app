import { LitElement, html, css } from "lit";
import "@carbon/web-components/es/components/tile/tile.js";
import "@carbon/web-components/es/components/tile/clickable-tile.js";
import "@carbon/web-components/es/components/icon-button/index.js";
import { iconLoader } from "@carbon/web-components/es/globals/internal/icon-loader.js";
import Add16 from "@carbon/icons/es/add/16.js";
import ArrowRight16 from "@carbon/icons/es/arrow--right/16.js";
import ArrowRight32 from "@carbon/icons/es/arrow--right/32.js";

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

    /* The clickable tile's inner link is square and would cover the rounded corners. The 1px border is
       reserved at rest so the hover border does not resize the tile. */
    cds-clickable-tile {
      overflow: hidden;
      border: 1px solid transparent;
    }

    :host(:not([type="preference"])) cds-clickable-tile:hover {
      border-color: var(--cds-button-primary-active);
    }

    /* Person and add (Figma 144px tall): content is centred, the person name sits inline with its arrow. */
    :host([type="person"]) cds-tile,
    :host([type="person"]) cds-clickable-tile,
    :host([type="add"]) cds-tile {
      block-size: 9rem;
      box-sizing: border-box;
    }

    :host([type="person"]) .content,
    :host([type="add"]) .content {
      block-size: 100%;
      align-items: center;
      justify-content: center;
    }

    :host([type="person"]) .content {
      flex-direction: row;
      gap: var(--cds-spacing-03); /* Figma: 8 between name and arrow */
    }

    /* Person: the name is Outfit Regular 24px, max 170px wide. A long name is cut to two lines with an
       ellipsis (Figma "Long name": text truncation ending, max 2 lines). */
    :host([type="person"]) ::slotted(:not([slot])) {
      font-family: var(--font-family-heading);
      font-size: 1.5rem;
      font-weight: 400;
      line-height: normal;
      color: var(--cds-text-primary);
      max-inline-size: 10.625rem;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      overflow-wrap: anywhere;
    }

    .arrow {
      display: flex;
      flex: none;
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
    // Person: the arrow follows the name (Figma) instead of sitting in Carbon's corner icon slot.
    const inlineArrow = this.type === "person" && this.href;
    return html`
      <div class="content">
        <slot name="title"></slot>
        <slot name="metric"></slot>
        <slot name="description"></slot>
        <slot></slot>
        ${inlineArrow ? html`<span class="arrow">${iconLoader(ArrowRight32, { "aria-hidden": "true" })}</span>` : ""}
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
          ${this.#renderContent()}${this.type === "person" ? "" : iconLoader(ArrowRight16, { slot: "icon" })}
        </cds-clickable-tile>`
      : html`<cds-tile>${this.#renderContent()}</cds-tile>`;
  }
}

customElements.define("gift-tile", GiftTile);
