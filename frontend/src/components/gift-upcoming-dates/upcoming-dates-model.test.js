import { describe, expect, it } from "vitest";
import { buildDateRows, categoryFor, summarize } from "./upcoming-dates-model.js";

const today = new Date("2026-10-14T12:00:00");
const gift = (name, date, stage = "updated", purchaseDate = null) => ({
  name,
  occasion: { name: "Birthday", date },
  status: { stage },
  purchaseDate,
});

describe("buildDateRows", () => {
  it("groups gifts into one row per person and occasion, soonest first", () => {
    const rows = buildDateRows(
      [
        { fullName: "Dad", gifts: [gift("Tie", "2026-11-08", "purchased", "2026-10-08")] },
        {
          fullName: "Mom",
          gifts: [gift("Scarf", "2026-10-19"), gift("Book", "2026-10-19", "purchased", "2026-10-09")],
        },
      ],
      today
    );

    expect(rows.map((r) => [r.person, r.daysUntil])).toEqual([["Mom", 5], ["Dad", 25]]);
    expect(rows[0]).toMatchObject({
      giftCount: 2,
      giftsToBuy: 1,
      status: "planned",
      occasion: { name: "Birthday", dateLabel: "Mon, Oct 19, 2026", category: "birthday" },
    });
    expect(rows[1]).toMatchObject({ status: "purchased", purchaseDateLabel: "Thu, Oct 8, 2026" });
  });

  it("leaves out past occasions and gifts without a date", () => {
    const rows = buildDateRows(
      [{ fullName: "Mom", gifts: [gift("Old", "2026-10-01"), { name: "Idea", status: {} }] }],
      today
    );

    expect(rows).toEqual([]);
  });
});

describe("summarize", () => {
  it("counts dates in the next 30 days by category and gifts left to buy", () => {
    const row = (daysUntil, category, giftsToBuy, giftCount = 1) => ({
      daysUntil,
      occasion: { category },
      giftsToBuy,
      giftCount,
    });
    const summary = summarize([
      row(5, "birthday", 2),
      row(10, "birthday", 0),
      row(17, "halloween", 0),
      row(25, "other", 0),
      row(43, "birthday", 1),
      row(50, "other", 0, 0),
    ]);

    expect(summary.soon).toEqual({ value: 4, description: "2 birthdays, 1 holiday, 1 other" });
    expect(summary.toBuy).toEqual({ value: 3, description: "Across 2 upcoming dates" });
    expect(summary.unplanned.value).toBe(1);
  });
});

describe("categoryFor", () => {
  it("reads the category from the occasion name", () => {
    expect(categoryFor("Mom's Birthday")).toBe("birthday");
    expect(categoryFor("Christmas")).toBe("holiday");
    expect(categoryFor("Graduation")).toBe("other");
  });
});
