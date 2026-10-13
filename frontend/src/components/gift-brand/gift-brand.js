// carbon-exempt: Carbon ships no logo/wordmark component; this is the app brand mark.
import { LitElement, html, css } from "lit";

export class GiftBrand extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--cds-spacing-03, 0.5rem);
      font-size: 1.125rem;
      font-weight: 500;
    }
  `;

  render() {
    return html`
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.25" aria-hidden="true">
        <path d="M5 14h22v16H5zM3 8h26v6H3zM16 8v22" />
        <path d="M16 8h-4a3.5 3.5 0 1 1 3.5-3.5L16 8Zm0 0h4a3.5 3.5 0 1 0-3.5-3.5L16 8Z" />
      </svg>
      <span>Gift App</span>
    `;
  }
}
customElements.define("gift-brand", GiftBrand);
