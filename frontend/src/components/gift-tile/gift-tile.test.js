import { afterEach, describe, expect, it } from "vitest";
import "./gift-tile.js";

afterEach(() => {
  document.body.replaceChildren();
});

async function renderGiftTile({ href, type } = {}) {
  const tile = document.createElement("gift-tile");
  if (href !== undefined) tile.href = href;
  if (type) tile.type = type;
  tile.innerHTML = "<span>Gift tile content</span>";
  document.body.append(tile);
  await tile.updateComplete;
  return tile;
}

describe("gift-tile", () => {
  it("uses a Carbon tile for non-link content", async () => {
    const tile = await renderGiftTile();

    expect(tile.shadowRoot.querySelector("cds-tile")).not.toBeNull();
    expect(tile.shadowRoot.querySelector("cds-clickable-tile")).toBeNull();
    expect(tile.shadowRoot.querySelector(".content slot:not([name])").assignedElements()[0].textContent).toBe(
      "Gift tile content"
    );
  });

  it("uses a Carbon clickable tile with link semantics when href is set", async () => {
    const tile = await renderGiftTile({ href: "/gifts" });
    const clickableTile = tile.shadowRoot.querySelector("cds-clickable-tile");

    expect(clickableTile).not.toBeNull();
    expect(clickableTile).toHaveAttribute("href", "/gifts");
    expect(clickableTile).toHaveAttribute("link-role", "link");
    expect(tile.shadowRoot.querySelector("cds-tile")).toBeNull();
  });

  it("defaults to the base type and reflects type for sizing", async () => {
    const tile = await renderGiftTile();
    expect(tile).toHaveAttribute("type", "base");

    tile.type = "person";
    await tile.updateComplete;
    expect(tile).toHaveAttribute("type", "person");
  });

  it("renders an add button that emits gift-tile-add for the add type", async () => {
    const tile = await renderGiftTile({ type: "add" });
    let added = false;
    tile.addEventListener("gift-tile-add", () => (added = true));

    tile.shadowRoot.querySelector("cds-icon-button").click();

    expect(added).toBe(true);
  });

  it("does not render the add button for other types", async () => {
    const tile = await renderGiftTile({ type: "person" });
    expect(tile.shadowRoot.querySelector("cds-icon-button")).toBeNull();
  });
});
