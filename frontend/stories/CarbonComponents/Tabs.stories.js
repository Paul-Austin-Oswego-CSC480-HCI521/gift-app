import "@carbon/web-components/es/components/tabs/index.js";
import { html } from "lit";
import { expect, userEvent, waitFor } from "storybook/test";

// Line tabs, medium (Gifts frame 1287:1375, Tabs 1287:6514). Selected = semibold with a
// 2px --cds-border-interactive underline; unselected = --cds-text-secondary with a 2px
// --cds-border-subtle underline. Both come straight from Carbon's own tab styles reading the
// brand tokens, so there is no tab-specific CSS in the project.
const TABS = ["All", "Still Needed", "Purchased", "Stored", "Given"];

export default {
  title: "Carbon Components/Tabs",
  render: ({ size }) => html`
    <cds-tabs value="all" size=${size}>
      ${TABS.map(
        (label) => {
          const value = label.toLowerCase().replace(/ /g, "-");
          return html`<cds-tab id="tab-${value}" value=${value}>${label}</cds-tab>`;
        }
      )}
    </cds-tabs>
  `,
  parameters: {
    a11y: {
      config: {
        // The tablist lives in cds-tabs' shadow root and the slotted cds-tab elements are its
        // children, which axe cannot resolve across the shadow boundary (false positive).
        rules: [{ id: "aria-required-parent", enabled: false }],
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["md", "lg"] },
  },
  args: { size: "md" },
};

export const Default = {
  play: async ({ canvasElement, step }) => {
    const tabs = canvasElement.querySelector("cds-tabs");
    const tab = (value) => canvasElement.querySelector(`cds-tab[value="${value}"]`);
    await tabs.updateComplete;

    await step("First tab starts selected", async () => {
      expect(tabs.value).toBe("all");
      expect(tab("all").selected).toBe(true);
    });
    await step("Clicking a tab selects it", async () => {
      await userEvent.click(tab("purchased"));
      await waitFor(() => expect(tabs.value).toBe("purchased"));
      expect(tab("purchased").selected).toBe(true);
      expect(tab("all").selected).toBe(false);
    });
    await step("Arrow keys move between tabs", async () => {
      await userEvent.keyboard("{ArrowRight}");
      await waitFor(() => expect(tabs.value).toBe("stored"));
    });
  },
};
