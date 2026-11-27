# 0002 — Prisma as the ORM

- Status: Accepted
- Date: 2026-11-23
- Owner: Group A, Platform and data (Merve)

## Context

The ORM minor module asks for database access through typed models instead of raw SQL. Slide 19 listed the ORM choice as open. Nine required tables (13 with the buffer modules), PostgreSQL, a NestJS API, and every group will add its own migrations.

## Decision

Prisma, pinned to the stable **7.10.x** line (`prisma` and `@prisma/client` on the same version). The schema lives in `apps/api/prisma/schema.prisma`; migrations in `apps/api/prisma/migrations/`.

## Why

- **One schema file, readable by everyone** — easy to review in a PR and easy to explain at evaluation.
- **Migrations built in** (`prisma migrate dev` / `deploy`), so each group ships schema changes as reviewed migration files.
- **Generated, fully typed client** — queries are type-checked against the schema.
- Most NestJS + Prisma examples and docs are available, which matters for a 4-person team learning NestJS.
- Alternatives: TypeORM (decorator entities, weaker typing of query results, migration tooling more error-prone), Drizzle (excellent typing, but SQL-like API and smaller NestJS ecosystem).

## Consequences

- Pin exact versions. At the time of writing, npm's `latest` tag for `prisma` points to an **8.0 release candidate** while `@prisma/client` is on 7.10.1 — a blind `pnpm add prisma` would mismatch them. Always add both with an explicit `@7.10` version.
- Never edit the database by hand or edit an applied migration; create a new migration.
- Each group changes only its own tables (see `documentation/platform/database.md`, Day 4); group A reviews every migration.
- JSONB `details` on `contents` is typed as `Json` in Prisma and validated with the per-type Zod schemas from `@ft/shared`.
