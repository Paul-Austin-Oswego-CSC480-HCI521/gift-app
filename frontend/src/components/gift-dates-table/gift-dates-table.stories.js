import { html } from "lit";
import { upcomingDates } from "../../mocks/upcoming-dates.js";
import "./gift-dates-table.js";

export default {
  title: "Custom Components/Dates Table",
  component: "gift-dates-table",
  render: ({ dates }) => html`<gift-dates-table .dates=${dates}></gift-dates-table>`,
  args: { dates: upcomingDates },
};

export const Default = {};

export const Purchased = {
  args: { dates: [upcomingDates[0]] },
};

export const NotPurchased = {
  args: { dates: [upcomingDates[1]] },
};
