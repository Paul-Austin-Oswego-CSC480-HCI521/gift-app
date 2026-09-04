# CI/CD workflows

This folder is intentionally empty for now. The team hasn't finalized what we're using for CI/CD yet.

There's a [wiki page](../../wiki/SVT-CI-CD-Flow-with-GitOps-(Student-%26-Free-Tier-Alternative)) with a running list of free/open-source and GitHub Student Developer Pack tooling options (GitHub Actions, Argo CD, JMeter, etc.) worth a look, but that page is just a collection of ideas for what's available at no cost, **not** a decision. Nothing there is finalized or wired up.

**The QA team and Full Stack team need to coordinate and decide on this together** before anything gets added here. CI/CD touches both how QA runs tests and how Full Stack builds/deploys, so it shouldn't be picked unilaterally by either side, or by whoever gets here first. Once there's an agreed-on approach, workflow YAML files (e.g. `ci.yml`) will live here and this note can go away.

If you're picking this up, loop in QA, Full Stack, the build coordinator, and the GitHub admin before adding a workflow, so we don't end up with two different pipelines.

