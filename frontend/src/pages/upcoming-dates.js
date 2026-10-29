import "../app/boot-authed.js";
import "../components/gift-dates-table/gift-dates-table.js";
import { upcomingDates } from "../mocks/upcoming-dates.js";

const datesTable = document.querySelector("gift-dates-table");
datesTable.dates = upcomingDates;
