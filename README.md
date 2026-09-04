# OZ-CSC-480-HCI-521-Fall-2026-Public

For the Oswego Students of CSC480/HCI521 Fall 2026 (Software Design). See the [wiki](../../wiki) for course context, team rosters/workflow, branching & PR conventions, and in-progress architecture decisions.

## About this project

We're building a **thoughtful gift-giving and tracking application**, a tool to replace the scattered mess of iPhone Notes, browser bookmarks, and email receipts people currently use to remember gift ideas, sizes/preferences, what's already been given, and what's still on a wishlist.

Core problems we're solving for:
- Gift-givers lose track of ideas seen in stores/social media, forget who they've already bought for, and lose receipts needed for returns.
- Gift-givers want a shareable record of preferences/sizes for the people they buy for, plus a history of what's been given per person/per year and rough cost tracking.
- Gift-receivers want an easy way to share what they'd like, and relevant details about themselves, with the people buying for them.

### Required technologies

Per the course's technical requirements, the web application must be built using:

- **[Open Liberty](https://openliberty.io/)** as the web/application server
- **[JSON Web Tokens (JWT)](https://jwt.io/introduction)** for authentication
- **Microservices architecture** using **[Eclipse MicroProfile](https://microprofile.io/)**
- **Maven**, typically with the [Liberty Maven plugin](https://github.com/OpenLiberty/ci.maven) for local dev (`mvn liberty:dev`), packaging, and deployment

Other constraints:
- No mobile app needed, web only.
- The application must implement QA/audit logging.
- The solution must meet minimum accessibility standards (WCAG-aligned).

Helpful references from class:
- [Open Liberty product page](https://openliberty.io/)
- [Open Liberty basic tutorial](https://openliberty.io/guides/)
- [microprofile-starter sample app](https://github.com/ayoho/microprofile-starter)
- [Open Liberty source](https://github.com/OpenLiberty/open-liberty)

Everything not listed above (frontend framework, CI/CD tooling, database, deployment target) is still an open decision. It's tracked as ADRs on the wiki under [Decisions](../../wiki/Decisions), not decided here.

## Getting started

### Prerequisites

- JDK (version TBD, confirm with the team once the project's target Java version is set)
- [Maven](https://maven.apache.org/install.html)
- Git

### Build and run locally

```bash
# Clone the repo
git clone https://github.com/Paul-Austin-Oswego-CSC480-HCI521/OZ-CSC-480-HCI-521-Fall-2026-Public.git
cd OZ-CSC-480-HCI-521-Fall-2026-Public

# Build and start the server in dev mode (live reload, no manual rebuild/redeploy)
mvn liberty:dev
```

Once running, the app is available at `http://localhost:9080` (or whatever port is configured in `server.xml`).

> Fill in module-specific build/run instructions here as the project's services/modules take shape.

## Project structure

```
.
├── src/
│   ├── main/
│   │   ├── java/        # Application source code (microservices)
│   │   ├── liberty/     # Open Liberty server config (server.xml, etc.)
│   │   └── webapp/      # Static web content (HTML/JS/CSS), if applicable
│   └── test/            # Unit and integration tests
├── pom.xml              # Maven project config
└── README.md
```

_(Update this section once the actual module/service layout is finalized. This will likely grow into multiple services, e.g. user profiles, gift lists, wishlists.)_

## Testing

Testing isn't an afterthought. We're using Agile methodology and Test-Driven Development, and validating with System Verification Testing (SVT) before merging significant features:

- **Unit tests (TDD):** write tests alongside/before implementation; run via `mvn test`.
- **System Verification Testing (SVT):** SVT acts as the "first customer" for the app. It doesn't test every combination, but validates that a full end-to-end flow works (e.g., a request traveling from the front end through the REST layer to the database and back), including any auth/token propagation. Include basic usability testing here too: can someone follow this README to get the app running from scratch?
- **Load/stress testing:** tools like [JMeter](https://github.com/apache/jmeter) can be used to run multiple threads / stress-test the app, once there's a running service to point it at.
- **CI/CD:** not finalized, see the [CI/CD Pipeline ADR](../../wiki/ADR-CI-CD-Pipeline) on the wiki. QA and Full Stack need to coordinate and decide together, so `.github/workflows/` is intentionally empty for now.

## Repo roles

**GitHub admin:** Shauna Keating ([@shkeating](https://github.com/shkeating)). She decides how code is integrated (merge strategy, branch protections, access).
**Build coordinator:** Lin Thant ([@linthantaung-gif](https://github.com/linthantaung-gif)).

For the rest of the team roster by sub-team, see [Teams](../../wiki/Teams) on the wiki; for how the sprint cycle works, see [Team Workflow](../../wiki/Team-Workflow); for branching/PR conventions, see [Branching and Pull Requests](../../wiki/Branching-and-Pull-Requests). Review ownership by path is in [CODEOWNERS](.github/CODEOWNERS).

## A note on AI tool use

Per course policy, AI tools are allowed in this project as long as you're **transparent** about what you used them for (note it in commit messages/PR descriptions where relevant) and **accountable** for the results. You can't blame AI for bugs or bad UI, and your own understanding/identity needs to show through the work.

This README itself was drafted with Claude, by compiling and organizing our class notes, lecture slides, and course materials, not written from scratch by a person first. Treat it as a living document, and correct/expand it as the project evolves.

## Reporting issues

Please use the issue templates when filing [bug reports](.github/ISSUE_TEMPLATE/bug_report.yml) or [feature requests](.github/ISSUE_TEMPLATE/feature_request.yml).

## License

This project is licensed under the terms of the [LICENSE](LICENSE) file in this repository (MIT).

