// Single list of the app's page routes. The side nav reads it; add a page here, then its HTML
// goes in pages/ and its script in src/pages/. Paths have no .html (Netlify and the dev server
// serve extensionless URLs). `key` is the value a page passes as `active` to the side nav.
export const routes = {
  dashboard: { label: "Dashboard", path: "/dashboard" },
  wishlist: { label: "My Wish List", path: "/my-wishlist" },
  people: { label: "People", path: "/people" },
  dates: { label: "Upcoming Dates", path: "/upcoming-dates" },
  gifts: { label: "All Gifts", path: "/all-gifts" },
  settings: { label: "Settings", path: "/settings" },
  // Targets the side nav can navigate to that do not have pages yet.
  "add-gift": { path: "/add-gift" },
  "add-recipient": { path: "/add-recipient" },
};
