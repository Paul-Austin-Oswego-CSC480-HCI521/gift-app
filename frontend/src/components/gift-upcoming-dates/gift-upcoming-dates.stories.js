import { html } from "lit";
import { expect, userEvent, waitFor } from "storybook/test";
import { upcomingDates } from "../../mocks/upcoming-dates.js";
import "./gift-upcoming-dates.js";

// Figma "Upcoming Dates" frame (5:25841): metric tiles, search + filter toolbar, dates list with
// pagination. Rows are passed in as a property, so no backend is needed here.
export default {
  title: "Custom Components/Upcoming Dates",
  component: "gift-upcoming-dates",
  render: ({ dates, loading, error }) => html`
    <gift-upcoming-dates .dates=${dates} ?loading=${loading} error=${error}></gift-upcoming-dates>
  `,
  args: { dates: upcomingDates, loading: false, error: "" },
};

export const Default = {};

export const Empty = { args: { dates: [] } };

export const Loading = { args: { dates: [], loading: true } };

export const LoadError = { args: { dates: [], error: "Network request failed" } };

const settle = async (canvasElement) => {
  const host = canvasElement.querySelector("gift-upcoming-dates");
  await host.updateComplete;
  return host;
};

export const SearchFiltersRows = {
  play: async ({ canvasElement, step }) => {
    const host = await settle(canvasElement);
    const rowCount = () => host.shadowRoot.querySelector("gift-dates-table").dates.length;

    await step("search narrows the list", async () => {
      const search = host.shadowRoot.querySelector("cds-search");
      search.dispatchEvent(
        new CustomEvent("cds-search-input", { detail: { value: "alex" }, bubbles: true, composed: true })
      );
      await waitFor(() => expect(rowCount()).toBe(1));
    });

    await step("no match shows a message", async () => {
      host.shadowRoot
        .querySelector("cds-search")
        .dispatchEvent(
          new CustomEvent("cds-search-input", { detail: { value: "zzz" }, bubbles: true, composed: true })
        );
      await waitFor(() => expect(host.shadowRoot.querySelector("cds-inline-notification")).toBeTruthy());
    });
  },
};

export const FilterToGiftsToBuy = {
  play: async ({ canvasElement, step }) => {
    const host = await settle(canvasElement);

    await step("filter keeps only dates with gifts left to buy", async () => {
      await userEvent.click(host.shadowRoot.querySelector("cds-icon-button"));
      await waitFor(() =>
        expect(host.shadowRoot.querySelector("gift-dates-table").dates.map((d) => d.person)).toEqual(["Mom"])
      );
    });
  },
};
