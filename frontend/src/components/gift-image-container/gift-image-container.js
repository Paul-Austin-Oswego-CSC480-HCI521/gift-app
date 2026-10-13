import { LitElement, html, css, unsafeCSS} from "lit";

import bgImage from "../../assets/background.jpg";

// Reusable background-image panel for page content. It is a custom component because Carbon does not
// provide this exact layout. Page content goes into the default slot below.
export class ImageContainer extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex: 1 0 0;
      align-self: stretch;
    }
    main {
      display: flex;
      padding: 0;
      flex-direction: column;
      align-items: flex-start;
      gap: 31px;
      width: 100%;
      flex: 1 0 0;
      align-self: stretch;
      box-sizing: border-box;
      background: url("${unsafeCSS(bgImage)}") lightgray 50% / cover no-repeat;
      color: var(--cds-text-primary, #161616);
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

customElements.define("gift-image-container", ImageContainer);

// This connects the HTML tag to the class above. Import this file before using the tag.
