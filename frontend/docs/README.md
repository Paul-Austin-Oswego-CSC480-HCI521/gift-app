# Frontend Code References

Keep this directory limited to short references that a person or coding assistant needs while
changing frontend code. The repository is not the source of truth for QA, usability research,
deployment policy, or other team processes.

## Repository References

- `frontend-structure.md`: where page HTML, Web Components, stories, and styles live.
- `carbon-conventions.md`: current Carbon Web Components usage and the coding conventions that follow from it.
- `api-expectations.md`: the working contract between the frontend and backend.
- `clarity-unmoderated-testing.md`: how the production Clarity integration works; using it for usability work is optional.

These documents should change with the code they describe. The API document is explicitly a working
contract until backend endpoints and error shapes are finalized.

## Wiki Navigation

Use the project wiki for decisions, policy, and team processes. Start with:

- [Decisions](../../../wiki/Decisions): architecture decisions, alternatives, QA, usability, analytics, and topics without a dedicated wiki page yet.
- [Frontend Framework ADR](../../../wiki/ADR-Frontend-Framework): Carbon Web Components and HTML entry points.
- [CI/CD Pipeline ADR](../../../wiki/ADR-CI-CD-Pipeline): CI, Storybook, and visual regression policy.
- [Deployment Target ADR](../../../wiki/ADR-Deployment-Target): hosting and environment policy.
- [Front-End team onboarding](../../../wiki/Team-Front-End): frontend setup and conventions.
- [Branching and Pull Requests](../../../wiki/Branching-and-Pull-Requests): shared contribution workflow.

The wiki is the source of truth for shared decisions and process. Add a dedicated wiki page when a
topic grows beyond a code reference; do not copy the full wiki page into this directory.
