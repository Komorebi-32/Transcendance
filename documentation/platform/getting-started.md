# Getting started

_Owner: Group A, Platform and data (Merve)_

Two ways to run the project:

|                 | Full stack in containers                      | Local development     |
| --------------- | --------------------------------------------- | --------------------- |
| Command         | `make`                                        | `pnpm dev`            |
| Used for        | Evaluation, testing the real setup with HTTPS | Daily coding          |
| Reloads on save | No: rebuild with `make`                       | Yes, instantly        |
| Open            | https://localhost:8443                        | http://localhost:5173 |

Why the stack is built this way: [decision 0004](../decisions/0004-docker-stack.md).

---

## Run the full stack

**You need:** `git`, `make`, and Docker with Compose v2 — or Podman with `docker-compose`, as on the 42 machines (see [Podman](#podman-42-machines) first).

```bash
git clone https://github.com/Komorebi-32/Transcendance.git
cd Transcendance
make
```

The first `make` creates `.env` from `.env.example`, builds the images and starts three services: `db`, `api` and `proxy`. It takes about a minute the first time, a few seconds after that.

Open **https://localhost:8443**. The browser warns that the certificate is not trusted: it is self-signed, made for `localhost` on the first start. Accept it once; you should see "Showcase Room" and "API: ok".

| Command      | Does                                                                 |
| ------------ | -------------------------------------------------------------------- |
| `make`       | Build and start everything in the background                         |
| `make ps`    | Show the services and their state                                    |
| `make logs`  | Follow the logs of every service (`Ctrl+C` to leave)                 |
| `make down`  | Stop the containers; data and certificate are kept                   |
| `make db`    | Start only the database (for local development)                      |
| `make clean` | Stop everything and **delete** the database data and the certificate |
| `make re`    | `clean`, then `make`                                                 |

Only the proxy is reachable from your machine: `https://localhost:8443`, and `http://localhost:8080`, which only redirects to HTTPS. The API and the database stay on the internal Docker network (the database is also published on `127.0.0.1` for local development).

## Podman (42 machines)

On the school machines `docker` is Podman in disguise ("Emulate Docker CLI using podman"). Plain `docker` commands work as is, but Compose needs Podman's API service. Start it once:

```bash
systemctl --user enable --now podman.socket
```

`enable` restarts it at every login. If `systemctl --user` is not available, start it for the current session instead:

```bash
podman system service --time=0 unix:///run/user/$(id -u)/podman/podman.sock &
```

Podman runs without root here, so it cannot use ports below 1024. That is why the defaults are 8443 and 8080, not 443 and 80.

## Local development

**You need:** Node 22.12 or newer and pnpm.

```bash
pnpm install
pnpm build      # builds @ft/shared first, then the apps
pnpm dev        # API on :3000, web on :5173 — both reload on save
```

The web dev server forwards `/api` to the API, so the browser talks to http://localhost:5173 only.

From Day 4 the API needs the database: run `make db` first. It starts only Postgres, published on `127.0.0.1:5432`.

**No pnpm?** If `corepack enable` is not found or not allowed (the 42 machines), install pnpm in your home folder:

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
source ~/.bashrc
```

It may install a newer pnpm: that is fine. pnpm reads `packageManager` in `package.json` and switches to the version we pin. Ignore its "Update available" message.

## Configuration: `.env`

`.env` is created from `.env.example` and never committed. Change the passwords in it before sharing anything.

| Variable                                            | Default                                       | Used by                                                                    |
| --------------------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------- |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | `transcendence`, `change-me`, `transcendence` | The database, and the API's `DATABASE_URL` (built by `docker-compose.yml`) |
| `HTTPS_PORT`                                        | `8443`                                        | Host port of the site                                                      |
| `HTTP_PORT`                                         | `8080`                                        | Host port that redirects to HTTPS                                          |
| `DB_PORT`                                           | `5432`                                        | Host port of the database, on `127.0.0.1` only                             |

A new variable goes into `.env.example` too, with a comment naming the group that owns it.

## Troubleshooting

| You see                                                                 | Cause                                         | Fix                                                     |
| ----------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------- |
| `failed to connect to the docker API at unix:///run/user/…/podman.sock` | Podman's API service is not running           | [Podman](#podman-42-machines)                           |
| `required variable POSTGRES_USER is missing a value`                    | No `.env`                                     | Run `make` (it creates it) or `cp .env.example .env`    |
| `address already in use` on 8443, 8080 or 5432                          | Another program uses that port                | Change `HTTPS_PORT`, `HTTP_PORT` or `DB_PORT` in `.env` |
| `pnpm: command not found`                                               | pnpm not installed                            | [Local development](#local-development)                 |
| `npm error EACCES` when installing pnpm with npm                        | No rights on the system Node folder           | Use the pnpm installer above, never `sudo`              |
| The browser warns about the certificate again                           | The `certs` volume was deleted (`make clean`) | Accept the new certificate                              |
| You want a completely fresh start                                       | —                                             | `make re` (deletes the database data)                   |
