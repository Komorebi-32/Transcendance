# 0001 — Monorepo with pnpm workspaces, TypeScript 6.0

- Status: Accepted
- Date: 2026-11-23
- Owner: Group A, Platform and data (Merve)

## Context

React and NestJS must share types and Zod schemas (overview slide 7: "one language on both sides"). Four people work in parallel and need one command to install, build and check everything.

## Decision

One git repository with pnpm workspaces: `apps/api` (NestJS), `apps/web` (React + Vite), `packages/shared` (`@ft/shared`, types + Zod schemas). The shared package is built with tsup to both ESM (for Vite) and CommonJS (for NestJS). TypeScript is pinned to `~6.0` everywhere.

## Why

- **Monorepo:** a contract change and the code that uses it land in the same PR; no publishing of internal packages.
- **pnpm:** fast, strict (a package can only import what it declares), first-class workspaces; `workspace:*` links `@ft/shared`.
- **TypeScript 6.0, not 7:** TypeScript 7 (the native rewrite) is out, but the NestJS 12 CLI ships with TypeScript 6.0 and typescript-eslint supports `< 6.1`. Revisit when both support 7.
- Alternatives: npm/yarn workspaces (looser), Turborepo/Nx (more tooling than 4 people need for one week of setup).

## Consequences

- Use `pnpm` only — never `npm install` (it would create a second lockfile). The version is pinned in `package.json` → `packageManager`.
- `pnpm build` builds `@ft/shared` first; when you change a shared file, rebuild it (or keep `pnpm dev` running, which watches it).
- Adding a dependency: `pnpm --filter @ft/api add <pkg>` (or `@ft/web`, `@ft/shared`). Root tooling (commitlint, husky): `pnpm add -D -w <pkg>`.
- CONTRIBUTING §7.1 and §7.2 currently show npm commands; they need the pnpm equivalents (`pnpm add -D -w`, `pnpm exec`, `pnpm install --frozen-lockfile`).
