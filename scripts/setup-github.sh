#!/usr/bin/env bash
# One-time GitHub setup: the group labels and milestones of CONTRIBUTING §6,
# and (optionally) the Foundations issues of group A.
#
# Repository settings (squash only, rulesets on main) are set by hand by the
# repo owner — see CONTRIBUTING §7.3.
#
# Requirements: GitHub CLI (`gh`) logged in, with write access to the repo.
# Usage:
#   ./scripts/setup-github.sh                 # labels + milestones (safe to re-run)
#   ./scripts/setup-github.sh --with-issues   # + group A's Foundations issues (run only once!)

set -euo pipefail

REPO="$(gh repo view --json nameWithOwner --jq .nameWithOwner)"
echo "→ Configuring $REPO"

# ── Labels (CONTRIBUTING §6) ────────────────────────────────────────────
# The kind labels (bug, enhancement, documentation, question) exist by default on GitHub.
label() { gh label create "$1" --color "$2" --description "$3" --force >/dev/null && echo "  label $1"; }

label "group:A-platform" "1d76db" "A · Platform and data"
label "group:B-identity" "5319e7" "B · Identity, UI kit and room"
label "group:C-social"   "0e8a16" "C · Social and docs"
label "group:D-content"  "d93f0b" "D · Content"

# ── Milestones (CONTRIBUTING §6) ────────────────────────────────────────
milestone() {
  if gh api "repos/$REPO/milestones?state=all" --jq '.[].title' | grep -qxF "$1"; then
    echo "  milestone $1 (exists)"
  else
    gh api "repos/$REPO/milestones" -f title="$1" -f description="$2" >/dev/null && echo "  milestone $1"
  fi
}

milestone "Foundations"                 "Repo layout, Docker, schema, the contracts of modules_and_workload.md §6.3"
milestone "Core: mandatory + 14 points" "Mandatory part and the 14 core points"
milestone "Buffer: 7 points"            "The 7 buffer modules"
milestone "Stretch"                     "3D room and other extras"

# ── Group A's Foundations issues (only with --with-issues) ──────────────
# The monorepo skeleton issue is created by hand first, so it is not listed here.
if [[ "${1:-}" == "--with-issues" ]]; then
  issue() {
    gh issue create --title "$1" --label "group:A-platform,$2" --milestone "Foundations" \
      --body "$3" >/dev/null && echo "  issue: $1"
  }
  issue "Add Docker Compose with a single-command start" "enhancement" \
    "\`make\` (or \`docker compose up --build\`) starts db, api, web and proxy. Named volumes for Postgres data and uploads. Healthchecks."
  issue "Add reverse proxy with HTTPS" "enhancement" \
    "Every connection over HTTPS (self-signed in dev). Routes: / → web, /api → api, /socket.io → api (WebSocket)."
  issue "Add NestJS base: config, validation pipe, error filter" "enhancement" \
    "Typed env config, a ZodValidationPipe using shared schemas, and an exception filter that always returns the shared ApiError shape."
  issue "Add shared enums, error format, pagination and id/time types" "enhancement" \
    "errors.ts (ApiError + ErrorCode), common.ts (Uuid, ISO timestamps, Paginated<T>, page/sort query), enums.ts. A contract: agree with B, C and D first."
  issue "Add Prisma schema A, first migration and seed" "enhancement" \
    "The 9 required tables of documentation/database_schema.md (schema A). UUID ids, timestamptz, Postgres enums mirrored in shared enums.ts. Seed with 2–3 demo users and rooms."
  issue "Add React router, API client and layout shell" "enhancement" \
    "React Router, a fetch wrapper that parses ApiError, an app shell with placeholder routes per group."
  issue "Add i18n setup with 3 languages" "enhancement" \
    "i18next + react-i18next. locales/<lang>/<group>.json. Language switcher. Must land before any group writes UI text."
  issue "Add commitlint, husky and the PR title check" "enhancement" \
    "CONTRIBUTING §7.1 and §7.2, with pnpm instead of npm."
  issue "Write platform docs: getting started, adding a feature, contracts" "documentation" \
    "documentation/platform/*. Tested by a teammate on a fresh clone."
fi

echo "✓ Done"
