import { html } from "lit";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { nativeInput, renderedForm, typeInto } from "../../../stories/helpers/shadow.js";
import "./gift-login-form.js";

export default {
  title: "Custom Components/Login Form",
  render: ({ errorMessage, loading, onSubmit }) => html`
    <gift-login-form
      error-message=${errorMessage}
      ?loading=${loading}
      @login-submit=${onSubmit}
    ></gift-login-form>
  `,
  argTypes: {
    errorMessage: { control: "text" },
    loading: { control: "boolean" },
    onSubmit: { table: { disable: true } },
  },
  args: { errorMessage: "", loading: false, onSubmit: fn() },
};
export const Default = {};
export const Error = { args: { errorMessage: "Wrong email or password" } };
export const Loading = { args: { loading: true } };

export const EmptySubmit = {
  play: async ({ canvasElement, args, step }) => {
    const form = await renderedForm(canvasElement, "gift-login-form");
    await step("Submit with nothing filled in", async () => {
      await userEvent.click(form.button);
    });
    await step("Both fields report an error", async () => {
      await waitFor(() => {
        expect(form.named("email")).toHaveProperty("invalidText", "Enter your email address.");
        expect(form.named("password")).toHaveProperty("invalidText", "Enter your password.");
      });
      expect(args.onSubmit).not.toHaveBeenCalled();
    });
  },
};

export const InvalidEmail = {
  play: async ({ canvasElement, args, step }) => {
    const form = await renderedForm(canvasElement, "gift-login-form");
    await step("Fill in a malformed email and a password", async () => {
      await typeInto(form.named("email"), "invalid");
      await typeInto(form.named("password"), "example-password");
    });
    await step("Submit", async () => {
      await userEvent.click(form.button);
    });
    await step("Only the email reports an error", async () => {
      await waitFor(() =>
        expect(form.named("email")).toHaveProperty("invalidText", "Enter a valid email address."),
      );
      expect(form.named("password").invalid).toBe(false);
      expect(args.onSubmit).not.toHaveBeenCalled();
    });
  },
};

export const ValidSubmit = {
  play: async ({ canvasElement, args, step }) => {
    const form = await renderedForm(canvasElement, "gift-login-form");
    await step("Fill in valid credentials and tick Remember me", async () => {
      await typeInto(form.named("email"), " user@example.com ");
      await typeInto(form.named("password"), "example-password");
      await userEvent.click(await nativeInput(form.named("remember-me")));
    });
    await step("Submit", async () => {
      await userEvent.click(form.button);
    });
    await step("login-submit fires once with trimmed email", async () => {
      await waitFor(() => expect(args.onSubmit).toHaveBeenCalledTimes(1));
      expect(args.onSubmit.mock.calls[0][0].detail).toEqual({
        email: "user@example.com",
        password: "example-password",
        rememberMe: true,
      });
    });
  },
};

export const SubmitOnEnter = {
  play: async ({ canvasElement, args, step }) => {
    const form = await renderedForm(canvasElement, "gift-login-form");
    await step("Fill in valid credentials", async () => {
      await typeInto(form.named("email"), "user@example.com");
      await typeInto(form.named("password"), "example-password");
    });
    await step("Press Enter in the password field", async () => {
      await userEvent.keyboard("{Enter}");
    });
    await step("login-submit fires once", async () => {
      await waitFor(() => expect(args.onSubmit).toHaveBeenCalledTimes(1));
    });
  },
};

export const LoadingBlocksSubmit = {
  args: { loading: true },
  play: async ({ canvasElement, args, step }) => {
    const form = await renderedForm(canvasElement, "gift-login-form");
    await step("Controls are disabled while loading", async () => {
      expect(form.button.disabled).toBe(true);
      expect(form.named("email").disabled).toBe(true);
      expect(form.named("password").disabled).toBe(true);
    });
    await step("Clicking the button does not submit", async () => {
      await userEvent.click(form.button);
      expect(args.onSubmit).not.toHaveBeenCalled();
    });
  },
};
