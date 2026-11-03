import { html } from "lit";
import { wishlistItems } from "../../mocks/wishlist.js";
import "./gift-my-wishlist.js";

export default {
  title: "Custom Components/My Wishlist",
  render: ({ items }) => html`<gift-my-wishlist .items=${items}></gift-my-wishlist>`,
  args: { items: wishlistItems },
};

export const Default = {};
