import { LitElement, html, css } from "lit";

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

    .tile {
      box-sizing: border-box;
      block-size: 100%;
      padding: 1.5rem;
      background: var(--card-background, #fcfbf4);
      color: var(--cds-text-primary, #0a0a0a);
      border-radius: var(--radius-large, 0.75rem);
      box-shadow: 4px 6px 4px #7f0302;
      font-family: var(--font-family-heading, inherit);
      text-decoration: none;
      display: block;
    }

    :host([centered]) .tile {
      display: grid;
      place-items: center;
      min-block-size: 8rem;
    }

    a.tile:hover {
      transform: translate(-1px, -1px);
      box-shadow: 5px 7px 4px var(--card-shadow-color, #7f0302);
    }
    a.tile:focus-visible {
      outline: 2px solid var(--cds-focus, #7f0302);
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


  customElements.define("gift-tile", GiftTile);