import { LitElement, html, css } from "lit";
import "@carbon/web-components/es/components/tile/tile.js";
import "@carbon/web-components/es/components/tile/clickable-tile.js";

export class GiftTile extends LitElement {
  static properties = {
    href: { type: String },
    centered: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: block;
      max-inline-size: 24rem;
    }

    .content[centered] {
      display: grid;
      place-items: center;
      min-block-size: var(--cds-spacing-12);
      text-align: center;
    }
  `;

  render() {
    const content = html`<div class="content" ?centered=${this.centered}><slot></slot></div>`;

    return this.href
      ? html`<cds-clickable-tile href=${this.href} link-role="link">${content}</cds-clickable-tile>`
      : html`<cds-tile>${content}</cds-tile>`;
  }
}

customElements.define("gift-tile", GiftTile);