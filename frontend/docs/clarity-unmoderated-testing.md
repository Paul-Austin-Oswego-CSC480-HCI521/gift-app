# Microsoft Clarity integration

Microsoft Clarity is an analytics tool enabled in the production frontend. It can provide session
recordings, heatmaps, and interaction signals that usability can choose to use when evaluating the
product.

Using Clarity is optional. It does not create a required QA or usability workflow, and no team
member or participant is required to use it. Study design, consent, privacy, masking, retention,
and interpretation belong in the project wiki.

## Implementation

- Package: `@microsoft/clarity` in `frontend/package.json`
- Initialization: `frontend/src/index.js`
- Project ID: the client-side identifier passed to `Clarity.init()` in `frontend/src/index.js`

The project ID is not an API secret. Do not add credentials, access tokens, or other secrets to the
frontend. Keep the initialization in the shared entry point so pages using the frontend entry point
share the same integration.

When changing or removing the integration, update this reference and coordinate with the usability
and QA owners through the project wiki. This document describes the code integration only; it does
not prescribe when or how usability uses Clarity.
