import { LitElement, html, css } from "lit";
import "@carbon/web-components/es/components/data-table/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/tag/index.js";
import "@carbon/web-components/es/components/icon-button/index.js";

// This component is a table that displays gift dates and related information. It uses Carbon Web Components for styling and functionality.

export class GiftDatesTable extends LitElement {
  static properties = {};

  static styles = css``;

  render() {
    return html`
      <cds-table locale="en" size="xl" use-zebra-styles>
        <cds-table-head>
          <cds-table-header-row>
            <cds-table-header-cell>Days</cds-table-header-cell>
            <cds-table-header-cell>Occasion</cds-table-header-cell>
            <cds-table-header-cell>Details</cds-table-header-cell>
            <cds-table-header-cell>Status</cds-table-header-cell>
            <cds-table-header-cell>Actions</cds-table-header-cell>
          </cds-table-header-row>
        </cds-table-head>

        <cds-table-body>
          <cds-table-row>
            <cds-table-cell>
              5
              <cds-table-cell-content>DAYS</cds-table-cell-content>
            </cds-table-cell>
            <cds-table-cell aria-label="Birthday">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                fill="currentColor"
                width="20"
                height="20"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M5,28c-.2607,0-.5161-.1016-.707-.293-.2749-.2744-.3657-.6836-.2329-1.0488L12.0601,4.6582c.1172-.3213.3896-.5605.7231-.6343.3335-.0757.6821.0269.9238.269l14,14c.2422.2412.3428.5898.2695.9238-.0742.333-.3135.6064-.6348.7227L5.3418,27.9395c-.1113.041-.2271.0605-.3418.0605ZM9.1367,18.5508l-2.4648,6.7773,6.7773-2.4648-4.3125-4.3125ZM9.8906,16.4766l5.6328,5.6328,3.793-1.3789-8.0464-8.0464-1.3794,3.7925ZM12.0239,10.6099l9.3657,9.3657,3.793-1.3789L13.4033,6.8174l-1.3794,3.7925ZM30,13h-4v-2h4v2ZM25.0127,8.4019l-1.4141-1.4141,3.3926-3.3931,1.4141,1.4141-3.3926,3.3931ZM21,6h-2V2h2v4Z"></path>
              </svg>
            </cds-table-cell>
            <cds-table-cell>
              Mom
              <cds-table-cell-content>
                Birthday<br />
                Mon, Oct 19, 2026 · 2 gifts to buy
            </cds-table-cell-content>
            </cds-table-cell>
            <cds-table-cell>
              <cds-tag type="red" size="sm">Not purchased</cds-tag>
            </cds-table-cell>
            <cds-table-cell>
              <cds-icon-button kind="ghost" size="sm">
              
                <svg
                  slot="icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  fill="currentColor"
                  width="16"
                  height="16"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M27.3069,6.1069,30,3.4141,28.5859,2,25.8931,4.6929,24.8,3.6a1.9328,1.9328,0,0,0-2.8,0L4,21.6V28h6.4l18-18a1.9329,1.9329,0,0,0,0-2.8ZM9.6,26H6V22.4L23.4,5,27,8.6Z"></path>
                  <path d="M8.136 7.5H18.863999999999997V9.5H8.136z"
                  transform="rotate(-45 13.5 8.5)"

                  ></path>
                  
                </svg>

                <span slot="tooltip-content">Edit</span>

              </cds-icon-button>
            </cds-table-cell>
          </cds-table-row>
        </cds-table-body>
      </cds-table>
    `;
  }
}

customElements.define("gift-dates-table", GiftDatesTable);
