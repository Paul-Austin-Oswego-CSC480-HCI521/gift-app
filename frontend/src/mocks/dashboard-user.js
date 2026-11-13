export const user = {
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
