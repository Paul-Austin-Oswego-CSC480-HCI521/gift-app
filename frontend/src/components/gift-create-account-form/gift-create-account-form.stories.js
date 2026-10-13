import { html } from "lit";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { renderedForm, typeInto } from "../../../stories/helpers/shadow.js";
import "./gift-create-account-form.js";

export default {
  title: "Custom Components/Create Account Form",
  render: ({ errorMessage, loading, onSubmit }) => html`
    <gift-create-account-form
      error-message=${errorMessage}
      ?loading=${loading}
      @create-account-submit=${onSubmit}
    ></gift-create-account-form>
  `,
  argTypes: {
    errorMessage: { control: "text" },
    loading: { control: "boolean" },
    onSubmit: { table: { disable: true } },
  },
  args: { errorMessage: "", loading: false, onSubmit: fn() },
};
export const Default = {};
export const Error = {
  args: { errorMessage: "Unable to create your account. Please try again." },
};
// WCAG 1.4.3 exempts inactive (disabled) components from contrast requirements,
// but axe can't tell that Carbon's disabled password labels belong to disabled inputs.
export const Loading = {
  args: { loading: true },
  parameters: { a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } } },
};

const fillIn = async (form, values) => {
  for (const [name, text] of Object.entries(values)) {
    await typeInto(form.named(name), text);
  }
};

export const EmptySubmit = {
  play: async ({ canvasElement, args, step }) => {
    const form = await renderedForm(canvasElement, "gift-create-account-form");
    await step("Submit with nothing filled in", async () => {
      await userEvent.click(form.button);
    });
    await step("Every field reports an error", async () => {
      await waitFor(() => {
        expect(form.named("firstName")).toHaveProperty("invalidText", "Enter your first name.");
        expect(form.named("surname")).toHaveProperty("invalidText", "Enter your last name.");
        expect(form.named("email")).toHaveProperty("invalidText", "Enter your email address.");
        expect(form.named("password")).toHaveProperty("invalidText", "Enter a password.");
        expect(form.named("confirmPassword")).toHaveProperty("invalidText", "Confirm your password.");
      });
      expect(args.onSubmit).not.toHaveBeenCalled();
    });
  },
};

export const InvalidEmail = {
  play: async ({ canvasElement, args, step }) => {
    const form = await renderedForm(canvasElement, "gift-create-account-form");
    await step("Fill in everything but use a malformed email", async () => {
      await fillIn(form, {
        firstName: "Jane",
        surname: "Cooper",
        email: "invalid",
        password: "example-password",
        confirmPassword: "example-password",
      });
      await userEvent.click(form.button);
    });
    await step("Only the email reports an error", async () => {
      await waitFor(() =>
        expect(form.named("email")).toHaveProperty("invalidText", "Enter a valid email address."),
      );
      expect(form.named("firstName").invalid).toBe(false);
      expect(args.onSubmit).not.toHaveBeenCalled();
    });
  },
};

export const MismatchedPasswords = {
  play: async ({ canvasElement, args, step }) => {
    const form = await renderedForm(canvasElement, "gift-create-account-form");
    await step("Fill in different passwords", async () => {
      await fillIn(form, {
        firstName: "Jane",
        surname: "Cooper",
        email: "jane@example.com",
        password: "example-password",
        confirmPassword: "something-else",
      });
      await userEvent.click(form.button);
    });
    await step("Confirm password reports a mismatch", async () => {
      await waitFor(() =>
        expect(form.named("confirmPassword")).toHaveProperty("invalidText", "Passwords must match."),
      );
      expect(args.onSubmit).not.toHaveBeenCalled();
    });
  },
};

export const ValidSubmit = {
  play: async ({ canvasElement, args, step }) => {
    const form = await renderedForm(canvasElement, "gift-create-account-form");
    await step("Fill in valid details", async () => {
      await fillIn(form, {
        firstName: " Jane ",
        surname: "Cooper",
        email: "jane@example.com",
        password: "example-password",
        confirmPassword: "example-password",
      });
    });
    await step("Submit", async () => {
      await userEvent.click(form.button);
    });
    await step("create-account-submit fires once with trimmed values", async () => {
      await waitFor(() => expect(args.onSubmit).toHaveBeenCalledTimes(1));
      expect(args.onSubmit.mock.calls[0][0].detail).toEqual({
        firstName: "Jane",
        surname: "Cooper",
        email: "jane@example.com",
        password: "example-password",
      });
    });
  },
};
