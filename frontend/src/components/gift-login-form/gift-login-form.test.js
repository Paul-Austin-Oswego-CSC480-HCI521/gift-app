import { afterEach, describe, expect, it, vi } from "vitest";
import "./gift-login-form.js";

afterEach(() => {
  document.body.replaceChildren();
});

async function renderForm() {
  const form = document.createElement("gift-login-form");
  document.body.append(form);
  await form.updateComplete;
  const email = form.shadowRoot.querySelector("cds-text-input");
  const password = form.shadowRoot.querySelector("cds-password-input");
  const rememberMe = form.shadowRoot.querySelector("cds-checkbox");
  const button = form.shadowRoot.querySelector("cds-button");
  await Promise.all([
    email.updateComplete,
    password.updateComplete,
    rememberMe.updateComplete,
    button.updateComplete,
  ]);
  return { form, email, password, rememberMe, button };
}

describe("gift-login-form", () => {
  it("provides visible labels and password autocomplete", async () => {
    const { email, password } = await renderForm();
    expect(email.label).toBe("Email");
    expect(password.label).toBe("Password");
    expect(password.autocomplete).toBe("current-password");
  });

  it("rejects missing fields and malformed email without emitting credentials", async () => {
    const { form, email, password, button } = await renderForm();
    const submit = vi.fn();
    form.addEventListener("login-submit", submit);
    button.click();
    await form.updateComplete;
    expect(email.invalid).toBe(true);
    expect(password.invalid).toBe(true);
    email.value = "invalid";
    password.value = "example-password";
    button.click();
    await form.updateComplete;
    expect(email.invalidText).toBe("Enter a valid email address.");
    expect(password.invalid).toBe(false);
    expect(submit).not.toHaveBeenCalled();
  });

  it("emits one bubbling composed event with trimmed email and unchanged password", async () => {
    const { form, email, password, rememberMe, button } = await renderForm();
    const submit = vi.fn();
    document.body.addEventListener("login-submit", submit, { once: true });
    email.value = " user@example.com ";
    password.value = " password with spaces ";
    rememberMe.checked = true;
    button.click();
    expect(submit).toHaveBeenCalledTimes(1);
    const event = submit.mock.calls[0][0];
    expect(event.detail).toEqual({
      email: "user@example.com",
      password: " password with spaces ",
      rememberMe: true,
    });
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
    await form.updateComplete;
  });

  it("defaults remember me to unchecked", async () => {
    const { form, email, password, rememberMe, button } = await renderForm();
    expect(rememberMe.checked).toBe(false);
    const submit = vi.fn();
    form.addEventListener("login-submit", submit);
    email.value = "user@example.com";
    password.value = "example-password";
    button.click();
    expect(submit.mock.calls[0][0].detail.rememberMe).toBe(false);
  });

  it("submits on Enter from the inner password input", async () => {
    const { form, email, password } = await renderForm();
    email.value = "user@example.com";
    password.value = "example-password";
    const submit = vi.fn();
    form.addEventListener("login-submit", submit);
    password.shadowRoot.querySelector("input").dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("blocks submission while loading and renders an external error", async () => {
    const { form, email, password, button } = await renderForm();
    email.value = "user@example.com";
    password.value = "example-password";
    form.setAttribute("loading", "");
    form.setAttribute("error-message", "Wrong email or password");
    await form.updateComplete;
    expect(button.disabled).toBe(true);
    expect(
      form.shadowRoot.querySelector("cds-inline-notification").subtitle,
    ).toBe("Wrong email or password");
    const submit = vi.fn();
    form.addEventListener("login-submit", submit);
    form.shadowRoot
      .querySelector("form")
      .dispatchEvent(new Event("submit", { cancelable: true }));
    expect(submit).not.toHaveBeenCalled();
  });
});
