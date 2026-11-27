# 0004 — Docker stack: three services, nginx in front

- Status: Accepted
- Date: 2026-11-27
- Owner: Group A, Platform and data (Merve)

## Context

The subject asks for the whole project to start with a single command and for every connection to use HTTPS. The stack must also run on the 42 machines, where `docker` is rootless Podman.

## Decision

Three services in `docker-compose.yml`, started with `make`:

- **`db`** — `postgres:18-alpine`, data in a named volume, published on `127.0.0.1` only.
- **`api`** — the NestJS app (`apps/api/Dockerfile`), on the internal network only.
- **`proxy`** — nginx (`infra/proxy/`), the only service published: HTTPS on host port 8443, HTTP on 8080 redirecting to HTTPS. It serves the React build and forwards `/api` and `/socket.io` to the API.

## Why

- **No separate web container.** After `vite build`, the React app is static files that run in the browser. The proxy image builds them in a first stage and nginx serves them: one container and one network hop less. The API runs code for every request, so it keeps its own container.
- **Host ports 8443 and 8080.** Ports below 1024 need root on the host; rootless Docker and Podman cannot open them. `HTTPS_PORT=443` works for anyone whose Docker runs as root.
- **Certificate generated at container start, kept in a volume.** A key in git or baked into the image (`RUN openssl …`) would be readable by anyone with the repo or the image, and a rebuild would make a new one. Generated once into the `certs` volume, it never leaves the machine and the browser warns only once.
- **Healthchecks with `depends_on: condition: service_healthy`.** A container that has started is not yet ready. The chain db (`pg_isready`) → api (`/api/health`) → proxy replaces sleeps and retry loops.
- **Local development stays `pnpm dev`.** Rebuilding images on every save is too slow; `make db` runs only the database for local work.
- Alternatives: a `web` container running `vite preview` (an extra container serving the same files), ports 443/80 (fail on rootless setups), a certificate in the image (a secret in the layers).

## Consequences

- Nobody reaches the API or the database directly from the host network; everything goes through the proxy.
- The nginx config listens on IPv4 and IPv6 (rootless Podman forwards IPv6 into the container) and drops the IPv6 lines on kernels without IPv6.
- Image names are fully qualified (`docker.io/library/…`) so Podman never has to ask which registry to use.
- Postgres 18 mounts its volume at `/var/lib/postgresql`, not `/var/lib/postgresql/data` as older versions did.
- Group D adds the `uploads` volume with the file upload module.
