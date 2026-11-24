# What is this doc

How we work with Git and GitHub on Transcendance: branches, commit messages, pull requests and issues. Read it once before your first commit, then keep it as a reference.

Sources: `documentation/en.subject.transcenDANCE.pdf` (v21.1), [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/), [modules_and_workload.md](documentation/modules_and_workload.md) for the groups. Last update: Nov 24 2026.

## Why these rules

Git is part of the grade. The subject (p. 8) says the repository must show:
- commits from all team members,
- clear commit messages describing the changes,
- proper work distribution across the team.

At evaluation, each of us also explains how the work was divided and what we contributed (p. 6).

Evaluators look at the repository we submit (p. 31). A cloned repository only carries commits: our pull requests, reviews and issues stay on GitHub. So the history of `main` must tell the story on its own: one clear commit per change, with its author and the part of the project it touches.

## 1. The workflow in short

```
issue #12 → branch feat/12-room-hotspots → commits → pull request → review → squash merge into main
```

1. Pick an issue (or create one) and assign yourself.
2. Create a branch from an up-to-date `main`.
3. Commit one change at a time (atomic commits, §3.5), using the commit format (§3).
4. Open a pull request into `main`. Its title follows the commit format.
5. Another member reviews it and approves it.
6. You squash and merge. GitHub deletes the branch and closes the issue.

## 2. Branches

### 2.1 `main`, the only long-lived branch

- Nobody pushes to `main` directly. Every change goes through a pull request.
- A pull request needs **1 approval** from another member. Ideally someone from another group: they become the second person who can explain the module at evaluation ([modules_and_workload.md](documentation/modules_and_workload.md) §6.4).
- `main` always works: the project starts with the single command from the README, and the browser console shows no errors or warnings (subject p. 8).
- No `git push --force` on `main`.
- Once CI exists, a pull request merges only when CI is green.

GitHub enforces these rules (§7.3), so a mistake is blocked instead of breaking `main`.

### 2.2 Working branches

One branch per issue, and short-lived: aim to merge within 2 to 3 days. Split a big module into several pull requests that each leave `main` working, for example the API endpoint first, then the page.

Name: `<type>/<issue>-<short-name>`, in lowercase, with words separated by hyphens. The type is the one you will use in the commits (§3.2). A small docs or chore change without an issue drops the number.

| Branch | Work |
|---|---|
| `build/1-docker-compose` | Docker Compose, single-command start |
| `build/2-https-proxy` | Reverse proxy and HTTPS |
| `feat/3-db-schema-a` | Schema A and its first migration |
| `feat/5-auth-email-password` | Sign-up and login with email and password |
| `feat/8-oauth-42` | Login with 42 |
| `feat/10-ui-buttons-inputs` | First components of the design system |
| `feat/12-room-hotspots` | Room image with clickable hotspots |
| `feat/15-chat-live` | Live chat over WebSocket |
| `feat/18-upload-photos` | Photo upload with validation |
| `fix/24-chat-duplicate-messages` | A bug fix |
| `docs/readme-run-steps` | A README change, no issue needed |

## 3. Commits

Every commit is **atomic**: it holds one complete change and nothing else (§3.5). Its message follows [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/), with the type list of commitlint's `config-conventional` (§7.1).

### 3.1 Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

- **Description**: what the change does, in the imperative ("add", not "added" or "adds"), lowercase, with no final period. It should complete the sentence "If applied, this commit will...". Keep the whole first line to 72 characters at most.
- **Body**: why and how. Leave a blank line after the first line, and wrap lines at 72 characters.
- **Footers**: structured data, one per line, at the end:
  - `Closes #12` or `Fixes #24` closes an issue, `Refs: #12` links it without closing it.
  - `Co-authored-by: Name Surname <email>` credits the person you paired with. Use the email of their GitHub account, or their `12345+login@users.noreply.github.com` address.
  - `BREAKING CHANGE: <what others must change>` (§3.2).

### 3.2 Types

| Type | When |
|---|---|
| `feat` | A new feature for users |
| `fix` | A bug fix |
| `docs` | Documentation only: README, `documentation/`, code comments |
| `style` | Formatting only (spaces, semicolons), no change in behaviour. CSS changes are `feat` or `fix`, not `style`. |
| `refactor` | A code change that neither fixes a bug nor adds a feature: renaming, moving, splitting |
| `perf` | A performance improvement |
| `test` | Adding or fixing tests |
| `build` | Docker, Dockerfiles, Compose, Makefile, dependencies (`package.json`) |
| `ci` | CI configuration (GitHub Actions) |
| `chore` | Anything else that does not touch the app: `.gitignore`, editor config |
| `revert` | Reverting a previous commit |

**Breaking change** is not a type. Add `!` after the type or scope, and explain it in a `BREAKING CHANGE:` footer. Use it when another group must change something on their side: a renamed API route, a changed WebSocket event, a migration on a shared table. These are the contracts of [modules_and_workload.md](documentation/modules_and_workload.md) §6.3, so also tell the group directly.

### 3.3 Scopes

The scope says which part of the project the commit touches. It is lowercase and comes from the table below. Leave it out when a change concerns the whole project, for example `chore: ignore .env files`. Use one scope per commit: if you need two, the commit probably does two things, so split it (§3.5).

The groups come from [modules_and_workload.md](documentation/modules_and_workload.md) §6.2. The column says who owns the area, not who may commit there. To add a scope, add it to this table and to `commitlint.config.mjs` (§7.1) in the same pull request.

| Scope | What it covers | Group |
|---|---|---|
| `front`, `back` | Project-wide setup of the React app or the NestJS app: routing, app module, lint config | A |
| `docker` | Docker Compose, Dockerfiles, reverse proxy, HTTPS | A |
| `db` | Schema, migrations, ORM setup, seed data | A |
| `i18n` | Translation setup and keys | A |
| `pwa` | Manifest, service worker, offline mode | A |
| `auth` | Email and password sign-up and login, sessions | B |
| `oauth` | Login with 42 | B |
| `2fa` | Second login step with a TOTP code | B |
| `profile` | Profile page, profile editing, avatar | B |
| `ui` | Design system: components, palette, typography, icons | B |
| `room` | Room page, hotspots, text menu | B |
| `ws` | WebSocket hub, presence, live updates | C |
| `chat` | Chat | C |
| `friends` | Friends and online status | C |
| `notif` | Notifications | C |
| `browsers` | Support for extra browsers and their documented limits | C |
| `legal` | Privacy Policy and Terms of Service pages | C |
| `readme` | README | C |
| `content` | Content types and their pages (books, films, music...) | D |
| `upload` | File upload: validation, storage, preview, delete | D |
| `search` | Search, filters, sorting, pagination | D |
| `tagging` | Image recognition and tags | D |
| `moderation` | Content moderation AI | D |
| `gdpr` | Data export and deletion | D |
| `3d` | 3D room (stretch) | Matthieu |

### 3.4 Examples

```
feat(room): add clickable hotspots on the room image
fix(oauth): show an error when the user denies access on 42
build(docker): add nginx reverse proxy with TLS
docs(readme): add run instructions
refactor(upload): extract file validation into a pipe
test(auth): cover login with a wrong password
chore: ignore .env files
```

A full message, with a body and footers:

```
feat(chat)!: merge chat event types into chat:message

The hub switched on five event names, one per message type. A single
event with a type field is simpler, and notifications can reuse it.

BREAKING CHANGE: clients send chat:message with { type, body }
Closes #15
Co-authored-by: Name Surname <12345+login@users.noreply.github.com>
```

Not like this:

| Message | Problem |
|---|---|
| `update` | No type, says nothing |
| `doc: add readme` | The type is `docs` |
| `feat(Room): Added hotspots.` | Scope in uppercase, past tense, capital letter, final period |
| `feat(room, chat): ...` | Two scopes: split the commit |
| `feat(room): add hotspots and fix login typo` | Two changes: two commits (§3.5) |

### 3.5 Atomic commits

**Rule: every commit is atomic.** It holds one logical change, complete, and nothing else.
- **One change**: its first line names it with one type and one scope, without "and".
- **Complete**: the code still builds and the tests pass after it. The change comes with what it needs: its tests, its migration, its i18n keys, its `.env.example` line.
- **Nothing else**: no unrelated fix, no reformatting of a file you happened to open, no leftover debug `console.log`.

Atomic is about meaning, not size. A commit can touch several files, such as an endpoint and its test, and stay atomic. A two-line commit that fixes a bug and renames a variable is not.

The same rule applies one level up. A pull request does one thing (one issue), because it becomes one commit on `main` (§4.3).

**Why**
- **Reviews**: the reviewer reads the pull request commit by commit, and each message says what to expect. A bug hidden in a commit that also renames and reformats goes unnoticed.
- **Undoing**: `git revert <commit>` removes exactly one change. If a commit mixes a fix and a feature, reverting the feature also removes the fix.
- **Finding bugs**: `git bisect` walks the history to find the commit that broke something. It only works if every commit builds, and it only helps if the guilty commit does one thing.
- **Clear messages**: a commit that does one thing is easy to name. Most bad messages ("update", "fixes") come from commits that do several things.
- **Evaluation**: one change per commit gives "clear commit messages describing the changes" (subject p. 8) for free. Each of us can also point to our own commits when explaining our part.

**How**
1. **Plan the steps.** Before coding, split the issue into steps, one commit each. For `feat/12-room-hotspots`:
   ```
   feat(room): add the hotspot list of the living room
   feat(room): show hotspots as buttons over the room image
   feat(room): open the content list on hotspot click
   feat(room): highlight a hotspot on hover and keyboard focus
   ```
2. **Commit as soon as a step works**, before starting the next one, not at the end of the day.
3. **Look before you commit.** `git status` lists the changed files. `git diff` shows the changes not staged yet. `git diff --staged` shows exactly what the commit will contain.
4. **Stage on purpose.** Name the files: `git add src/room/Room.tsx`. Avoid `git add .` and `git commit -a`, which take everything, unrelated changes included. To take only part of a file, run `git add -p`: Git shows each block of changes and asks whether to stage it (`y` yes, `n` no, `s` split it smaller, `q` quit). `git restore --staged <file>` takes a file back out.
5. **Keep side changes apart.** Spotted a bug elsewhere, or a file that needs reformatting? Do not fold it into your commit. Commit it on its own (with `git add -p` on just those lines), or open an issue. Reformatting and renaming get their own `style` or `refactor` commit.
6. **Interrupted by something urgent?** Put your unfinished work aside with `git stash`, make and commit the urgent change, then get your work back with `git stash pop`.
7. **Forgot something in your last commit?** Stage it, then run `git commit --amend --no-edit` to add it to that commit. If you had already pushed it, follow with `git push --force-with-lease`, and only on your own branch.

Before each commit, check:
- [ ] The first line names one change, with one type and one scope.
- [ ] `git diff --staged` shows that change and nothing else.
- [ ] The code builds and the tests pass.

## 4. Pull requests

### 4.1 Opening one

- Base branch: `main`. Open it as a draft early if you want feedback before it is finished.
- **Title**: a commit first line (§3). At merge, it becomes the commit on `main`, so it matters more than the commits of your branch.
- **Description**: it becomes the body of that commit. Say why and how, how to test it, then the footers (`Closes #12`, `Co-authored-by:`).
- Request one reviewer.
- Keep it small and atomic: one issue, one purpose (§3.5). Under about 400 changed lines, a review takes minutes instead of hours.

### 4.2 Reviewing one

Review within one working day, so branches stay short-lived. Before approving, check:
- [ ] The project starts with the single command, and the change works when you try it.
- [ ] No errors or warnings in the browser console, in the latest Chrome (subject p. 8).
- [ ] Forms and inputs are validated in the front and in the back (p. 9).
- [ ] No credentials in the code: they stay in `.env`, and new variables are added to `.env.example` (p. 9).
- [ ] UI text goes through i18n, never hard-coded.
- [ ] A schema change comes with its migration.
- [ ] You understand the code well enough to explain it at evaluation. If not, ask in the review: that is what reviews are for.
- [ ] The title follows §3.

Then approve, or request changes with concrete comments.

### 4.3 Merging

- The author merges, once the pull request is approved and CI is green.
- Use **Squash and merge**, the only method enabled. All the commits of the branch become one commit on `main`, authored by the author of the pull request. The atomic commits of the branch served the review. On `main`, the atomic unit is the pull request, so a whole feature can be reverted in one commit, and follow-up commits from the review stay out of `main`.
- In the merge box, check the message before confirming: the title follows §3 (GitHub adds the pull request number, like `(#12)`), the body is the why and the how, and the footers come last (`Closes #12`, `Co-authored-by:` lines).
- GitHub deletes the branch on its own. Delete yours locally (§5).

## 5. Day-to-day commands

```bash
# Start from an up-to-date main
git switch main
git pull

# Create your branch
git switch -c feat/12-room-hotspots

# Work and commit one change at a time (§3.5)
git status
git diff
git add src/room/Room.tsx    # or git add -p to pick parts of a file
git commit -m "feat(room): add clickable hotspots on the room image"

# First push, then open the pull request (or open it on github.com)
git push -u origin feat/12-room-hotspots
gh pr create --base main

# main moved? Bring its changes into your branch
git fetch origin
git merge origin/main        # on a conflict: fix the files, git add them, then git commit
git push

# After the merge: back to main, delete your local branch
git switch main
git pull
git branch -D feat/12-room-hotspots
```

- **Merge, not rebase, to update your branch.** The branch is squashed at the end, so its history does not matter. A merge resolves conflicts once and never needs a force push. If you prefer rebasing, run `git rebase origin/main`, then `git push --force-with-lease`. Do this only on your own branch, never on a branch someone else works on.
- **`-D`, not `-d`, to delete the branch.** After a squash, Git cannot see that your commits are in `main`, so `-d` refuses.

## 6. Issues

An issue is a ticket: a task to do, a bug to fix, or a question to settle. Everything we plan lives in issues, so anyone can see who does what. It also helps us answer "how was the work organized and divided" at evaluation (p. 6).

- **Size**: one issue for one pull request, ideally 1 to 3 days of work. A module is a parent issue with sub-issues.
- **Title**: the task in plain words, for example "Add clickable hotspots to the room".
- **Assignee**: the person doing it. Assign yourself when you start, so two people never take the same task.
- **Labels**: one kind (`bug`, `enhancement`, `documentation`, `question`) and one group (`group:A-platform`, `group:B-identity`, `group:C-social`, `group:D-content`).
- **Milestones**: they follow the plan in [modules_and_workload.md](documentation/modules_and_workload.md): `Foundations` (repo layout, Docker, schema, the contracts of §6.3), `Core: mandatory + 14 points`, `Buffer: 7 points`, `Stretch`. The team sets their due dates.
- **Closing**: write `Closes #12` (or `Fixes #24` for a bug) in the pull request description. The issue closes when the pull request is merged into `main`.
- **Bugs**: give the steps to reproduce, what you expected, what happened, and the browser.

## 7. Automatic checks and repository settings

A rule that nobody checks gets forgotten, so tools check these for us. Group A (Platform) sets them up with the repo layout and CI.

### 7.1 commitlint and husky, on your machine

- **commitlint** reads a commit message and checks it against our rules: the type list, the scopes of §3.3, lowercase, the length of the first line. It rejects `doc: update readme` or `added stuff`.
- **husky** shares Git hooks with the team. A hook is a script Git runs at a given moment, here `commit-msg`, right after you write a message. Git keeps hooks in `.git/hooks`, which is never pushed. husky stores them in the repo (`.husky/`) and activates them for everyone on `npm install`.

Together: each `git commit` runs commitlint, and a bad message cancels the commit with the reason.

```
⧗   input: added room
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
```

`git commit --no-verify` skips the hook. That is why CI checks the pull request title too (§7.2).

Setup, once, at the repo root (with a root `package.json` for the tooling):

```bash
npm install --save-dev husky @commitlint/cli @commitlint/config-conventional
npx husky init                                            # creates .husky/ and the "prepare" script
echo 'npx --no -- commitlint --edit "$1"' > .husky/commit-msg
rm .husky/pre-commit                                      # sample hook running npm test, not needed yet
```

`commitlint.config.mjs`:

```js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 72],
    'scope-enum': [2, 'always', [
      'front', 'back', 'docker', 'db', 'i18n', 'pwa',
      'auth', 'oauth', '2fa', 'profile', 'ui', 'room',
      'ws', 'chat', 'friends', 'notif', 'browsers', 'legal', 'readme',
      'content', 'upload', 'search', 'tagging', 'moderation', 'gdpr',
      '3d',
    ]],
  },
};
```

### 7.2 CI on pull requests

- **Title check**: the title becomes the commit on `main`, so a GitHub Action runs commitlint on it, with the same config:

  ```yaml
  # .github/workflows/pr-title.yml
  name: PR title
  on:
    pull_request:
      types: [opened, edited, synchronize, reopened]
  jobs:
    commitlint:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 22
        - run: npm ci
        - run: echo "$TITLE" | npx commitlint
          env:
            TITLE: ${{ github.event.pull_request.title }}
  ```

- **Build check**: CI builds the containers and runs the lint and the tests on every pull request, so a broken change cannot reach `main`. Group A writes it with the Docker setup.

### 7.3 GitHub settings, set once by the repo owner

The repo is public, so these protections are free. On a private repo of a free account, GitHub would not enforce them.

**Settings → General → Pull Requests**
- Allow squash merging only: untick "Allow merge commits" and "Allow rebase merging".
- Default commit message for squash merging: **Pull request title and description**.
- Tick **Automatically delete head branches**.

**Settings → Rules → Rulesets → New branch ruleset**, target: the default branch, enforcement: Active, no bypass list.
- Restrict deletions.
- Block force pushes.
- Require a pull request before merging: 1 required approval, require conversation resolution before merging.
- Require status checks to pass: add the CI jobs of §7.2 once they exist.

**Issues**: create the group labels and the milestones of §6.
