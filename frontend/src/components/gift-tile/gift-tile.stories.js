import { html } from "lit";
import { expect } from "storybook/test";
import "./gift-tile.js";

export default {
  title: "Custom Components/Gift Tile",
};

export const Default = {
  render: () => html`
    <gift-tile>
      <h3>Dates with no gift planned</h3>
      <p>2</p>
      <p>Add ideas before they arrive</p>
      <cds-link href="#">Plan gifts</cds-link>
    </gift-tile>
  `,
};

export const PersonLink = {
  render: () => html`
    <gift-tile centered href="#">
      <span>Jaritza</span>
    </gift-tile>
  `,
  play: async ({ canvasElement }) => {
    const tile = canvasElement.querySelector("gift-tile");
    await tile.updateComplete;
    const clickableTile = tile.shadowRoot.querySelector("cds-clickable-tile");
    expect(clickableTile).toHaveAttribute("href", "#");
    expect(clickableTile).toHaveAttribute("link-role", "link");
  },
};
