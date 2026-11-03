// Display-ready rows matching the Figma "Upcoming Dates" frame (5:25841), for stories and tests.
// The page builds the same shape from the API with buildDateRows() in
// components/gift-upcoming-dates/upcoming-dates-model.js.
const row = (id, daysUntil, person, name, category, dateLabel, giftsToBuy, purchaseDateLabel) => ({
  id,
  daysUntil,
  person,
  occasion: { name, dateLabel, category },
  giftCount: 2,
  giftsToBuy,
  status: purchaseDateLabel ? "purchased" : "planned",
  purchaseDateLabel,
  editLabel: `Edit ${person}'s ${name.toLowerCase()}`,
});

export const upcomingDates = [
  row("mom-birthday", 5, "Mom", "Birthday", "birthday", "Mon, Oct 19, 2026", 2, null),
  row("alex-anniversary", 10, "Alex Rivera", "Anniversary", "anniversary", "Sat, Oct 24, 2026", 0, "Sat, Oct 10, 2026"),
  row("sam-halloween", 17, "Sam", "Halloween", "halloween", "Sat, Oct 31, 2026", 0, "Mon, Oct 12, 2026"),
  row("dad-birthday", 25, "Dad", "Birthday", "birthday", "Sun, Nov 8, 2026", 0, "Thu, Oct 8, 2026"),
  row("lee-birthday", 43, "Lee Johnson", "Birthday", "birthday", "Thu, Nov 26, 2026", 0, "Mon, Oct 5, 2026"),
];
