<!--
Title: a commit first line (CONTRIBUTING §3), e.g. `feat(room): add clickable hotspots on the room image`.
It becomes the commit on main when you squash and merge.
This description becomes that commit's body: keep the footers at the end.
-->

## Why

<!-- What problem does this solve? -->

## How

<!-- What changed, in a few lines. -->

## How to test

1.

## Review checklist (CONTRIBUTING §4.2)

- [ ] The project starts with the single command, and the change works when you try it
- [ ] No errors or warnings in the browser console (latest Chrome)
- [ ] Forms and inputs are validated in the front and in the back
- [ ] No credentials in the code; new variables added to `.env.example`
- [ ] UI text goes through i18n, never hard-coded
- [ ] A schema change comes with its migration
- [ ] Changes a contract (shared types, API route, WebSocket event, shared table)? → `!` in the title, a `BREAKING CHANGE:` footer, and the group told directly (§3.2)
- [ ] The reviewer understands the code well enough to explain it at evaluation

Closes #
