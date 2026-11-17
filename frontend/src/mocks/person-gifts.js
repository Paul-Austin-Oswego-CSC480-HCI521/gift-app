// People with gifts and occasions, for the person profile, upcoming dates and e2e tests. The shape
// matches what GET /user/{uid}/person and GET /user/{uid}/person/{pid} return: a gift has a status
// stage and an optional occasion { name, date }. Dates are relative to today so they always count
// as upcoming (the upcoming-dates model drops past occasions). Stories that need fixed dates should
// keep using dashboard-user.js.
import { people } from "./people.js";

// Local date as YYYY-MM-DD, n days from now.
export function daysFromNow(n) {
  const date = new Date();
  date.setDate(date.getDate() + n);
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Gifts by person id. Person 1 has two occasions and a purchased gift; person 2 has one gift;
// everyone else has none, which covers the empty state.
export function buildGiftsByPerson() {
  return {
    1: [
      {
        id: 101,
        name: "Noise-cancelling headphones",
        type: "gift",
        quantity: 1,
        status: { stage: "updated" },
        occasion: { name: "Birthday", date: daysFromNow(12) },
      },
      {
        id: 102,
        name: "Hiking boots",
        type: "gift",
        quantity: 1,
        status: { stage: "purchased" },
        occasion: { name: "Holiday", date: daysFromNow(40) },
        purchaseDate: daysFromNow(-3),
      },
    ],
    2: [
      {
        id: 103,
        name: "Ceramic planter",
        type: "gift",
        quantity: 1,
        status: { stage: "updated" },
        occasion: { name: "Anniversary", date: daysFromNow(25) },
      },
    ],
  };
}

// The same people as people.js, each with their gifts. Pass a gifts map to share state.
export function buildPeopleWithGifts(giftsByPerson = buildGiftsByPerson()) {
  return people.map((person) => ({ ...person, attributes: [], gifts: giftsByPerson[person.id] ?? [] }));
}
