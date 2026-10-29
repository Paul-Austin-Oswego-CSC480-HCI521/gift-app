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
          status: { stage: "updated" },
          occasion: { name: "Birthday", date: "2099-11-14" },
          purchaseDate: null,
        },
        {
          name: "Trail running shoes",
          type: "Physical",
          status: { stage: "purchased" },
          occasion: { name: "Holiday", date: "2099-12-25" },
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
  render: ({ user, loading, error, onAddPerson, onAddGift, onAddDate }) => html`
    <gift-dashboard
      .user=${user}
      ?loading=${loading}
      error=${error}
      @add-person=${onAddPerson}
      @add-gift=${onAddGift}
      @add-date=${onAddDate}
    ></gift-dashboard>
  `,
  argTypes: {
    onAddPerson: { table: { disable: true } },
    onAddGift: { table: { disable: true } },
    onAddDate: { table: { disable: true } },
  },
  args: {
    user,
    loading: false,
    error: "",
    onAddPerson: fn(),
    onAddGift: fn(),
    onAddDate: fn(),
  },
};

// Waits for gift-dashboard and its Carbon children, then returns the action buttons by label.
const renderedDashboard = async (canvasElement) => {
  const host = canvasElement.querySelector("gift-dashboard");
  await host.updateComplete;
  const cards = [...host.shadowRoot.querySelectorAll("dashboard-card")];
  await Promise.all(cards.map((card) => card.updateComplete));
  const buttons = cards.map((card) => card.shadowRoot.querySelector("cds-button"));
  await Promise.all(buttons.map((button) => button.updateComplete));
  const [addPerson, addGift, addDate] = buttons;
  return { addPerson, addGift, addDate };
};

export const Default = {};
export const Loading = { args: { user: null, loading: true } };
export const NoPeople = { args: { user: { fullName: "Test User 1", people: [] } } };
export const LoadError = { args: { user: null, error: "API request to /user/1 failed: 500" } };

export const AddButtonsEmitEvents = {
  play: async ({ canvasElement, args, step }) => {
    const { addPerson, addGift, addDate } = await renderedDashboard(canvasElement);
    await step("Click Add Person", async () => {
      await userEvent.click(addPerson);
      await waitFor(() => expect(args.onAddPerson).toHaveBeenCalledTimes(1));
      expect(args.onAddGift).not.toHaveBeenCalled();
    });
    await step("Click Add Gift", async () => {
      await userEvent.click(addGift);
      await waitFor(() => expect(args.onAddGift).toHaveBeenCalledTimes(1));
      expect(args.onAddDate).not.toHaveBeenCalled();
    });
    await step("Click Add Date", async () => {
      await userEvent.click(addDate);
      await waitFor(() => expect(args.onAddDate).toHaveBeenCalledTimes(1));
    });
  },
};

export const LoadingBlocksActions = {
  args: { user: null, loading: true },
  play: async ({ canvasElement, args, step }) => {
    const { addPerson, addGift, addDate } = await renderedDashboard(canvasElement);
    await step("All three Add buttons are disabled while loading", async () => {
      for (const button of [addPerson, addGift, addDate]) expect(button.disabled).toBe(true);
    });
    await step("Clicking them emits nothing", async () => {
      for (const button of [addPerson, addGift, addDate]) await userEvent.click(button);
      expect(args.onAddPerson).not.toHaveBeenCalled();
      expect(args.onAddGift).not.toHaveBeenCalled();
      expect(args.onAddDate).not.toHaveBeenCalled();
    });
  },
};
