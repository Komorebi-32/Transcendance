# Decision records (ADRs)

One short file per decision that someone might later ask "why did we do that?" about — including the evaluators.
Number them in order and never rewrite an accepted one: if a decision changes, write a new record that supersedes it.

| #                                        | Decision                                             | Status   |
| ---------------------------------------- | ---------------------------------------------------- | -------- |
| [0001](0001-monorepo-pnpm-typescript.md) | Monorepo with pnpm workspaces, TypeScript 6.0        | Accepted |
| [0002](0002-orm-prisma.md)               | Prisma as the ORM                                    | Accepted |
| [0003](0003-ids-and-timestamps.md)       | UUID ids, `timestamptz`, ISO strings, Postgres enums | Accepted |
| [0004](0004-docker-stack.md)             | Docker stack: three services, nginx in front         | Accepted |

## Template

```md
# NNNN — Title

- Status: Proposed | Accepted | Superseded by NNNN
- Date: YYYY-MM-DD
- Owner: group X

## Context

What problem or question forced a choice? (2–3 sentences)

## Decision

What we chose, stated plainly.

## Why

The 2–4 reasons that tipped it. Alternatives considered and why not.

## Consequences

What this makes easier, what it makes harder, what everyone must now do.
```
