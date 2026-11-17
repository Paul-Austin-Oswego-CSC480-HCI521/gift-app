import { serializePreferences } from "../components/gift-full-preferences/full-preferences-model.js";

export const preferences = {
  "Favorite Colors": "Green, blue", "Shirt Size": "M", "Pant Size": "32",
  "Shoe Size": "9", "Jacket Size": "M", "Dress Size": "",
  "Preferred Fit": "Relaxed", "Style Description": "Casual, solid colors", "Favorite Brands": "Uniqlo",
  "Favorite Foods": "Italian", "Favorite Drinks": "Tea", "Ring Size": "7",
  "Metal Preference": "Silver", Likes: "Books", Dislikes: "Strong fragrances", Interests: "Yoga, travel",
};

// The same values as the API record (camelCase keys) that GET /user/{id}/preferences returns and
// PUT/POST accept. `preferences` above is keyed by display label for stories.

export const preferencesRecord = serializePreferences(preferences);
