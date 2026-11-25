import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import "./gift-quick-preferences.js";

// jsdom does not implement ResizeObserver, which Carbon's textarea uses.
beforeAll(() => {
  vi.stubGlobal("ResizeObserver", class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
});

afterEach(() => {
  document.body.replaceChildren();
});

async function renderQuickPreferences() {
  const component = document.createElement("gift-quick-preferences");
  document.body.append(component);
  await component.updateComplete;
  return component;
}

describe("gift-quick-preferences", () => {
  it("renders the page heading and four gift tiles", async () => {
    const component = await renderQuickPreferences();

    expect(component.shadowRoot.querySelector("h1")).toHaveTextContent(
      "Gift Preferences: Quick Set Up"
    );

    const tiles = component.shadowRoot.querySelectorAll("gift-tile");
    expect(tiles).toHaveLength(4);

    const headings = Array.from(
      component.shadowRoot.querySelectorAll("gift-tile h2")
    ).map((heading) => heading.textContent.trim());

    expect(headings).toEqual([
      "Basic Information",
      "Likes",
      "Dislikes",
      "Interests",
    ]);
  });

  it("renders a Favorite Colors text field and four size dropdowns", async () => {
    const component = await renderQuickPreferences();
    const selects = Array.from(
      component.shadowRoot.querySelectorAll("cds-select")
    );

    expect(component.shadowRoot.querySelector("cds-text-input")).toHaveAttribute("label", "Favorite Colors");
    expect(selects).toHaveLength(4);
    expect(selects.map((select) => select.getAttribute("label-text"))).toEqual([
      "Shirt Size",
      "Pant Size",
      "Shoe Size",
      "Jacket Size",
    ]);
  });

  it("emits the entered values when the form is submitted", async () => {
    const component = await renderQuickPreferences();
    const save = vi.fn();
    component.addEventListener("preferences-save", save);
    component.shadowRoot.querySelector("cds-text-input").value = "Teal and copper";
    component.shadowRoot.querySelector("form").requestSubmit();
    expect(save).toHaveBeenCalledOnce();
    expect(save.mock.calls[0][0].detail).toMatchObject({ "favorite-color": "Teal and copper" });
  });

  it("renders three textareas with 100-character counters", async () => {
    const component = await renderQuickPreferences();
    const textareas = Array.from(
      component.shadowRoot.querySelectorAll("cds-textarea")
    );

    expect(textareas).toHaveLength(3);
    expect(textareas.map((textarea) => textarea.getAttribute("name"))).toEqual([
      "likes",
      "dislikes",
      "interests",
    ]);

    for (const textarea of textareas) {
      expect(textarea).toHaveAttribute("enable-counter");
      expect(textarea).toHaveAttribute("max-count", "100");
    }
  });
});
