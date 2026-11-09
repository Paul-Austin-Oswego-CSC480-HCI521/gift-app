// Named user attributes keep unrelated account data untouched.
const sizes = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const field = (name, options = [], multiple = false) => ({ name, options, multiple });
export const sections = [
  { title: "Favorite Colors", wide: true, fields: [field("Favorite Colors", ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Pink", "Black", "White", "Gray", "Brown"], true)] },
  { title: "Clothing Size", wide: true, fields: [field("Shirt Size", sizes), field("Pant Size", [...sizes, "28", "30", "32", "34", "36", "38", "40"]), field("Shoe Size", Array.from({ length: 12 }, (_, i) => String(i + 4))), field("Jacket Size", sizes), field("Dress Size", [...sizes, "0", "2", "4", "6", "8", "10", "12", "14", "16", "18"])] },
  { title: "Style Preferences", fields: [field("Clothing Style", ["Casual", "Classic", "Sporty", "Formal", "Vintage", "Minimalist"], true), field("Preferred Patterns", ["Solid", "Stripes", "Floral", "Plaid", "Geometric"], true)] },
  { title: "Favorite Brands", fields: [field("Favorite Brands", ["Nike", "Adidas", "Uniqlo", "Levi's", "Patagonia"], true)] },
  { title: "Favorite Food & Drink", fields: [field("Favorite Foods", ["Italian", "Mexican", "Chinese", "Indian", "Japanese", "Vegetarian", "Chocolate"], true), field("Favorite Drinks", ["Coffee", "Tea", "Water", "Juice", "Soda"], true)] },
  { title: "Jewelry Preferences", fields: [field("Ring Size", Array.from({ length: 10 }, (_, i) => String(i + 3))), field("Metal Preference", ["Gold", "Silver", "Rose gold", "Platinum", "No preference"], true)] },
  { title: "Likes", fields: [{ name: "Likes", text: true }] },
  { title: "Dislikes", fields: [{ name: "Dislikes", text: true }] },
  { title: "Interests", wide: true, fields: [field("Interests", ["Yoga", "Gaming", "Travel", "Music", "Reading", "Cooking", "Art", "Sports", "Gardening", "Technology"], true)] },
];
export const fields = sections.flatMap(section => section.fields);
export function readPreferences(attributes = []) {
  return Object.fromEntries(fields.map(field => {
    const value = attributes.find(row => row.attribute_Name === field.name)?.value || "";
    if (!field.multiple) return [field.name, value];
    try { const parsed = JSON.parse(value); if (Array.isArray(parsed)) return [field.name, parsed.map(String)]; } catch { /* Preserve legacy text values. */ }
    return [field.name, value ? value.split(",").map(value => value.trim()).filter(Boolean) : []];
  }));
}
export const serializePreference = value => Array.isArray(value) ? (value.length ? JSON.stringify(value) : "") : String(value ?? "").trim();
