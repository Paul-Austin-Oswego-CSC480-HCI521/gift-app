import { LitElement, html, css } from "lit";

// Reusable pink/orange panel for page content. It is a custom component because Carbon does not
// provide this exact layout. Page content goes into the default slot below.
export class GradientContainer extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex: 1 0 0;
      align-self: stretch;
    }
    main {
      display: flex;
      padding: var(--Typography-Fluid-Display-Display-01-Line-height, 50px) 0;
      flex-direction: column;
      align-items: flex-start;
      gap: 31px;
      width: 100%;
      flex: 1 0 0;
      align-self: stretch;
      box-sizing: border-box;
      background: linear-gradient(90deg, #ffc6c6 0%, #ffd7a3 100%);
      color: var(--Text-text-primary, #161616);
      font-family: var(--Font-family, "IBM Plex Sans");
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
    }
  `;

  render() {
    // The slot keeps the component's background separate from the page content.
    return html`<main><slot></slot></main>`;
  }
}

customElements.define("gift-gradient-container", GradientContainer);

// This connects the HTML tag to the class above. Import this file before using the tag.

