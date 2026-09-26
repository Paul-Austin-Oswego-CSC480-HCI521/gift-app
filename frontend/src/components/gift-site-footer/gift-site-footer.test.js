import { describe, expect, it } from "vitest";
import { within } from "@testing-library/dom";
import "./gift-site-footer.js";

async function renderSiteFooter() {
  const el = document.createElement("div");
  el.innerHTML = "<gift-site-footer></gift-site-footer>";
  document.body.append(el);
  const footer = el.querySelector("gift-site-footer");
  await footer.updateComplete;
  return footer;
}

describe("gift-site-footer", () => {
  it("renders the three footer links", async () => {
    const footer = await renderSiteFooter();
    const scope = within(footer.shadowRoot);

    expect(scope.getByText("Accessibility Policy")).toBeInTheDocument();
    expect(scope.getByText("About Us")).toBeInTheDocument();
    expect(scope.getByText("Follow Online")).toBeInTheDocument();
  });

  it("renders each link as a cds-link element", async () => {
    const footer = await renderSiteFooter();

    const links = footer.shadowRoot.querySelectorAll("cds-link");
    expect(links).toHaveLength(3);
  });
});
