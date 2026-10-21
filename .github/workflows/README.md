# CI/CD workflows

Four workflows are wired up and running today:

- `unit-testing.yml` — runs the backend unit tests (`./mvnw test`) on every push and pull request.
- `frontend-checks.yml` — runs the frontend Carbon lint and unit tests on pull requests targeting `main`.
- `storybook-pages.yml` — builds Storybook and deploys it to GitHub Pages, on pushes to `feature/ui-start`/`main` or a manual run.
- `happo.yml` — runs Happo visual/accessibility regression against the Storybook build, on pushes to `main` and on pull requests targeting `main`. Needs the `HAPPO_API_KEY`/`HAPPO_API_SECRET` repo secrets.

See the wiki's [GitHub Actions Guide](../../wiki/GitHub-Actions-Guide) for how to read a run's status and re-run a failed job, and [ADR: CI/CD Pipeline](../../wiki/ADR-CI-CD-Pipeline) for the decision record.

**The repository-wide CI/CD policy is still open.** These workflows are the current working implementation of the pipeline (the frontend portion is described in the [Frontend CI Proposal](../../wiki/Frontend-CI-Proposal)), not a finalized decision for the whole repo — in particular, whether any checks are required (blocking) rather than advisory, and whether SVT testing runs here too, is still undecided. See [ADR: CI/CD Pipeline](../../wiki/ADR-CI-CD-Pipeline) for what's settled and what isn't.

**The QA team and Full Stack team need to coordinate and decide on the rest of this together.** CI/CD touches both how QA runs tests and how Full Stack builds/deploys, so it shouldn't be picked unilaterally by either side. If you're adding a new workflow, loop in QA, Full Stack, the build coordinator, and the GitHub admin first, so we don't end up with two different pipelines.
