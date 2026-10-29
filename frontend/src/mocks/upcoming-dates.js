// Display-ready mock data for Issue #175. The page owns this data and passes it to the table;
// replace this module with an API-to-display-model transformation when backend integration begins.
export const upcomingDates = [
  {
    id: "mom-birthday-2026",
    daysUntil: 5,
    person: "Mom",
    occasion: {
      name: "Birthday",
      dateLabel: "Mon, Oct 19, 2026",
      category: "birthday",
    },
    giftsToBuy: 0,
    status: "purchased",
    purchaseDateLabel: "Fri, Oct 9, 2026",
    editLabel: "Edit Mom's birthday",
  },
  {
    id: "jordan-anniversary-2026",
    daysUntil: 18,
    person: "Jordan",
    occasion: {
      name: "Anniversary",
      dateLabel: "Sun, Nov 1, 2026",
      category: "anniversary",
    },
    giftsToBuy: 2,
    status: "planned",
    purchaseDateLabel: null,
    editLabel: "Edit Jordan's anniversary",
  },
];
