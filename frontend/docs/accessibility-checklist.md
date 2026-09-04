# Accessibility checklist

The course requires WCAG-aligned accessibility, and it's a big reason we picked Carbon. Carbon's components are accessible by default *when used as documented* — most accessibility bugs come from working around a component instead of using it as intended, or from custom markup that doesn't use Carbon at all. Check this list before opening a PR that touches UI.

## Before opening a PR

- [ ] **Run `npm run test:a11y`.** Runs every Storybook story headlessly and flags accessibility violations (via axe-core, through the Storybook a11y addon). Fix anything it flags, or leave a comment explaining why it's a false positive.
- [ ] **Check the story in Storybook's Accessibility panel too** (`npm run storybook`, select your story, open the "Accessibility" addon tab). It gives more actionable detail than the CLI output — element-level highlighting, WCAG criterion references.
- [ ] **Keyboard navigation:** can you reach and operate everything you built using only Tab / Shift+Tab / Enter / Space / arrow keys? No mouse.
- [ ] **Labels:** every input, button, and icon-only control has an accessible name (visible label, `aria-label`, or Carbon's built-in labeling prop — check the component's docs) — not just a placeholder.
- [ ] **Images/icons:** meaningful images have alt text; decorative ones are marked so screen readers skip them.
- [ ] **Color/contrast:** if you used a Carbon token for color (not a hand-picked hex value), contrast is already handled. If you find yourself picking a custom color, stop and check whether a token fits instead.
- [ ] **Don't fight the component.** If a Carbon component's default behavior seems inaccessible or wrong, it's more likely being used against its documented usage than genuinely broken — check the docs (or ask Shauna, a11y is her focus) before overriding its internals.

## Questions / escalation

Shauna does a11y testing support on QA as well as leading Frontend — flag anything you're unsure about to her rather than guessing.
