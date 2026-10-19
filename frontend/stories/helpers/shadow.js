import { userEvent, waitFor } from "storybook/test";

// Testing Library can't see into shadow roots, and Carbon inputs nest a second shadow root
// inside our forms. These helpers reach the real elements a user interacts with.

/** Finds a form host in the canvas and waits for it and its Carbon children to render. */
export async function renderedForm(canvasElement, tag) {
  const host = canvasElement.querySelector(tag);
  await host.updateComplete;
  const root = host.shadowRoot;
  await Promise.all(
    [...root.querySelectorAll("*")].map((el) => el.updateComplete),
  );
  return {
    host,
    root,
    named: (name) => root.querySelector(`[name="${name}"]`),
    button: root.querySelector("cds-button"),
  };
}

/** The native <input> inside a Carbon input, once it has rendered. */
export async function nativeInput(carbonEl) {
  await carbonEl.updateComplete;
  return carbonEl.shadowRoot.querySelector("input");
}

/** Types into a Carbon input the way a user would. */
export async function typeInto(carbonEl, text) {
  const input = await nativeInput(carbonEl);
  await userEvent.click(input);
  await userEvent.type(input, text);
}

/** Waits for Lit to re-render a form after an interaction. */
export const settled = (host) => waitFor(() => host.updateComplete);
