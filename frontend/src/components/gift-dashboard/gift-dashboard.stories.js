import { html } from "lit";
import { expect, fn, userEvent, waitFor } from "storybook/test";
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
  render: ({ user, loading, error, onAddGift, onReload }) => html`
    <gift-dashboard
      .user=${user}
      ?loading=${loading}
      error=${error}
      @add-gift=${onAddGift}
      @dashboard-reload=${onReload}
    ></gift-dashboard>
  `,
  argTypes: {
    onAddGift: { table: { disable: true } },
    onReload: { table: { disable: true } },
  },
  args: { user, loading: false, error: "", onAddGift: fn(), onReload: fn() },
};

// Waits for gift-dashboard and its Carbon children, then returns the action buttons by label.
const renderedDashboard = async (canvasElement) => {
  const host = canvasElement.querySelector("gift-dashboard");
  await host.updateComplete;
  const buttons = [...host.shadowRoot.querySelectorAll(".actions cds-button")];
  await Promise.all(buttons.map((button) => button.updateComplete));
  const byLabel = (label) => buttons.find((button) => button.textContent.trim() === label);
  return { addGift: byLabel("Add Gift"), reload: byLabel("Reload data") };
};

export const Default = {};
export const Loading = { args: { user: null, loading: true } };
export const NoPeople = { args: { user: { fullName: "Test User 1", people: [] } } };
export const LoadError = { args: { user: null, error: "API request to /user/1 failed: 500" } };

export const ActionButtonsEmitEvents = {
  play: async ({ canvasElement, args, step }) => {
    const { addGift, reload } = await renderedDashboard(canvasElement);
    await step("Click Add Gift", async () => {
      await userEvent.click(addGift);
      await waitFor(() => expect(args.onAddGift).toHaveBeenCalledTimes(1));
      expect(args.onReload).not.toHaveBeenCalled();
    });
    await step("Click Reload data", async () => {
      await userEvent.click(reload);
      await waitFor(() => expect(args.onReload).toHaveBeenCalledTimes(1));
      expect(args.onAddGift).toHaveBeenCalledTimes(1);
    });
  },
};

export const LoadingBlocksActions = {
  args: { user: null, loading: true },
  play: async ({ canvasElement, args, step }) => {
    const { addGift, reload } = await renderedDashboard(canvasElement);
    await step("Both buttons are disabled while loading", async () => {
      expect(addGift.disabled).toBe(true);
      expect(reload.disabled).toBe(true);
    });
    await step("Clicking them emits nothing", async () => {
      await userEvent.click(addGift);
      await userEvent.click(reload);
      expect(args.onAddGift).not.toHaveBeenCalled();
      expect(args.onReload).not.toHaveBeenCalled();
    });
  },
};
