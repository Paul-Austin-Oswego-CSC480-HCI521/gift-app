import { afterEach, describe, expect, it } from "vitest";
import "./gift-tile.js";

afterEach(() => {
  document.body.replaceChildren();
});

async function renderGiftTile({ href, centered = false } = {}) {
  const tile = document.createElement("gift-tile");
  if (href !== undefined) tile.href = href;
  tile.centered = centered;
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
    expect(tile.shadowRoot.querySelector(".content slot").assignedElements()[0].textContent).toBe(
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

  it("centers its content when centered is set", async () => {
    const tile = await renderGiftTile({ centered: true });

    expect(tile.shadowRoot.querySelector(".content")).toHaveAttribute("centered");
  });
});
