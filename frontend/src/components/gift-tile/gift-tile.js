import { LitElement, html, css } from "lit";

export class GiftTile extends LitElement {
  static properties = {
    href: { type: String },
    centered: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: block;
      max-inline-size: var(--gift-tile-max-width, 24rem);
    }

    .tile {
      box-sizing: border-box;
      block-size: 100%;
      padding: var(--cds-spacing-06, 1.5rem);
      background: var(--gift-tile-background, #fbfaf4);
      color: var(--gift-tile-color, #161616);
      border-radius: var(--gift-tile-radius, 1rem);
      box-shadow: var(--gift-tile-shadow, 4px 6px 4px #8b1a1a);
      font-family: var(--gift-tile-font, inherit);
      text-decoration: none;
      display: block;
    }

    :host([centered]) .tile {
      display: grid;
      place-items: center;
      min-block-size: var(--gift-tile-min-height, 8rem);
    }

    a.tile:hover {
      transform: translate(-1px, -1px);
      box-shadow: var(--gift-tile-shadow-hover, 5px 7px 4px #8b1a1a);
    }
    a.tile:focus-visible {
      outline: 2px solid var(--cds-focus, #0f62fe);
      outline-offset: 2px;
    }

    @media (prefers-reduced-motion: no-preference) {
      .tile {
        transition: transform 100ms, box-shadow 100ms;
      }
    }
  `;

  render() {
    return this.href
      ? html`<a class="tile" href=${this.href}><slot></slot></a>`
      : html`<div class="tile"><slot></slot></div>`;
  }
}

if (!customElements.get("gift-tile")) {
  customElements.define("gift-tile", GiftTile);
}