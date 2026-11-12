const sizes = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const field = (name, key, options) => ({ name, key, options });
export const sections = [
  { title: "Favorite Colors", wide: true, fields: [field("Favorite Colors", "favoriteColor")] },
  { title: "Clothing Size", wide: true, fields: [field("Shirt Size", "shirtSize", sizes), field("Pant Size", "pantSize", [...sizes, "28", "30", "32", "34", "36", "38", "40"]), field("Shoe Size", "shoeSize", Array.from({ length: 12 }, (_, i) => String(i + 4))), field("Jacket Size", "jacketSize", sizes), field("Dress Size", "dressSize", [...sizes, "0", "2", "4", "6", "8", "10", "12", "14", "16", "18"])] },
  { title: "Style Preferences", fields: [field("Preferred Fit", "preferredFit"), field("Style Description", "styleDescription")] },
  { title: "Favorite Brands", fields: [field("Favorite Brands", "favoriteBrands")] },
  { title: "Favorite Food & Drink", fields: [field("Favorite Foods", "favoriteFoods"), field("Favorite Drinks", "favoriteDrinks")] },
  { title: "Jewelry Preferences", fields: [field("Ring Size", "ringSize", Array.from({ length: 10 }, (_, i) => String(i + 3))), field("Metal Preference", "metalPreference", ["Gold", "Silver", "Rose gold", "Platinum", "No preference"])] },
  { title: "Likes", fields: [{ ...field("Likes", "likes"), multiline: true }] },
  { title: "Dislikes", fields: [{ ...field("Dislikes", "dislikes"), multiline: true }] },
  { title: "Interests", wide: true, fields: [field("Interests", "interests")] },
];
export const fields = sections.flatMap(section => section.fields);
export const readPreferences = record => Object.fromEntries(fields.map(({ name, key }) => [name, record?.[key] ?? ""]));
export const serializePreferences = values => Object.fromEntries(fields.map(({ name, key }) => [key, String(values[name] ?? "").trim()]));
