# Visual regression review (Chromatic)
# Visual Regression Review

> **Wiki candidate:** The wiki should own the team's visual-regression policy and tool decisions.
> This file records only the current repository commands and interim status until that move is
> complete.

**We have not decided to adopt Chromatic.** `npm run chromatic` and the `chromatic` devDependency exist in `package.json` as tooling that's *ready to wire in*, not a tool the team has committed to using. The [Frontend CI Proposal](../../../../wiki/Frontend-CI-Proposal) on the wiki lays out Chromatic as one candidate for visual regression review, alongside open questions (free-tier snapshot limits, whether live Storybook hosting is included on the free plan, who owns the token) that haven't been resolved. Until those are answered and the team explicitly decides to use it, treat anything below as "how it would work if we adopt it," not current process.

[Chromatic](https://www.chromatic.com/) (made by the Storybook maintainers) publishes every Storybook story as a snapshot and diffs it against the last accepted version, so a reviewer can see exactly what changed pixel-for-pixel, not just read the code diff. It's a candidate over alternatives like Percy or Loki mainly because of its free tier (billed snapshots/month, no credit card) — see the Frontend CI Proposal for the full pros/cons writeup.

## What's actually true today

- Storybook itself **is** published today, but via GitHub Pages (see [Storybook Guide](../../../../wiki/Storybook-Guide) and [.github/workflows/storybook-pages.yml](../../.github/workflows/storybook-pages.yml)), not Chromatic. That gives a shared, always-current Storybook for `main`, but no per-PR visual diffing.
- Nothing in CI runs Chromatic automatically. There's no required check, and no PR is blocked on it.
- No `CHROMATIC_PROJECT_TOKEN` is guaranteed to exist yet — if you want to try it, confirm with a Frontend lead whether a token/account exists before running `npm run chromatic`.

## If you want to try it manually anyway

This isn't a required step, but if you have a token and want a visual diff while the team evaluates Chromatic:

1. Run `npm run chromatic` (needs `CHROMATIC_PROJECT_TOKEN` — ask a Frontend lead, don't commit it).
2. Chromatic prints a build URL when it finishes — paste that link into your PR description if you want reviewers to see it.
3. Treat any diffs it shows as informational for now, not a merge gate.

## Where the real decision lives

- [ADR: CI/CD Pipeline](../../../../wiki/ADR-CI-CD-Pipeline) — status is still **Proposed, no decision yet**; needs joint QA + Full Stack sign-off before anything (Chromatic included) becomes a required check.
- [Frontend CI Proposal](../../../../wiki/Frontend-CI-Proposal) — the frontend-specific input to that ADR, including the Chromatic cost/capability analysis and open questions. Not itself a decision.

Once the team actually decides to adopt Chromatic (and wires it into CI), update this doc to describe the real, enforced process — including whether it's a blocking or advisory check, per the open question on that proposal page.

## Note for CODEOWNERS

Once/if this is automated, [CODEOWNERS](../.github/CODEOWNERS) has a note that `/frontend/` review may trigger off changed visual snapshots specifically, rather than the whole folder — revisit that rule when the CI/CD ADR is decided.

