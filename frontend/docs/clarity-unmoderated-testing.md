# Microsoft Clarity for unmoderated usability testing

Microsoft Clarity is enabled in the frontend as a usability research tool. It can provide session recordings, heatmaps, and interaction signals that help the usability team identify friction in unmoderated test sessions.

## Current setup

- **Provider:** Microsoft Clarity
- **Project ID:** `yjthhigok4`
- **Initialization:** `frontend/src/index.js`
- **Production delivery:** the frontend bundle initializes Clarity when the app loads
- **Local development:** local sessions may also be recorded when the app is run locally

The project ID is a client-side identifier, not an API secret. Do not add credentials, access tokens, or other secrets to the frontend.

## Use it for

- Observing where participants hesitate, abandon a flow, or encounter interaction problems
- Reviewing aggregate behavior alongside task-completion results
- Finding UI issues that should be reproduced and fixed in the product
- Supporting usability findings with evidence from unmoderated sessions

Clarity data is supporting evidence. It does not replace a task script, participant consent, accessibility review, interview notes, or a reproducible defect report.

## Unmoderated testing rules

Before inviting participants:

1. Use test accounts and synthetic gift data. Do not ask participants to enter real names, addresses, payment information, passwords, or other sensitive personal data.
2. Tell participants that interaction analytics and session recording are being used, and obtain the consent required by the study plan and applicable policy.
3. Confirm which pages and tasks are in scope. Avoid collecting sessions from administrative, authentication, or future pages that could contain sensitive data.
4. Record the study date, deployment URL or commit, task script version, and Clarity project used so findings can be reproduced.

When reviewing results:

- Limit access to the usability, QA, and product contributors who need it.
- Remove or avoid sharing recordings that expose participant information.
- Do not use Clarity recordings as the sole basis for identifying an individual or making a high-impact decision.
- Pair a Clarity observation with the task outcome and enough context to explain its significance.

## Suggested study workflow

1. Define the participant task, success criteria, and data boundary.
2. Deploy the candidate build and note its URL and commit.
3. Run a short internal smoke test to confirm that Clarity receives a session without entering real data.
4. Run the unmoderated study with the approved participant notice and test data.
5. Review recordings and aggregate signals, then group findings by task and severity.
6. Create issues with the relevant task, evidence, expected behavior, and reproduction details. Do not attach sensitive recordings to public issues.
7. Retest the affected flow after a fix and document whether the usability finding is resolved.

## Configuration and changes

Clarity is initialized with the npm package in `frontend/src/index.js`:

```js
import Clarity from "@microsoft/clarity";

Clarity.init("yjthhigok4");
```

Keep initialization in the shared entry point so every page using the frontend entry receives the same configuration. If the project ID changes, update this file and this document in the same pull request. If consent behavior or data masking requirements change, consult the usability and QA leads before changing the integration.

## Verification before a study

From `frontend/`:

```bash
npm install
npm run build
npm run dev
```

Open the app in a test browser, complete a synthetic task, and verify the session in the Clarity project before starting participant recruitment. Do not use a participant's real personal information for this check.

## Ownership

The usability team owns study design and interpretation. Frontend owns the integration. QA coordinates privacy, accessibility, and release checks. Questions about consent, masking, retention, or access should be resolved with the usability and QA leads before a study begins.
