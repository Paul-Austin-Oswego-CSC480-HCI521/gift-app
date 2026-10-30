import "../app/boot-authed.js";
import "@carbon/web-components/es/components/search/index.js";
import "../components/gift-dates-table/gift-dates-table.js";
import "../components/gift-tile/gift-tile.js";
import { apiFetch } from "../api/client.js";
import { getAccessToken, getUserId } from "../auth/token-store.js";


const datesTable = document.querySelector("gift-dates-table");

async function loadPeople() {
  const userId = getUserId();
  const token = getAccessToken();

  if (!userId || !token) {
    console.error("Missing login information.");
    return;
  }

  try {
    const people = await apiFetch(`/user/${userId}/person`, {
      token,
    });

    const gifts = people.flatMap((person) =>
      (person.gifts ?? []).map((gift) => ({
        giftId: gift.id,
        person: person.fullName,
        giftName: gift.name,
        occasion: gift.occasion?.name,
        occasionDate: gift.occasion?.date,
        status: gift.status?.stage,
        purchaseDate: gift.purchaseDate,
      }))
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingGifts = gifts.filter((gift) => {
      if (!gift.occasionDate) return true;

      const occasionDate = new Date(`${gift.occasionDate}T00:00:00`);
      return !Number.isNaN(occasionDate.getTime()) && occasionDate >= today;
    });

    const dateRows = upcomingGifts.map((gift) => {
      const hasDate = Boolean(gift.occasionDate);
      const occasionDate = hasDate
        ? new Date(`${gift.occasionDate}T00:00:00`)
        : null;
      const purchased = gift.status === "purchased";
      const occasionName = gift.occasion || "Occasion";

      return {
        id: gift.giftId,
        daysUntil: hasDate
          ? Math.round((occasionDate - today) / (24 * 60 * 60 * 1000))
          : "N/A",
        person: gift.person,
        occasion: {
          name: occasionName,
          dateLabel: gift.occasionDate || "Date not set",
          category: "other",
        },
        giftsToBuy: purchased ? 0 : 1,
        status: purchased ? "purchased" : "planned",
        purchaseDateLabel: purchased ? gift.purchaseDate : null,
        editLabel: `Edit ${gift.person}'s ${occasionName.toLowerCase()}`,
      };
    });

    datesTable.dates = dateRows;
  } catch (error) {
    datesTable.dates = [];
    console.error("Could not load upcoming dates:", error);
  }
}

loadPeople();
