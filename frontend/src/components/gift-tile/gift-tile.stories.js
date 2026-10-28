import { html } from "lit";
import { expect } from "storybook/test";
import "./gift-tile.js";

export default {
  title: "Custom Components/Gift Tile",
};

export const PersonLink = {
  render: () => html`
    <gift-tile centered href="#">
      <span style="font-size: 1.75rem">Jaritza →</span>
    </gift-tile>
  `,
  play: async ({ canvasElement }) => {
    const tile = canvasElement.querySelector("gift-tile");
    await tile.updateComplete;
    expect(tile.shadowRoot.querySelector("a.tile")).not.toBeNull();
  },
};

export const StatCard = {
  render: () => html`
    <gift-tile>
      <h3 style="margin: 0; font-size: 1.75rem; font-weight: 400">Dates with no gift planned</h3>
      <p style="margin: 0.5rem 0; font-size: 2rem">2</p>
      <p style="margin: 0 0 0.5rem">Add ideas before they arrive</p>
      <a href="#">Plan gifts →</a>
    </gift-tile>
  `,
  play: async ({ canvasElement }) => {
    const tile = canvasElement.querySelector("gift-tile");
    await tile.updateComplete;
    expect(tile.shadowRoot.querySelector("a")).toBeNull();
    expect(tile.shadowRoot.querySelector("div.tile")).not.toBeNull();
  },
};