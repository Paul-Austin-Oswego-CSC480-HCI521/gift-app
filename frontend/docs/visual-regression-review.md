# Visual regression review (Chromatic)

We use [Chromatic](https://www.chromatic.com/) (made by the Storybook maintainers) to catch unintended visual changes: it publishes every Storybook story as a snapshot and diffs it against the last accepted version, so a reviewer can see exactly what changed pixel-for-pixel, not just read the code diff.

It has a free tier (thousands of snapshots/month, no credit card, no self-hosted infrastructure to run) which is why we picked it over alternatives like Percy or Loki for a beginner student team.

## How it works today (manual)

CI/CD isn't decided yet for this repo (see the wiki's [ADR: CI/CD Pipeline](../../../../wiki/ADR-CI-CD-Pipeline) — it needs joint QA + Full Stack sign-off), so Chromatic isn't wired into pull requests automatically. Until it is:

1. Before opening a PR that changes any component/story, run:
   ```bash
   npm run chromatic
   ```
   (needs a `CHROMATIC_PROJECT_TOKEN` env var — ask a Frontend lead for it, don't commit it)
2. Chromatic prints a build URL when it finishes. Paste that link into your PR description.
3. If Chromatic flags visual changes, review the diffs it shows at that URL. If they're intentional, accept them there (this becomes the new baseline for future comparisons). If they're not, that's a bug — fix it before merging.
4. Reviewers: check the linked Chromatic build for accepted/pending diffs as part of reviewing the PR, alongside the normal code review.

## How it'll work later (once CI is decided)

See the wiki's [Frontend CI Proposal](../../../../wiki/Frontend-CI-Proposal) — the plan is for this to run automatically on every PR once QA and Full Stack agree on a CI approach, so this manual step goes away.

## Note for CODEOWNERS

Once this is automated, [CODEOWNERS](../.github/CODEOWNERS) has a note that `/frontend/` review may trigger off changed visual snapshots specifically, rather than the whole folder — revisit that rule when Phase 4's CI proposal is adopted.
