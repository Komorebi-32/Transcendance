# Module analysis

Sources: `en.subject.transcenDANCE.pdf` (v21.1), `notes.md`, `ft_transcendence Architecture and Tech Stack Proposal-1.pdf` (Merve, Nov 10 2026; "the proposal" below).

Goal: reach **14 points** (Major = 2, Minor = 1) with modules that fit our idea: a **showcase room** where each user shares books, films, music, photos, games and paintings through clickable objects in a cosy 2D pixel-art room. Aim a few points above 14, because a module that is not fully working at evaluation scores 0.

## 1. How to read the tables

**Relevance** (to our idea)
- **Essential**: the product does not work without it, or it is already mandatory.
- **High**: clear product value and a natural fit.
- **Medium**: useful, but we would be adding it mostly for points.
- **Low**: forced fit; only worth it if points are missing.
- **N/A**: needs a game or a technology we do not have (the subject says these modules require at least one game).

**Time** is a rough estimate in person-days (p-days) for one developer who is still learning the stack. **1 p-day = 6 hours of focused work** (not 8, because meetings, debugging detours and context switching eat into a day). It includes tests and being demo-ready, and has a margin of about ±50%. It is not a promise.

**Complexity**: Low, Med or High. It covers the technical difficulty and also the risk of a partial result, which scores 0.

**In proposal**: where the module appears in the proposal: Core (14-point plan), Buffer, Stretch, or "-" if it is not mentioned.

## 2. All modules evaluated

### Web

| Module | Pts | Relevance | Time (p-days) | Complexity | In proposal | Notes |
|---|---|---|---|---|---|---|
| Frontend + backend framework (Major) | 2 | Essential | 6-10 (stack setup and learning, shared by the team) | Med | Core | Hypothesis: React + NestJS, both in TypeScript. No feature work of its own, but the setup is real: scaffolding both sides, API contract and shared types, auth session wiring, Nest's learning curve (modules, dependency injection, decorators, which are hard to explain line by line at evaluation). One language on both sides keeps this lower than a new-language backend. Counts once for both, so do not also claim the minor frontend and minor backend modules. |
| Real-time features, WebSockets | 2 | High | 4-6 (was 5-8) | Med | Core | Presence in a room, live chat, and visitors seeing new contents appear. Reconnect logic is the hard part. We have ft_irc experience. Lowered from 5-8 because there is no object-placement sync and no stale-layout conflict handling. The module is narrower, so the demo must still show updates across clients, graceful disconnects and broadcasting. |
| User interaction (chat, profile, friends) | 2 | High | 6-8 | Med | Core | Needed anyway for sharing between members. Overlaps with standard user management on friends (see §5). |
| Public API (key, rate limit, docs, 5+ endpoints) | 2 | Medium | 5-7 | Med | Stretch | Natural fit: "read and manage showcase contents". The OpenAPI docs can double as documentation. |
| ORM | 1 | High | 1-2 | Low | Core | Almost free once the stack is chosen. |
| File upload and management | 1 | Essential | 4-6 | Med | Core | Needed for artworks and photos. Needs validation on both sides, access control, preview, progress bar and delete. |
| Custom design system (10+ components) | 1 | High | 4-6 | Low-Med | Core | The cosy pixel-art identity is part of the product. A palette, typography and icons are needed anyway. |
| Advanced search (filters, sort, pagination) | 1 | Medium | 3-4 | Low-Med | Buffer | Find rooms, users and items by category or tag. Pairs well with image tagging. With a fixed room, filtered lists and search are the main way to browse content, so this module carries more of the product. |
| Notification system | 1 | Medium | 3-4 | Low-Med | Buffer | The wording covers ALL create, update and delete actions, so we must agree the scope first. |
| Progressive Web App | 1 | Medium-High | 2-3 | Low-Med | not listed | Fits the mobile concern in the notes. Needs a manifest, a service worker and offline support. |
| Server-Side Rendering | 1 | Low-Med | 3-5 | Med | not listed | Mostly free with Next.js, painful with Vite. Useful for link previews of shared rooms. |
| Real-time collaborative features | 1 | Low | 4-6 | Med-High | Buffer | Our MVP decision is that the room is not editable, so there is little to collaborate on. |

### Accessibility and internationalization

| Module | Pts | Relevance | Time (p-days) | Complexity | In proposal | Notes |
|---|---|---|---|---|---|---|
| WCAG 2.1 AA, screen readers, keyboard | 2 | Medium-High | 6-10 | Med-High | not listed | The 2D room with real buttons and a list-menu fallback makes this plausible. A full audit is the cost. |
| Multiple languages (3) | 1 | High | 2-3 | Low | Buffer | Cheap if all text goes through i18n from day one. The notes are already FR/EN. |
| RTL language | 1 | Medium | 2-4 | Med | not listed | Layout mirroring is needed, and a mirrored pixel-art room is awkward. |
| Additional browsers (2) | 1 | Medium | 2-3 | Low | Buffer | Lower risk in 2D than in WebGL. |

### User management

| Module | Pts | Relevance | Time (p-days) | Complexity | In proposal | Notes |
|---|---|---|---|---|---|---|
| Standard user management | 2 | Essential | 4-6 | Med | Core | Profile editing, avatar, friends with online status, profile page. |
| OAuth 2.0 | 1 | High | 1-3 | Low-Med | Core | The 42 login is the obvious provider. |
| 2FA | 1 | Medium | 2-3 | Low-Med | Buffer | TOTP libraries exist. |
| Advanced permissions (roles, CRUD users) | 2 | Medium | 5-7 | Med | not listed | Maps to admin, moderator, user and guest, and to visibility rules. |
| Organization system | 2 | Low | 5-7 | Med | not listed | Could be "clubs" or shared rooms, but it is a forced fit. |
| User activity analytics dashboard | 1 | Low-Med | 3-4 | Low-Med | not listed | E.g. visits to my room. Needs an event log. |
| Game statistics and match history | 1 | N/A | - | - | - | Requires a game. |

### Artificial intelligence

| Module | Pts | Relevance | Time (p-days) | Complexity | In proposal | Notes |
|---|---|---|---|---|---|---|
| Image recognition and tagging | 1 | High | 3-5 | Med | Stretch | Tags uploaded artworks and photos and feeds search. Already named in our meeting notes. Hosted API or a small model; may need a Python container if the backend is not Python. |
| Recommendation system (ML) | 2 | High (idea), costly | 8-12 | High | Open question | "Rooms you might like" is a great fit but the hardest AI module. Needs data and a continuous improvement story. |
| Content moderation AI | 1 | Medium | 3-5 | Med | Open question | Public uploads make this legitimate. An external moderation API is the cheap route. |
| Sentiment analysis | 1 | Low-Med | 2-3 | Low-Med | not listed | E.g. on chat messages or content descriptions. |
| Voice / speech integration | 1 | Low-Med | 3-4 | Med | not listed | Accessibility angle (text-to-speech of descriptions). |
| LLM system interface | 2 | Low-Med | 6-8 | High | not listed | Streaming, error handling and rate limiting are required. No natural use for it in the product. |
| RAG | 2 | Low | 8-10 | High | not listed | No dataset to query. |
| AI opponent | 2 | N/A | - | - | - | Requires a game. |

### Cybersecurity

| Module | Pts | Relevance | Time (p-days) | Complexity | In proposal | Notes |
|---|---|---|---|---|---|---|
| WAF/ModSecurity (hardened) + HashiCorp Vault | 2 | Low-Med | 6-8 | High | not listed | Product-independent infra work, with a risk of breaking the app with strict rules. |

### Gaming and user experience

| Module | Pts | Relevance | Time (p-days) | Complexity | In proposal | Notes |
|---|---|---|---|---|---|---|
| Advanced 3D graphics (Three.js / Babylon) | 2 | Low (we chose 2D) | 15-25 | High | Core | The proposal's room is 3D. Our notes choose 2D, so these 2 points must be replaced (see §4). |
| Gamification (3 of: achievements, badges, leaderboards, XP, daily challenges, rewards) | 1 | Medium | 4-6 | Med | not listed | Does not need a game. E.g. "collector" badges and a profile-completion level. Keep it to 3 well-done features. |
| Advanced chat | 1 | Low-Med | 3-5 | Med | not listed | Needs basic chat first. Several bullets mention games (invites, tournament notices), so an evaluator may question it. |
| Web-based game, remote players, multiplayer 3+, second game, tournament, customization, spectator | 2 / 2 / 2 / 2 / 1 / 1 / 1 | N/A | - | - | - | We build no game. |

### DevOps

| Module | Pts | Relevance | Time (p-days) | Complexity | In proposal | Notes |
|---|---|---|---|---|---|---|
| Health check, status page, automated backups and DR | 1 | Medium | 2-3 | Low-Med | not listed | A cheap infra point; backups of the DB and the media volume make sense for user content. |
| Prometheus + Grafana | 2 | Low (product) | 4-6 | Med | not listed | Independent of product code. Fewer moving parts than ELK. |
| ELK log management | 2 | Low (product) | 5-8 | High | not listed | Memory hungry (Elasticsearch). Independent of product code. |
| Backend as microservices | 2 | Low (and rejected) | 8-12 | High | Rejected | Our notes and the proposal both choose a modular monolith. |

### Data and analytics

| Module | Pts | Relevance | Time (p-days) | Complexity | In proposal | Notes |
|---|---|---|---|---|---|---|
| GDPR compliance | 1 | High | 3-4 | Med | Buffer | We store personal data and uploads, and Privacy Policy pages are mandatory anyway. Needs outgoing email for confirmations. |
| Data export and import | 1 | Medium | 3-4 | Low-Med | not listed | "Export my showcase" is a reasonable product feature. |
| Advanced analytics dashboard | 2 | Low-Med | 6-8 | Med | not listed | Charts, real-time updates, PDF/CSV export. |

### Blockchain

| Module | Pts | Relevance | Time (p-days) | Complexity | In proposal | Notes |
|---|---|---|---|---|---|---|
| Tournament scores on blockchain / ICP backend | 2 / 1 | N/A | - | - | - | No tournaments. The ICP backend is also incompatible with SSR. |

### Modules of choice (candidates, to be justified in the README)

| Module | Pts | Relevance | Time (p-days) | Complexity | In proposal | Notes |
|---|---|---|---|---|---|---|
| Room editor (drag and drop objects, save layouts) | 2 | Post-MVP | 10-15 | High | Stretch | Out of scope: the MVP room is not editable. The proposal also flags it as refusable. It would need the `room_objects` table and a layout version (see [database_schema.md](database_schema.md)). Do not count it in the 14. |
| External media embeds (YouTube / Spotify / oEmbed from the clickable objects) | 1 | High | 3-4 | Med | not listed | This is the core of our idea (vinyl player opens a playlist). Evaluator risk: it may be judged too small. Needs a solid README justification. |

## 3. Comparison with the proposal

| Topic | Proposal | Our notes | Verdict |
|---|---|---|---|
| Rendering | 3D room (React Three Fiber), 2D as escape route | 2D pixel art, hotspots on an image | **Diverges.** Costs the Advanced 3D module (2 pts). |
| Architecture | Modular monolith | Same ("Amandine said microservices are a pain") | Agree. |
| Frontend | React + TypeScript | "Not for me", friends suggest Next.js or Vite + React Router, TypeScript | Working hypothesis: React + TypeScript (same as the proposal, minus Three.js). |
| Backend | Go + Gin + GORM | Friend suggests Adonis or Express in TypeScript | Working hypothesis: NestJS + TypeScript, which is the proposal's own "lowest risk" candidate A without the 3D layer. One language on both sides, shared types, WebSocket gateways and validation built in. |
| Room editing | "Place it in the room" in the minimum product | Not editable in the MVP | Diverges. It is a scope cut. It removes the room-editor stretch, the `catalog_items` and `room_objects` tables, and the room layout version (see [database_schema.md](database_schema.md)). |
| Real-time | One WebSocket hub per room, broadcasting presence, object changes, guestbook entries and chat | Same hub per room | Agree, but narrower: no object-change broadcast and no guestbook. Presence, chat and new contents remain. |
| Image recognition | Stretch idea | Listed in the meeting notes | Agree, and it is worth promoting into the plan. |
| Core modules | 9 modules = 14 pts | n/a | 8 of the 9 stay valid. Only Advanced 3D falls away. |

Proposal Core plan under our 2D decision:

| Proposal core module | Pts | Still valid in 2D? |
|---|---|---|
| Frameworks (front + back) | 2 | Yes |
| Real-time features | 2 | Yes |
| User interaction | 2 | Yes |
| Standard user management | 2 | Yes |
| **Advanced 3D graphics** | **2** | **No: replace** |
| ORM | 1 | Yes |
| File upload | 1 | Yes |
| OAuth 2.0 | 1 | Yes |
| Custom design system | 1 | Yes |
| **Total still valid** | **12** | Need 2 more points |

## 4. Recommended plan for the 2D showcase room

The proposal's own 2D fallback is Advanced search + Notification system, or the Public API. Image recognition + Advanced search is a better fit here: the tags feed the search, so the two modules support each other.

| Block | Module | Pts | Est. p-days |
|---|---|---|---|
| Core | Frameworks front + back (React + NestJS, TypeScript) | 2 | 6-10 |
| Core | Real-time features | 2 | 4-6 |
| Core | User interaction | 2 | 6-8 |
| Core | Standard user management | 2 | 4-6 |
| Core | ORM | 1 | 1-2 |
| Core | File upload | 1 | 4-6 |
| Core | OAuth 2.0 | 1 | 1-3 |
| Core | Custom design system | 1 | 4-6 |
| Replaces 3D | Advanced search | 1 | 3-4 |
| Replaces 3D | Image recognition and tagging | 1 | 3-5 |
| | **Total** | **14** | **≈ 47** |
| Buffer | Multiple languages (3) | 1 | 2-3 |
| Buffer | PWA | 1 | 2-3 |
| Buffer | GDPR | 1 | 3-4 |
| Buffer | Additional browsers | 1 | 2-3 |
| | **Buffer total** | **4** | **≈ 11** |

The mandatory part is a separate cost that applies whatever modules are chosen:

| Mandatory item | Est. p-days |
|---|---|
| Docker Compose, single-command run, HTTPS (reverse proxy), CI | 3-4 |
| Database schema and migrations | 2 |
| Email + password auth with salted hashing, sessions | 2-3 |
| Form and input validation on both sides | 2 |
| Privacy Policy and Terms of Service (real content) | 1 |
| README with all required sections | 1-2 |
| **Mandatory total** | **≈ 12** |

Full picture: about 47 (14-point plan) + 11 (buffer) + 12 (mandatory) ≈ **70 person-days**, so roughly 14-18 per person for a team of 4-5. This is a rough estimate with the same ±50% margin as the rest, and it excludes the room artwork. Candidates to swap in or add: External media embeds (1), Gamification (1), Health check and backups (1), WCAG (2, larger).

### Calendar estimates by team size and daily hours

Workload in hours (1 p-day = 6 h): Core ≈ 47 p-days = **282 h**, Buffer ≈ 11 p-days = **66 h**, Mandatory ≈ 12 p-days = **72 h**, Total ≈ 70 p-days = **420 h**.

Each cell is the number of **working days** the whole team needs, assuming everyone works that many focused hours per day and the work splits perfectly between people.

| Block | Hours | 4 people, 6 h/day | 4 people, 4 h/day | 5 people, 6 h/day | 5 people, 4 h/day |
|---|---|---|---|---|---|
| Core modules (14 pts) | 282 | 11.8 | 17.6 | 9.4 | 14.1 |
| Buffer modules (4 pts) | 66 | 2.8 | 4.1 | 2.2 | 3.3 |
| Mandatory part | 72 | 3.0 | 4.5 | 2.4 | 3.6 |
| **Total (working days)** | **420** | **17.5** | **26.3** | **14.0** | **21.0** |
| Total in weeks (5 working days) | | 3.5 | 5.3 | 2.8 | 4.2 |
| Hours per person | | 105 | 105 | 84 | 84 |
| Total in weeks with a +30% margin | | 4.6 | 6.8 | 3.6 | 5.5 |

How to read it:
- The three block rows add up to the total row (up to rounding).
- Hours per person only depends on team size. A lower daily budget stretches the calendar, not the effort.
- The +30% margin row is my assumption, not a measurement. Real projects lose time to integration, blocked dependencies, merge conflicts and evaluation preparation, and the underlying estimates already carry ±50%. Plan on that row, not on the plain total.
- Not included: the room artwork, learning time beyond what is already in each estimate, and any module added from the "swap in" list.
- The proposal warns that a fourth member joining late or not at all is a risk, and suggests planning the core points for three people. With 3 people at 6 h/day, the total would be about 23.3 working days (420 / 18), before any margin.

## 5. Risks and caveats

- **Friends overlap.** User interaction and Standard user management both include friends. An evaluator may question it. The buffer exists partly for this.
- **Image recognition vs. the stack.** With NestJS, either call a hosted vision API (simplest), run a small Python container next to the backend, or use a Node-based model runtime (heavier to set up and explain). Decide before starting.
- **NestJS at evaluation.** Decorators and dependency injection hide a lot of behaviour. Everyone must be able to explain their part, so budget review time and avoid generated code nobody can walk through.
- **Notification scope.** The wording says "all creation, update, and deletion actions". Agree the exact scope with the evaluators' reading in mind, or skip it.
- **Custom modules can be refused** with 0 points. Keep them out of the 14.
- **2D art cost.** The proposal says 2D needs good artwork to avoid looking like a plain gallery. Budget time for the room illustration (not in the estimates above).
- **A fixed room is thin on its own.** With no placeable objects, the depth of the product comes from the contents: well-modelled types and attributes, the media integration, search and tags. Invest there. Also plan the mobile fallback (a simple menu of the same hotspots) from the start, since the hotspot-to-type mapping can feed both.
- **Multi-user demo without a layout conflict story.** The proposal's version number on room layouts was its answer to concurrent edits. Without it, show concurrency another way: unique constraints on sign-ups and friend requests, and two users adding contents or sending chat messages at the same time while a visitor sees live updates.

## 6. Answer to the question in the notes: hardest and safest

**Hardest (cost and risk of ending with 0 points):** Advanced 3D, microservices, ELK, WAF + Vault, RAG and the ML recommendation system, the room editor, WCAG full compliance.

**Safest (low effort, clear acceptance criteria):** ORM, multiple languages, additional browsers, OAuth, PWA, GDPR, health check and backups, Advanced search.

These two lists come from my reading of the subject and the estimates above. The question to the experts in the notes is still worth asking, since their view of how strict the evaluators are about each module is more reliable than ours.

## 7. Data model

The data model (changes to the proposal's schema, the full list of MVP tables, and how to handle type-specific attributes) now lives in [database_schema.md](database_schema.md).
