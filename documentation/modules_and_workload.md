# What is this doc

The modules we chose for the project and the estimated workload, for a team of 4. The analysis of every possible module (and why the others were not chosen) is in [modules_analysis.md](modules_analysis.md).

Sources: `en.subject.transcenDANCE.pdf` (v21.1), [modules_analysis.md](modules_analysis.md), `ft_transcendence Architecture and Tech Stack Proposal-1.pdf` (Merve, Nov 10 2026). Last update: Nov 24 2026.

# Modules and workload

Goal: reach the **14 required points** (Major = 2, Minor = 1) with modules that fit our idea, a **showcase room** where each member shares books, films, music, photos, games and paintings through clickable objects in a cosy 2D pixel-art room. On top of that, we plan **7 buffer points**: they protect the 14 if a module fails at evaluation, and they earn the bonus (5 points at most).

## 1. How to read the estimates

- **1 p-day (person-day) = 6 hours of focused work**, for one developer who is still learning the stack. It includes tests and being demo-ready.
- Each module has a range (e.g. 4-6). Totals use the **midpoint** (5). Every figure has a margin of about ±50%: it is a planning aid, not a promise.
- Hours per person = p-days × 6 ÷ 4 people. Calendar weeks assume the whole team works in parallel, 5 days a week, and add a +30% margin for integration, blocked dependencies and evaluation preparation.

## 2. Chosen modules

### 2.1 Core: the 14 required points

| Module | Type | Pts | p-days (range) | Used in totals | What it covers |
|---|---|---|---|---|---|
| Frameworks, front + back | Major | 2 | 6-10 | 8 | React + NestJS, both in TypeScript: project setup, shared types, auth session wiring, learning curve |
| Real-time features (WebSockets) | Major | 2 | 4-6 | 5 | Presence in a room, live chat, visitors seeing new contents appear |
| User interaction | Major | 2 | 6-8 | 7 | Chat, profiles, friends |
| Standard user management | Major | 2 | 4-6 | 5 | Profile editing, avatar, friends with online status, profile page |
| ORM | Minor | 1 | 1-2 | 1.5 | Database access through typed models |
| File upload and management | Minor | 1 | 4-6 | 5 | Photos and artworks: validation on both sides, access control, preview, progress, delete |
| OAuth 2.0 | Minor | 1 | 1-3 | 2 | Login with 42 (or Google, GitHub) |
| Custom design system | Minor | 1 | 4-6 | 5 | The cosy pixel-art identity: 10+ reusable components, palette, typography, icons |
| Advanced search | Minor | 1 | 3-4 | 3.5 | Find rooms, members and items by category or tag, with filters, sorting and pagination |
| Image recognition and tagging | Minor | 1 | 3-5 | 4 | Automatic tags on uploaded photos and paintings, which feed the search |
| **Total** | | **14** | **36-56** | **46** | |

The proposal planned an Advanced 3D room (2 pts). We build the room in 2D, so Advanced search + Image recognition replace it: the tags feed the search, so the two modules support each other.

### 2.2 Buffer: 7 extra points

| Module | Type | Pts | p-days (range) | Used in totals | What it covers |
|---|---|---|---|---|---|
| Multiple languages | Minor | 1 | 2-3 | 2.5 | At least 3 languages with a switcher; all UI text goes through i18n from day one |
| Progressive Web App | Minor | 1 | 2-3 | 2.5 | Installable app with offline support (manifest, service worker) |
| GDPR compliance | Minor | 1 | 3-4 | 3.5 | Members can request, export and delete their data, with email confirmation |
| Additional browsers | Minor | 1 | 2-3 | 2.5 | Full support for 2 more browsers (e.g. Firefox, Safari), limits documented |
| Notification system | Minor | 1 | 3-4 | 3.5 | A notification for every create, update and delete action, shown live. Scope to agree first |
| Two-factor authentication (2FA) | Minor | 1 | 2-3 | 2.5 | A second login step with a code from an authenticator app (TOTP) |
| Content moderation AI | Minor | 1 | 3-5 | 4 | Uploads and texts checked automatically; flagged content hidden, author warned |
| **Total** | | **7** | **18-25** | **21** | |

### 2.3 Stretch: only if there is time (not counted)

| Item | Type | Pts | p-days (range) | Who | Notes |
|---|---|---|---|---|---|
| Advanced 3D graphics: a 3D version of the room | Major | 2 | 15-25 (≈ 20) | Matthieu | Reuses the hotspot data of the 2D room. Start only once the core is demo-ready. See §3 for when it actually adds points. |
| Galaxy menu | not a module | - | not estimated | - | Animated menu where the category icons orbit like planets. The MVP ships a simple text menu (see [front.md](front.md)). |

## 3. Bonus rules and how we use the buffer

What the subject says (p. 30):
- The bonus is considered **only if the 14 required points are validated**.
- Each module validated beyond the 14 points counts as bonus: **Major = 2, Minor = 1**.
- **5 bonus points at most** (e.g. 5 minors, or 2 majors + 1 minor).
- Each extra module must be fully functional, meet the module requirements, add real value to the project, and be **justified in the README**.

What it means for us (our reading of the rules):
- We plan 14 + 7 = **21 points**, and at most **19** can count (14 + 5).
- If every module passes, 5 buffer points count as bonus and **2 are spare**.
- If a module fails, the buffer first fills the 14 points, and the rest still counts as bonus. We can lose up to 2 points (one Major or two Minors) and still reach 14 + 5.
- The 3D stretch (2 pts) only adds points if fewer than 5 extra points are validated. It is a product choice more than a points choice.
- Each buffer module needs a README justification in product terms. Ours have one: protecting personal data (GDPR), protecting accounts (2FA), keeping public uploads clean (moderation), following activity (notifications), reaching more members (languages, browsers, mobile app).

## 4. Mandatory part

The mandatory part applies whatever modules are chosen.

| Mandatory item | p-days (range) | Used in totals |
|---|---|---|
| Docker Compose, single-command run, HTTPS (reverse proxy), CI | 3-4 | 3.5 |
| Database schema and migrations | 2 | 2 |
| Email + password auth with salted hashing, sessions | 2-3 | 2.5 |
| Form and input validation on both sides | 2 | 2 |
| Privacy Policy and Terms of Service (real content) | 1 | 1 |
| README with all required sections | 1-2 | 1.5 |
| **Total** | **11-14** | **12.5** |

Product work that is neither a module nor mandatory, but needed: **room page, hotspots and text menu ≈ 3.5 p-days** (a rough guess). The room artwork is not estimated.

## 5. Total workload for 4 people

| Scenario | Points | p-days | Per person | Hours per person | Weeks at 6 h/day (+30%) | Weeks at 4 h/day (+30%) |
|---|---|---|---|---|---|---|
| Required part only: mandatory + 14 core points + room page | 14 | 62 | 15.5 | ≈ 93 | 4.0 | 6.0 |
| With the full bonus: + the 5 cheapest buffer modules | 14 + 5 | 75.5 | ≈ 18.9 | ≈ 113 | 4.9 | 7.4 |
| **Full plan, our target: + all 7 buffer modules** | **14 + 7** | **83** | **≈ 20.75** | **≈ 125** | **5.4** | **8.1** |
| Stretch: 3D room (Matthieu, on top of his share) | + 2 | + 20 | - | + 120 for Matthieu | about 4 more weeks for one person at 6 h/day | |

How the figures are built:
- Required part: 46 (core) + 12.5 (mandatory) + 3.5 (room page) = 62 p-days.
- The 5 cheapest buffer modules: multiple languages, PWA, 2FA, additional browsers (2.5 each) + GDPR or notifications (3.5) = 13.5 p-days.
- Full plan: 62 + 21 (all buffer modules) = 83 p-days.
- Weeks: p-days × 6 h ÷ (4 people × hours per day × 5 days), then +30%. Example: 83 p-days at 6 h/day = 4.15 weeks, 5.4 with the margin.

Not included: the room artwork, the galaxy menu, and learning time beyond what each module estimate already contains.

## 6. Workload split for 4 people

### 6.1 How the groups are built

Each group owns one product area end to end: its database tables, API endpoints, WebSocket events and frontend pages. Groups talk to each other only through a few agreed contracts (§6.3), so they can work in parallel against stubs. Cut lines chosen to avoid overlap:
- **Profile vs. friends.** Identity owns the profile data, the avatar and the profile page. Social owns friends, online status and chat.
- **Content vs. live updates.** Content owns the items users share. Social broadcasts the changes and turns them into notifications.

Buffer modules go to the group whose core work they extend, then move if a group gets too heavy:
- **Multiple languages → A.** The i18n setup must exist before anyone writes UI text, and A sets up the frontend. Group B, its natural home, already holds the room.
- **PWA → A.** The manifest and service worker are build configuration. It moved from Content to make room for moderation.
- **2FA → B.** It extends the login flow that Identity owns.
- **Notifications → C.** They are delivered live over the WebSocket hub that Social owns.
- **Additional browsers → C.** The module requires documenting browser limits, which fits the docs owner.
- **GDPR → D.** It is about user data and uploads. Every group exports and deletes its own tables (§6.3).
- **Content moderation AI → D.** It runs on the same upload pipeline as image recognition, and can share the same service call.

### 6.2 The split

| Group | Owner | Theme | Core modules (p-days) | Buffer modules (p-days) | Mandatory items (p-days) | Total |
|---|---|---|---|---|---|---|
| **A. Platform and data** | Merve | Foundations everyone builds on | Frameworks front + back (8), ORM (1.5) | Multiple languages (2.5), PWA (2.5) | Docker Compose + HTTPS + CI (3.5), database schema and migrations (2), validation of its own forms (0.5) | **20.5** |
| **B. Identity, UI kit and room** | Benjamin | Accounts, the visual identity and the room | Standard user management (5), OAuth 2.0 (2), Custom design system (5), room page + hotspots + text menu (3.5, not a module) | 2FA (2.5) | Email + password auth (2.5), validation of its own forms (0.5) | **21** |
| **C. Social and docs** | to be decided | Everything live between users | Real-time features (5), User interaction: chat, friends (7) | Notifications (3.5), Additional browsers (2.5) | README (1.5), Privacy Policy and Terms of Service (1), validation of its own forms (0.5) | **21** |
| **D. Content** | Samira | What users share and how it is browsed | File upload (5), Image recognition (4), Advanced search (3.5) | GDPR (3.5), Content moderation AI (4) | Validation of its own forms (0.5) | **20.5** |
| | | | | | **Total** | **83** |

About **20.75 p-days (≈ 125 h) per person**, with groups between 20.5 and 21. The 2 p-days of form validation are split evenly (0.5 per group), since each group validates its own forms and endpoints. Group B is the most exposed: the room artwork is not counted. If it overflows, D can take the content pages (lists and detail views) that the room links to. The 3D stretch comes on top, for Matthieu, only once the core is demo-ready.

### 6.3 Contracts between groups

| Provider | Consumer | What is agreed |
|---|---|---|
| Platform (A) | everyone | Repo layout, Docker setup, migration workflow, shared types, API error format. First deliverable: nothing else can start without it. |
| Identity (B) | Social, Content | An authenticated-user guard and a user id on every request. Social and Content never touch the credentials tables. |
| Design system (B) | everyone with pages | A small component list (buttons, inputs, cards, modal...) published early, even if unfinished. |
| every group | Social (C) | One event for each create, update and delete (who, what, which item). Social broadcasts it live and turns it into notifications. |
| every group | GDPR owner (D) | For one user: export the data of its own tables, and delete it. The GDPR owner only orchestrates and sends the confirmation emails. |
| i18n owner (A) | everyone with pages | The translation setup, ready before UI text is written. Each group adds its own keys. |
| Content (D) | Room (B) | The list of content types and the routes of their pages. The room group owns the hotspot-to-type mapping, and the same data feeds the room and the text menu. |

### 6.4 Ownership of tables and demos

- Each group owns its tables and writes its own migrations. Platform reviews them for consistency.
- Each module has one named owner who demos it at evaluation, and a second person from another group who has reviewed it and can explain it, because every member must be able to explain the whole project (subject p. 6).
- Suggested role mapping, to be decided by the team: Technical Lead = Platform, Project Manager and Product Owner shared between the other groups.

### 6.5 What this split does not remove

- **Integration.** Parallel work against stubs only works if the contracts above are written down in week 1. Plan a shared integration session for each module, not one at the end.
- **Everyone must contribute to the mandatory part** (subject p. 4). Every group validates its own forms, but Content holds nothing else. Give it a visible share as well, for example the HTTPS demo. Make sure each member has commits there.
- **Friends and online status** can be read by an evaluator as part of Standard user management. Identity's demo then depends on Social's work, so agree that both groups show it.

## 7. Risks and caveats

- **Friends overlap.** User interaction and Standard user management both include friends. An evaluator may question it. The buffer exists partly for this.
- **AI services vs. the stack.** Image recognition and content moderation both need a model. With NestJS, either call a hosted API (simplest, and one provider can do both), run a small Python container next to the backend, or use a Node-based model runtime (heavier to set up and explain). Decide before starting. A hosted API must be mentioned in the Privacy Policy.
- **NestJS at evaluation.** Decorators and dependency injection hide a lot of behaviour. Everyone must be able to explain their part, so budget review time and avoid generated code nobody can walk through.
- **Notification scope.** The wording says "all creation, update, and deletion actions". Agree the exact scope with the evaluators' reading in mind before building it.
- **Bonus conditions.** Bonus points only count once the 14 points are validated, and each extra module needs a README justification and real product value (§3).
- **Custom modules can be refused** with 0 points. None is in the plan.
- **2D art cost.** The proposal says 2D needs good artwork to avoid looking like a plain gallery. Budget time for the room illustration (not in the estimates).
- **A fixed room is thin on its own.** With no placeable objects, the depth of the product comes from the contents: well-modelled types and attributes, the media integration, search and tags. Invest there.
- **Multi-user demo without a layout conflict story.** Show concurrency another way: unique constraints on sign-ups and friend requests, and two users adding contents or sending chat messages at the same time while a visitor sees live updates and notifications.
- **The stretch must not eat the plan.** The 3D room and the galaxy menu only start once the core modules are demo-ready.

## 8. Data model

The data model lives in [database_schema.md](database_schema.md), in two versions: schema A for the required part (9 tables) and schema B for the required part plus the buffer modules (13 tables, plus 3 new columns).
