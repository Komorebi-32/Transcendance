# syntax=docker/dockerfile:1
# Built from the repo root: docker build -f apps/api/Dockerfile .

# ── Stage 1: build ──────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

# Dependency manifests only: this layer stays cached until one of them changes
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile --filter "@ft/api..."

# Sources, then build: the shared package first, the API uses it
COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN pnpm --filter @ft/shared build && pnpm --filter @ft/api build

# A standalone folder: the compiled API + its production dependencies only
RUN pnpm --filter @ft/api deploy --prod --legacy /out

# ── Stage 2: run ────────────────────────────────────────────────
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /out ./
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]