import { html } from "lit";
import "./gift-dashboard.js";
import "../../styles/page-templates.css";

// The dashboard's page content: a tile per person with a structured list of their gifts.
// Composed from cds-tile, cds-structured-list, cds-tag, cds-button and the Carbon notification/loading
// components. Data is passed in as properties, so no backend is needed here.
const user = {
  fullName: "Test User 1",
  people: [
    {
      fullName: "Alex Rivera",
      gifts: [
        {
          name: "Pour-over coffee set",
          type: "Physical",
          status: { stage: "Need to buy" },
          occasion: { name: "Birthday", date: "2026-11-14" },
          purchaseDate: null,
        },
        {
          name: "Trail running shoes",
          type: "Physical",
          status: { stage: "Purchased" },
          occasion: { name: "Holiday", date: "2026-12-25" },
          purchaseDate: "2026-10-02",
        },
      ],
    },
    { fullName: "Sam Patel", gifts: [] },
  ],
};

export default {
  title: "Custom Components/Dashboard",
  component: "gift-dashboard",
  render: ({ user, loading, error }) => html`
    <gift-dashboard .user=${user} ?loading=${loading} error=${error}></gift-dashboard>
  `,
  args: { user, loading: false, error: "" },
};

export const Default = {};
export const Loading = { args: { user: null, loading: true } };
export const NoPeople = { args: { user: { fullName: "Test User 1", people: [] } } };
export const LoadError = { args: { user: null, error: "API request to /user/1 failed: 500" } };
