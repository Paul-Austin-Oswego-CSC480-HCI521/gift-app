const names = [
  "Marvel Dice Throne Battle Chest",
  "Project L",
  "We Didn't Playtest This at All",
  "Picky Eaters",
  "Dutz Blitz",
  "Betrayal at the House on the Hill",
  "Skull King",
  "Cascadia",
  "Azul",
];

export const wishlistItems = names.map((giftName, index) => ({
  id: index + 1,
  giftName,
  value: "25.00",
  priority: index % 2 ? "Low" : "High",
  status: index % 3 ? "Wanted" : "Received",
  added: "2026-10-27",
}));
