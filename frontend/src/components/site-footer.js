import { LitElement, html, css } from "lit";
import "@carbon/web-components/es/components/link/index.js";

export class SiteFooter extends LitElement {

    static styles = css`
        footer {
            display: flex;
            flex-direction: column;
            background: var(--Layer-layer-selected-inverse, #161616);
            padding: 32px 32px;
            align-items: flex-end;
            gap: 10px;
            align-self: stretch;
        }

        //overide the color scheme of the cds link.
        cds-link {
          --cds-link-primary: #A6C8FF; /* 13.5:1 ratio against #262626 */
          --cds-link-primary-hover: #78a9ff;
        }
    `;

    render(){
       return html `
        <footer class = "footer">

        <cds-link>
        Accessibility Policy
        <svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"
        fill="currentColor" slot="icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"></path>
        </svg>
        </cds-link>

        <cds-link>
        About Us
        <svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"
        fill="currentColor" slot="icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"></path>
        </svg>
       </cds-link>

       <cds-link>
            Follow Online
            <svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"
            fill="currentColor" slot="icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z"></path>
            </svg>
       </cds-link>
       </footer>
      `;
    }
}
customElements.define("gift-site-footer", SiteFooter);