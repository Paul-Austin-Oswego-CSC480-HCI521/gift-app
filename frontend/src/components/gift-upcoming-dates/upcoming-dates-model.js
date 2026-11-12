// Turns the API's people-with-gifts into the display rows <gift-dates-table> renders, and the
// numbers on the three metric tiles. Pure functions, so they are tested without a browser.
const DAY_MS = 24 * 60 * 60 * 1000;
export const SOON_DAYS = 30;

// Date-only strings (2026-10-23) parse as UTC and can show up a day early locally, so pin them to
// local midnight.
export function toDate(value) {
  if (!value) return null;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

// "Mon, Oct 19, 2026", matching the Figma date entries.
export function formatDateLabel(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// The API has no occasion category, so it is read from the occasion name.
export function categoryFor(name = "") {
  if (/birthday/i.test(name)) return "birthday";
  if (/anniversary/i.test(name)) return "anniversary";
  if (/halloween/i.test(name)) return "halloween";
  if (/christmas|thanksgiving|easter|new year|valentine|holiday|hanukkah|diwali/i.test(name)) {
    return "holiday";
  }
  return "other";
}

// One row per person and occasion (not per gift), soonest first. Past occasions and gifts without
// an occasion date are not upcoming dates, so they are left out.
export function buildDateRows(people = [], today = new Date()) {
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  const rows = new Map();

  for (const person of people) {
    for (const gift of person.gifts ?? []) {
      const date = toDate(gift.occasion?.date);
      if (date && date < start) continue;

  const key = `${person.id ?? person.fullName}|${gift.occasion?.name ?? ""}|${gift.occasion?.date ?? "none"}`;
  const name = gift.occasion?.name || (date ? "Occasion" : "No occasion");
      if (!rows.has(key)) {
              rows.set(key, {
                id: key,
                daysUntil: date ? Math.round((date - start) / DAY_MS) : null,
                person: person.fullName,
                occasion: {
                  name,
                  dateLabel: date ? formatDateLabel(date) : "No date",
                  category: date ? categoryFor(name) : "other",
                },
                giftCount: 0,
                giftsToBuy: 0,
                purchasedOn: null,
                editLabel: `Edit ${person.fullName}'s ${name.toLowerCase()}`,
              });
            }

      const row = rows.get(key);
      row.giftCount += 1;
      if (gift.status?.stage === "purchased") {
        const purchased = toDate(gift.purchaseDate);
        if (purchased && (!row.purchasedOn || purchased > row.purchasedOn)) row.purchasedOn = purchased;
      } else {
        row.giftsToBuy += 1;
      }
    }
  }

  return [...rows.values()]
    .sort((a, b) => (a.daysUntil ?? Number.MAX_SAFE_INTEGER) - (b.daysUntil ?? Number.MAX_SAFE_INTEGER))
    .map(({ purchasedOn, ...row }) => {
      const purchased = row.giftCount > 0 && row.giftsToBuy === 0;
      return {
        ...row,
        status: purchased ? "purchased" : "planned",
        purchaseDateLabel: purchased && purchasedOn ? formatDateLabel(purchasedOn) : null,
      };
    });
}

const CATEGORY_LABELS = [
  ["birthday", "birthday", "birthdays"],
  ["anniversary", "anniversary", "anniversaries"],
  ["holiday", "holiday", "holidays"],
  ["other", "other", "other"],
];

const plural = (count, one, many = `${one}s`) => (count === 1 ? one : many);

// The three Figma metric tiles. Halloween is counted as a holiday.
export function summarize(rows = []) {
  const soon = rows.filter((row) => row.daysUntil !== null && row.daysUntil <= SOON_DAYS);
  const counts = {};
  for (const row of soon) {
    const category = row.occasion.category === "halloween" ? "holiday" : row.occasion.category;
    counts[category] = (counts[category] ?? 0) + 1;
  }
  const breakdown = CATEGORY_LABELS.filter(([key]) => counts[key])
    .map(([key, one, many]) => `${counts[key]} ${plural(counts[key], one, many)}`)
    .join(", ");

  const withGiftsToBuy = rows.filter((row) => row.giftsToBuy > 0);
  const giftsToBuy = withGiftsToBuy.reduce((sum, row) => sum + row.giftsToBuy, 0);

  return {
    soon: { value: soon.length, description: breakdown || "Nothing coming up" },
    toBuy: {
      value: giftsToBuy,
      description: `Across ${withGiftsToBuy.length} upcoming ${plural(withGiftsToBuy.length, "date")}`,
    },
    unplanned: {
      value: rows.filter((row) => row.giftCount === 0).length,
      description: "Add ideas before they arrive",
    },
  };
}
