import "../app/boot-authed.js";
import "../components/gift-preferences-header/gift-preferences-header.js";
import "../components/gift-wishlist-table/gift-wishlist-table.js";
import { loadWishlist, saveWishlistItem } from "../api/wishlist.js";

const table = document.querySelector("gift-wishlist-table");
// Temporary, page-session-only metadata. Replace when the backend exposes these fields.
const metadata = new Map();
const decorate = items => items.map(item => ({ ...item, ...metadata.get(item.id) }));

async function load() {
  table.loading = true;
  try { table.items = decorate(await loadWishlist()); table.error = ""; }
  catch { table.error = "Check your connection and reload the page. You may need to log in again."; }
  finally { table.loading = false; }
}

table.addEventListener("wishlist-save", async event => {
  if (table.saving) return;
  table.saving = true; table.saveError = "";
  const item = event.detail;
  try {
    const saved = await saveWishlistItem(item);
    const id = item.id ?? saved?.id;
    if (id != null) {
      metadata.set(id, { priority: item.priority, status: item.status, added: item.added });
      const updated = { ...item, ...saved, id };
      table.items = item.id != null ? table.items.map(row => row.id === id ? updated : row) : [...table.items, updated];
    }
    table.saving = false;
    table.closeEditor();
    if (id == null) await load();
  } catch {
    table.saveError = "Your item was not saved. Check your connection and try again.";
  } finally { table.saving = false; }
});
load();
