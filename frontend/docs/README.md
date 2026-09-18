# Frontend Documentation Guide

This directory is an index of frontend documentation ownership. Keep short, code-near instructions
here; keep shared decisions, policy, and team process in the project wiki.

## Repository References

- `frontend-structure.md`: where page HTML, Web Components, stories, and styles live.
- `accessibility-checklist.md`: checks to run before opening a frontend PR.
- `api-expectations.md`: the current contract between the frontend and backend.

These documents should change with the code they describe. The API document is explicitly a working
contract until backend endpoints and error shapes are finalized.

## Working References

These files contain useful implementation detail, but their longer-lived policy or rationale belongs
in the wiki. Keep the repository copy short and update it when the implementation changes.

- `carbon-conventions.md`: current Carbon Web Components usage; move shared design conventions and the framework rationale to the wiki.
- `netlify-deployment.md`: current Netlify and backend integration settings; move hosting ownership and environment policy to the wiki.
- `visual-regression-review.md`: current Storybook/Chromatic status; move the tool decision and merge policy to the wiki.
- `clarity-unmoderated-testing.md`: current Clarity integration and study checklist; move privacy, consent, retention, and research governance to the wiki.

## Wiki Navigation

Use the project wiki for information that explains team-wide decisions or processes. Start with:

- [Decisions](../../../wiki/Decisions): architecture decisions and alternatives considered.
- [Frontend Framework ADR](../../../wiki/ADR-Frontend-Framework): Carbon Web Components and HTML entry points.
- [CI/CD Pipeline ADR](../../../wiki/ADR-CI-CD-Pipeline): CI, Storybook, and visual regression policy.
- [Deployment Target ADR](../../../wiki/ADR-Deployment-Target): hosting and environment policy.
- [Front-End team onboarding](../../../wiki/Team-Front-End): frontend setup and conventions.
- [Branching and Pull Requests](../../../wiki/Branching-and-Pull-Requests): shared contribution workflow.

The wiki should provide an index page with these same categories, one canonical page per decision or
process, and links back to repository references. Avoid copying full wiki pages into this directory.

The wiki is the source of truth for those topics. Avoid adding a second long-form explanation to
this repository when the information is shared across teams or likely to change as the project
evolves.

The root `README.md` and this guide should be the repository entry points; the wiki index should be
the entry point for team-wide documentation.

## Documentation Gaps

The following decisions or contracts are referenced but need an owner, status, and ADR or canonical
wiki page before they are treated as settled:

- authentication and JWT issuance/validation, including login and token lifecycle;
- frontend/backend API error format and resource schemas;
- database choice and deployment topology;
- CI/CD ownership and required checks;
- deployment target and production CORS/environment configuration;
- analytics consent, masking, retention, and access rules for Clarity;
- whether Chromatic is adopted and whether visual checks block merges.
