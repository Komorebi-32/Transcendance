# syntax=docker/dockerfile:1
# Built from the repo root: docker build -f infra/proxy/Dockerfile .

# ── Stage 1: build the React app ────────────────────────────────
FROM docker.io/library/node:22-alpine AS web
WORKDIR /app
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile --filter "@ft/web..."

COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY apps/web apps/web
RUN pnpm --filter @ft/shared build && pnpm --filter @ft/web build

# ── Stage 2: nginx serves the build and proxies the API ─────────
FROM docker.io/library/nginx:stable-alpine
RUN apk add --no-cache openssl

COPY infra/proxy/default.conf.template /etc/nginx/templates/
COPY infra/proxy/30-generate-cert.sh infra/proxy/31-ipv6-fallback.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/30-generate-cert.sh /docker-entrypoint.d/31-ipv6-fallback.sh

COPY --from=web /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80 443