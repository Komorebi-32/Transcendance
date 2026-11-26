# 0003 — UUID ids, `timestamptz`, ISO strings, Postgres enums

- Status: Accepted
- Date: 2026-11-23
- Owner: Group A, Platform and data (Merve)

## Context

Slide 19 listed "data types (ids, timestamps, enums)" as open. Every table, endpoint and WebSocket payload depends on this, so it must be fixed before the schema (Day 4) and the shared package (Day 3).

## Decision

- **Ids:** UUID for every primary key (`@id @default(uuid()) @db.Uuid`). Typed as `Uuid` (a branded string) in `@ft/shared`.
- **Timestamps:** `timestamptz` in PostgreSQL (`@db.Timestamptz(3)`); every table has `createdAt` and `updatedAt`.
- **In JSON:** timestamps are ISO 8601 strings in UTC (`2026-11-23T15:06:31.294Z`); ids are strings.
- **Enums:** PostgreSQL enums in Prisma (e.g. `ContentType`, `RoomVisibility`, `FriendshipStatus`), mirrored as Zod enums in `@ft/shared/enums.ts`. Values are lower-case snake_case (`friends_only`).
- **Naming:** camelCase in TypeScript/Prisma models, snake_case table and column names in SQL via `@@map` / `@map`.

## Why

- UUIDs can't be guessed or enumerated in URLs (`/rooms/3` → `/rooms/4`), and can be created on the client if ever needed.
- `timestamptz` stores an absolute instant; the browser formats it in the viewer's time zone and language (i18n).
- One enum definition per value set, checked on both sides, avoids "`FRIENDS` vs `friends_only`" bugs between groups.

## Consequences

- Route params that are ids are validated as UUIDs (invalid → 400, not 500).
- Never send `Date` objects over the wire in shared types — use `string` (ISO). Convert at the edges.
- Adding an enum value = a migration + a change to `enums.ts` → a contract change: agree with the other groups first, then `!` and a `BREAKING CHANGE:` footer if their code must change (CONTRIBUTING §3.2).
