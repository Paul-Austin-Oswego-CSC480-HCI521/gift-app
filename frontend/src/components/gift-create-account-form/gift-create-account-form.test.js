import { afterEach, expect, it, vi } from "vitest";
import "./gift-create-account-form.js";

afterEach(() => document.body.replaceChildren());
async function setup(values = {}) {
  const form = document.createElement("gift-create-account-form");
  document.body.append(form);
  await form.updateComplete;
  const fields = Object.fromEntries(
    [...form.shadowRoot.querySelectorAll("[name]")].map((el) => [el.name, el]),
  );
  for (const [name, value] of Object.entries(values))
    fields[name].value = value;
  const submit = vi.fn();
  form.addEventListener("create-account-submit", submit);
  return {
    form,
    fields,
    submit,
    click: () => form.shadowRoot.querySelector("cds-button").click(),
  };
}
const valid = {
  firstName: " Pat ",
  surname: " Smith ",
  email: " pat@example.com ",
  password: "example-password",
  confirmPassword: "example-password",
};
it("rejects empty fields", async () => {
  const { form, fields, submit, click } = await setup();
  click();
  await form.updateComplete;
  expect(Object.values(fields).every((field) => field.invalid)).toBe(true);
  expect(submit).not.toHaveBeenCalled();
});
it("rejects malformed email and mismatched passwords", async () => {
  const { form, fields, submit, click } = await setup({
    ...valid,
    email: "invalid",
    confirmPassword: "different",
  });
  click();
  await form.updateComplete;
  expect(fields.email.invalid).toBe(true);
  expect(fields.confirmPassword.invalidText).toBe("Passwords must match.");
  expect(submit).not.toHaveBeenCalled();
});
it("emits normalized account details without password confirmation", async () => {
  const { submit, click } = await setup(valid);
  click();
  expect(submit).toHaveBeenCalledTimes(1);
  expect(submit.mock.calls[0][0].detail).toEqual({
    firstName: "Pat",
    surname: "Smith",
    email: "pat@example.com",
    password: "example-password",
  });
  expect(submit.mock.calls[0][0].composed).toBe(true);
  expect(submit.mock.calls[0][0].bubbles).toBe(true);
});
it("supports loading and external errors", async () => {
  const { form, submit, click } = await setup(valid);
  form.loading = true;
  form.errorMessage = "Registration unavailable";
  await form.updateComplete;
  click();
  expect(submit).not.toHaveBeenCalled();
  expect(form.shadowRoot.querySelector("cds-button").disabled).toBe(true);
  expect(
    form.shadowRoot.querySelector("cds-inline-notification").subtitle,
  ).toBe("Registration unavailable");
});
