# Platform base — what's in the repo and why

_Owner: Group A, Platform and data (Merve) · Covers: Days 1–2 of the platform setup_

This is the base every group builds on. Three ideas hold it together:

1. **One repo, three packages** — the API, the web app, and a shared package both of them import.
2. **Shared contracts** — data shapes are defined once and checked on both sides.
3. **Team rules written down** — so four people can work in parallel without stepping on each other.

The day-to-day rules (branches, commits, pull requests, issues) are in [CONTRIBUTING.md](../../CONTRIBUTING.md). This doc follows them and only adds what is specific to the platform base.

---

## What this means for you

**Get it running** — full guide, Podman setup and troubleshooting in [getting-started.md](getting-started.md)

```bash
make               # the full stack in containers → https://localhost:8443
pnpm dev           # local development with reload → http://localhost:5173
```

Both show "Showcase Room" and "API: ok".

**Where your code goes**

| Group                                       | API (NestJS)                              | Web (React)                                         |
| ------------------------------------------- | ----------------------------------------- | --------------------------------------------------- |
| A · Platform and data (Merve)               | `apps/api/src/common/`, `modules/system/` | `apps/web/src/app/`, `src/i18n/`                    |
| B · Identity, UI kit and room (Benjamin)    | `apps/api/src/modules/identity/`          | `apps/web/src/features/identity/`, `features/room/` |
| C · Social and docs (owner to be confirmed) | `apps/api/src/modules/social/`            | `apps/web/src/features/social/`                     |
| D · Content (Samira)                        | `apps/api/src/modules/content/`           | `apps/web/src/features/content/`                    |

Types and Zod schemas that both sides need go in `packages/shared/src/` — but that folder is a **contract**: agree on a change with the groups that use it first (the **Contract change** issue form helps), then follow CONTRIBUTING §3.2 for breaking changes.

**Three rules to remember**

- Use `pnpm`, never `npm install`.
- Never push to `main` — branch, then open a PR (Pull Request), as in CONTRIBUTING §1.
- No hard-coded UI text (i18n arrives on Day 5) and no secrets in git.

---

## Repository layout

```
apps/
  api/                 NestJS API (REST + WebSocket)
  web/                 React + Vite front end
packages/
  shared/              @ft/shared — types + Zod schemas used by both apps (the contract package)
infra/proxy/           nginx: HTTPS, serves the web build, forwards /api and /socket.io
documentation/
  platform/            platform docs (this file, more to come)
  decisions/           decision records: why we chose what we chose
scripts/               one-off tooling (GitHub setup)
docker-compose.yml     the three services: db, api, proxy
Makefile               shortcuts: make, make ps, make logs, make down, make clean
.github/               CI, issue/PR templates, CODEOWNERS
```

Empty folders contain a `.gitkeep` file — git doesn't track empty folders, so this keeps the planned structure visible.

---

## 1. The monorepo

**`pnpm-workspace.yaml`** — tells pnpm this repo holds several packages (`apps/*`, `packages/*`) and links them together, so the API can `import … from '@ft/shared'` as if it were an npm library. It also lists which dependencies may run install scripts (pnpm 10 blocks them by default for security; esbuild needs one).

**Root `package.json`** — the team's shared commands: `pnpm build`, `dev`, `lint`, `typecheck`, `test`, `format`. `build` compiles `@ft/shared` first because the other two depend on it. `packageManager` pins the exact pnpm version and `engines` requires Node 22.12+.

**`pnpm-lock.yaml`** — generated, never edited by hand. Records the exact version of every dependency so everyone and CI install the same thing.

**Why a monorepo?** A change to a shared type and the code that uses it land in the same PR; nobody publishes packages to anybody.

---

## 2. TypeScript configuration

There are four config files — one base at the root, one per package:

```
tsconfig.base.json                ← root: rules shared by everyone
packages/shared/tsconfig.json
apps/api/tsconfig.json            (+ tsconfig.build.json, used only by `nest build`)
apps/web/tsconfig.json
```

Each package's file starts with `"extends": "../../tsconfig.base.json"` — "take the base rules, then add or override these".

**The base** turns on `strict: true` (all of TypeScript's safety checks) and `noUncheckedIndexedAccess` (`array[0]` may be `undefined` — catches real bugs).

**What differs: the module format.** JavaScript has two ways of linking files:

```js
// CommonJS — the older Node.js way
const { z } = require('zod');

// ESM (ES Modules) — the modern standard, used by browsers and Vite
import { z } from 'zod';
```

We always _write_ `import`/`export` in TypeScript. The `module` setting says what it should end up as:

| Package           | Setting                                                                     | Result   | Why                                                                                                                                                                                                                                    |
| ----------------- | --------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/web`        | `"module": "ESNext"`, `"moduleResolution": "Bundler"`, `"jsx": "react-jsx"` | ESM      | Vite bundles it for the browser; `jsx` allows `.tsx` files                                                                                                                                                                             |
| `apps/api`        | `"module": "NodeNext"` + decorator options                                  | CommonJS | "Follow Node's rules": with no `"type": "module"` in its `package.json`, Node treats it as CommonJS — NestJS's usual setup. `experimentalDecorators` and `emitDecoratorMetadata` are needed for `@Controller` and dependency injection |
| `packages/shared` | `"module": "ESNext"` (type checking only)                                   | **both** | Built by **tsup** (`tsup.config.ts`) into `dist/index.js` (ESM, for the web) and `dist/index.cjs` (CommonJS, for the API)                                                                                                              |

The shared package's `package.json` → `"exports"` tells each consumer which file to load: `"import"` → `index.js`, `"require"` → `index.cjs`. Run `pnpm build` and look in `packages/shared/dist/` to see both.

**Why TypeScript 6.0 and not 7?** The NestJS CLI and typescript-eslint don't support 7 yet. See [decision 0001](../decisions/0001-monorepo-pnpm-typescript.md).

---

## 3. `packages/shared` — the contract package

**`src/health.ts`** — the core idea of the stack in miniature. One **Zod schema** (a runtime validator) and `z.infer` turns it into a **TypeScript type** (a compile-time check):

- the **type** tells the compiler what data _should_ look like;
- the **schema** checks at runtime what data _actually_ is (e.g. a response that came over the network).

**`src/index.ts`** — the public surface of the package. Everything exported here is a contract other groups rely on.

**Why is the schema not in the API?** Because the web app needs it too. Shared = what both sides must agree on (shapes, validation). Anything server-only (NestJS, `process.env`, the database) stays in `apps/api`, so it never ends up in the browser bundle.

---

## 4. `apps/api` — NestJS

Read the files as a chain:

| File                                      | Role                                                                                                                                                                                                                          |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/main.ts`                             | Starts the app: creates it from `AppModule`, prefixes every route with `/api`, listens on port 3000 over IPv4 and IPv6. The `/api` prefix is what lets the proxy send `/api/*` to the API and everything else to the web app. |
| `src/app.module.ts`                       | Root module. Each group plugs its module in here: `IdentityModule`, `SocialModule`, `ContentModule`.                                                                                                                          |
| `src/modules/system/system.module.ts`     | A feature module (owned by A). A module groups related controllers and services.                                                                                                                                              |
| `src/modules/system/health.controller.ts` | Handles `GET /api/health`.                                                                                                                                                                                                    |
| `nest-cli.json`, `tsconfig.build.json`    | Tell `nest build` how to compile.                                                                                                                                                                                             |

**What a controller is:** a class that receives HTTP requests for a URL and returns the response.

```ts
@Controller('health') // this class handles URLs under /health
export class HealthController {
  @Get() // this method answers GET requests on that URL
  check(): HealthResponse {
    // return type comes from the shared contract
    return { status: 'ok', service: 'api', version: '…', time: new Date().toISOString() };
  }
}
```

The `@Something` lines are **decorators**: labels that tell NestJS what to do with a class or method. You never call `check()` yourself — on `GET /api/health`, NestJS finds the matching controller and method, calls it, and sends the result as JSON. Because `check()` is typed `HealthResponse`, returning a wrong shape doesn't compile.

**Why a health endpoint?** It's the smallest feature that proves the whole chain works (shared → API → web). Docker and CI will use it to check the API is alive.

**For real features**, keep controllers thin and put the logic in a service:

```
request → Controller (route + input validation) → Service (business logic) → Prisma (database)
```

This pattern arrives with a full example on Days 3–6.

---

## 5. `apps/web` — React + Vite

| File              | Role                                                                                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.html`      | The single page; loads `src/main.tsx`.                                                                                                                                     |
| `src/main.tsx`    | Mounts React into the `#root` div.                                                                                                                                         |
| `src/app/App.tsx` | Temporary page (replaced on Day 5 by the router + layout). Calls `/api/health` and checks the answer with `HealthResponseSchema.parse()` — the other half of the contract. |
| `vite.config.ts`  | React plugin; in local dev, forwards `/api` to `localhost:3000` so the browser talks to one address.                                                                       |

**So how does the front end know the API returns the right data?** The API's return type is checked against the shared type at compile time, and the web app validates the actual response against the same schema at runtime.

---

## 6. Code quality

| File                                  | Role                                                                                                                                                                                      |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `eslint.config.mjs`                   | Lint rules. One NestJS exception: `import type` is not enforced in the API, because dependency injection needs real class imports at runtime (type-only imports disappear when compiled). |
| `.prettierrc.json`, `.prettierignore` | Formatting — reviews are never about spacing. Run `pnpm format`.                                                                                                                          |
| `.editorconfig`                       | Consistent editors: 2 spaces, LF line endings.                                                                                                                                            |
| `.nvmrc`                              | Node version for `nvm use` and CI.                                                                                                                                                        |
| `.gitignore`                          | Keeps `node_modules`, builds and `.env` out of git. Only `.env.example` is ever committed.                                                                                                |

---

## 7. Team workflow

| File                               | Role                                                                                                                               |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `.github/workflows/ci.yml`         | Runs on every PR: install, format check, lint, typecheck, build, test. `main` requires it to pass.                                 |
| `.github/CODEOWNERS`               | Automatically requests a review from the group that owns the files a PR touches.                                                   |
| `.github/pull_request_template.md` | PR description in the shape of CONTRIBUTING §4: why, how, how to test, the §4.2 review checklist, footers.                         |
| `.github/ISSUE_TEMPLATE/*.yml`     | Optional forms for **Task / feature**, **Bug** and **Contract change** (one approval box per group).                               |
| `scripts/setup-github.sh`          | Creates the `group:` labels and milestones of CONTRIBUTING §6, optionally group A's Foundations issues.                            |
| `CONTRIBUTING.md`                  | The team's Git and GitHub rules (written by Benjamin).                                                                             |
| `documentation/decisions/`         | Decision records — monorepo + TypeScript, Prisma, UUIDs and timestamps, the Docker stack. Ready answers to "why did you choose X?" |
| `README.md`                        | Placeholder; group C writes the final one.                                                                                         |

**PR = Pull Request**: on GitHub, your request to merge a branch into `main`. It shows the diff, collects reviews and runs CI. Once approved and green, it's squash-merged.

---

## 8. Docker stack

One command (`make`) starts three services. Only the proxy is published on the host; the reasons are in [decision 0004](../decisions/0004-docker-stack.md).

| File                                | Role                                                                                                                                                 |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docker-compose.yml`                | The services `db` (Postgres 18), `api` and `proxy`, their volumes, and the startup order through healthchecks: db → api → proxy.                     |
| `apps/api/Dockerfile`               | Two stages: build the API with pnpm, then run only `dist/` and production dependencies (`pnpm deploy`) as the non-root `node` user.                  |
| `infra/proxy/Dockerfile`            | Two stages: build the React app, then nginx serves `dist/`.                                                                                          |
| `infra/proxy/default.conf.template` | nginx config: HTTP → HTTPS redirect, `/api` and `/socket.io` to the API, `index.html` for client-side routes. `${HTTPS_PORT}` is filled in at start. |
| `infra/proxy/30-generate-cert.sh`   | Creates a self-signed certificate on first start, kept in the `certs` volume.                                                                        |
| `infra/proxy/31-ipv6-fallback.sh`   | Removes the IPv6 `listen` lines on kernels without IPv6.                                                                                             |
| `.env.example`                      | Every variable the stack needs; `make` copies it to `.env` on the first run.                                                                         |
| `.dockerignore`                     | Keeps `node_modules`, builds, docs and secrets out of the images.                                                                                    |
| `Makefile`                          | Shortcuts: `make`, `make ps`, `make logs`, `make down`, `make db`, `make clean`, `make re`.                                                          |

---

## Decisions already taken

| Topic      | Choice                                                                                   | Record                                                |
| ---------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Repo       | Monorepo, pnpm workspaces, TypeScript 6.0                                                | [0001](../decisions/0001-monorepo-pnpm-typescript.md) |
| ORM        | Prisma 7.10.x (pinned — npm's `latest` tag currently points to an 8.0 release candidate) | [0002](../decisions/0002-orm-prisma.md)               |
| Data types | UUID ids, `timestamptz`, ISO strings in JSON, Postgres enums mirrored in `@ft/shared`    | [0003](../decisions/0003-ids-and-timestamps.md)       |
| Docker     | Three services, nginx in front, HTTPS on 8443, certificate generated at first start      | [0004](../decisions/0004-docker-stack.md)             |

---

## Coming next from group A (Merve)

Done: Day 1 (monorepo, shared package, CI) and Day 2 (Docker stack with HTTPS).

| Day | Delivers                                                                                 | Unblocks                                 |
| --- | ---------------------------------------------------------------------------------------- | ---------------------------------------- |
| 3   | NestJS base (config, validation, error format) + shared enums/errors/pagination          | API work in every group                  |
| 4   | Prisma schema (9 required tables; the 4 buffer tables come later), first migration, seed | Anything touching the database           |
| 5   | React router + API client + i18n + CI                                                    | UI work in every group                   |
| 6   | Full example feature + `adding-a-feature.md` + `contracts.md`                            | Copy-paste starting point for each group |
| 7   | Tag `v0.1.0-platform` + 30-min handoff                                                   | —                                        |

Questions or something unclear? Open an issue with the `group:A-platform` label or ask Merve on Discord — if this doc didn't answer it, the doc has a bug.
