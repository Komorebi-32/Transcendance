# What is this doc

Analysis of every module in the subject, and how well each one fits our idea. It is the reference for choosing or swapping modules. The modules we chose and the workload estimates are in [modules_and_workload.md](modules_and_workload.md).

Sources: `en.subject.transcenDANCE.pdf` (v21.1), `notes.md`, `ft_transcendence Architecture and Tech Stack Proposal-1.pdf` (Merve, Nov 10 2026; "the proposal" below).

# Module analysis

Our idea: a **showcase room** where each user shares books, films, music, photos, games and paintings through clickable objects in a cosy 2D pixel-art room.

## 1. How to read the tables

**Relevance** (to our idea)
- **Essential**: the product does not work without it, or it is already mandatory.
- **High**: clear product value and a natural fit.
- **Medium**: useful, but we would be adding it mostly for points.
- **Low**: forced fit; only worth it if points are missing.
- **N/A**: needs a game or a technology we do not have (the subject says these modules require at least one game).

**Time** is a rough estimate in person-days (p-days) for one developer who is still learning the stack. **1 p-day = 6 hours of focused work** (not 8, because meetings, debugging detours and context switching eat into a day). It includes tests and being demo-ready, and has a margin of about ±50%. It is not a promise.

**Complexity**: Low, Med or High. It covers the technical difficulty and also the risk of a partial result, which scores 0.

**In proposal**: where the module appears in the proposal: Core (14-point plan), Buffer, Stretch, or "not listed".

**Our plan**: **Core** (the 14 required points), **Buffer** (extra points: a safety margin and the bonus), **Stretch** (only if there is time, not counted), **No**, or **–** when the module needs a game.

## 2. All modules evaluated

### Web

| Module | Pts | Relevance | Time (p-days) | Complexity | In proposal | Our plan | Notes |
|---|---|---|---|---|---|---|---|
| Frontend + backend framework (Major) | 2 | Essential | 6-10 (stack setup and learning, shared by the team) | Med | Core | Core | React + NestJS, both in TypeScript. No feature work of its own, but the setup is real: scaffolding both sides, API contract and shared types, auth session wiring, Nest's learning curve (modules, dependency injection, decorators, which are hard to explain line by line at evaluation). Counts once for both, so do not also claim the minor frontend and minor backend modules. |
| Real-time features, WebSockets | 2 | High | 4-6 | Med | Core | Core | Presence in a room, live chat, and visitors seeing new contents appear. Reconnect logic is the hard part. We have ft_irc experience. No object-placement sync (the room is fixed), so the demo must still show updates across clients, graceful disconnects and broadcasting. |
| User interaction (chat, profile, friends) | 2 | High | 6-8 | Med | Core | Core | Needed anyway for sharing between members. Overlaps with standard user management on friends. |
| Public API (key, rate limit, docs, 5+ endpoints) | 2 | Medium | 5-7 | Med | Stretch | No | Natural fit: "read and manage showcase contents". The OpenAPI docs can double as documentation. A candidate if a Major is needed. |
| ORM | 1 | High | 1-2 | Low | Core | Core | Almost free once the stack is chosen. |
| File upload and management | 1 | Essential | 4-6 | Med | Core | Core | Needed for artworks and photos. Needs validation on both sides, access control, preview, progress bar and delete. |
| Custom design system (10+ components) | 1 | High | 4-6 | Low-Med | Core | Core | The cosy pixel-art identity is part of the product. A palette, typography and icons are needed anyway. |
| Advanced search (filters, sort, pagination) | 1 | Medium | 3-4 | Low-Med | Buffer | Core | Find rooms, users and items by category or tag. Pairs well with image tagging. With a fixed room, filtered lists and search are the main way to browse content. |
| Notification system | 1 | Medium | 3-4 | Low-Med | Buffer | Buffer | The wording covers ALL create, update and delete actions, so we must agree the scope first. Delivered live over the WebSocket hub. |
| Progressive Web App | 1 | Medium-High | 2-3 | Low-Med | not listed | Buffer | Fits the mobile concern. Needs a manifest, a service worker and offline support. |
| Server-Side Rendering | 1 | Low-Med | 3-5 | Med | not listed | No | Mostly free with Next.js, painful with Vite. Useful for link previews of shared rooms. |
| Real-time collaborative features | 1 | Low | 4-6 | Med-High | Buffer | No | The room is not editable in the MVP, so there is little to collaborate on. |

### Accessibility and internationalization

| Module | Pts | Relevance | Time (p-days) | Complexity | In proposal | Our plan | Notes |
|---|---|---|---|---|---|---|---|
| WCAG 2.1 AA, screen readers, keyboard | 2 | Medium-High | 6-10 | Med-High | not listed | No | The 2D room with real buttons and a text-menu fallback makes this plausible. A full audit is the cost. |
| Multiple languages (3) | 1 | High | 2-3 | Low | Buffer | Buffer | Cheap if all text goes through i18n from day one. The notes are already FR/EN. |
| RTL language | 1 | Medium | 2-4 | Med | not listed | No | Layout mirroring is needed, and a mirrored pixel-art room is awkward. |
| Additional browsers (2) | 1 | Medium | 2-3 | Low | Buffer | Buffer | Lower risk in 2D than in WebGL. |

### User management

| Module | Pts | Relevance | Time (p-days) | Complexity | In proposal | Our plan | Notes |
|---|---|---|---|---|---|---|---|
| Standard user management | 2 | Essential | 4-6 | Med | Core | Core | Profile editing, avatar, friends with online status, profile page. |
| OAuth 2.0 | 1 | High | 1-3 | Low-Med | Core | Core | The 42 login is the obvious provider. |
| 2FA | 1 | Medium | 2-3 | Low-Med | Buffer | Buffer | TOTP libraries exist. Needs a secret per user and a second login step. |
| Advanced permissions (roles, CRUD users) | 2 | Medium | 5-7 | Med | not listed | No | Maps to admin, moderator, user and guest, and to visibility rules. |
| Organization system | 2 | Low | 5-7 | Med | not listed | No | Could be "clubs" or shared rooms, but it is a forced fit. |
| User activity analytics dashboard | 1 | Low-Med | 3-4 | Low-Med | not listed | No | E.g. visits to my room. Needs an event log. |
| Game statistics and match history | 1 | N/A | - | - | - | – | Requires a game. |

### Artificial intelligence

| Module | Pts | Relevance | Time (p-days) | Complexity | In proposal | Our plan | Notes |
|---|---|---|---|---|---|---|---|
| Image recognition and tagging | 1 | High | 3-5 | Med | Stretch | Core | Tags uploaded artworks and photos and feeds search. Hosted API or a small model; may need a Python container if the backend is not Python. |
| Recommendation system (ML) | 2 | High (idea), costly | 8-12 | High | Open question | No | "Rooms you might like" is a great fit but the hardest AI module. Needs data and a continuous improvement story. |
| Content moderation AI | 1 | Medium | 3-5 | Med | Open question | Buffer | Public uploads make this legitimate. Can share the call that image recognition makes on each upload. An external moderation API is the cheap route. |
| Sentiment analysis | 1 | Low-Med | 2-3 | Low-Med | not listed | No | E.g. on chat messages or content descriptions. |
| Voice / speech integration | 1 | Low-Med | 3-4 | Med | not listed | No | Accessibility angle (text-to-speech of descriptions). |
| LLM system interface | 2 | Low-Med | 6-8 | High | not listed | No | Streaming, error handling and rate limiting are required. No natural use for it in the product. |
| RAG | 2 | Low | 8-10 | High | not listed | No | No dataset to query. |
| AI opponent | 2 | N/A | - | - | - | – | Requires a game. |

### Cybersecurity

| Module | Pts | Relevance | Time (p-days) | Complexity | In proposal | Our plan | Notes |
|---|---|---|---|---|---|---|---|
| WAF/ModSecurity (hardened) + HashiCorp Vault | 2 | Low-Med | 6-8 | High | not listed | No | Product-independent infra work, with a risk of breaking the app with strict rules. |

### Gaming and user experience

| Module | Pts | Relevance | Time (p-days) | Complexity | In proposal | Our plan | Notes |
|---|---|---|---|---|---|---|---|
| Advanced 3D graphics (Three.js / Babylon) | 2 | Low for the MVP | 15-25 | High | Core | Stretch | The proposal's room is 3D. We build 2D for the MVP; Matthieu may build a 3D room if there is time. It would count as bonus, within the 5-point cap. |
| Gamification (3 of: achievements, badges, leaderboards, XP, daily challenges, rewards) | 1 | Medium | 4-6 | Med | not listed | No | Does not need a game. E.g. "collector" badges and a profile-completion level. Keep it to 3 well-done features. |
| Advanced chat | 1 | Low-Med | 3-5 | Med | not listed | No | Needs basic chat first. Several bullets mention games (invites, tournament notices), so an evaluator may question it. |
| Web-based game, remote players, multiplayer 3+, second game, tournament, customization, spectator | 2 / 2 / 2 / 2 / 1 / 1 / 1 | N/A | - | - | - | – | We build no game. |

### DevOps

| Module | Pts | Relevance | Time (p-days) | Complexity | In proposal | Our plan | Notes |
|---|---|---|---|---|---|---|---|
| Health check, status page, automated backups and DR | 1 | Medium | 2-3 | Low-Med | not listed | No | A cheap infra point; backups of the DB and the media volume make sense for user content. |
| Prometheus + Grafana | 2 | Low (product) | 4-6 | Med | not listed | No | Independent of product code. Fewer moving parts than ELK. |
| ELK log management | 2 | Low (product) | 5-8 | High | not listed | No | Memory hungry (Elasticsearch). Independent of product code. |
| Backend as microservices | 2 | Low (and rejected) | 8-12 | High | Rejected | No | Our notes and the proposal both choose a modular monolith. |

### Data and analytics

| Module | Pts | Relevance | Time (p-days) | Complexity | In proposal | Our plan | Notes |
|---|---|---|---|---|---|---|---|
| GDPR compliance | 1 | High | 3-4 | Med | Buffer | Buffer | We store personal data and uploads, and Privacy Policy pages are mandatory anyway. Needs outgoing email for confirmations. |
| Data export and import | 1 | Medium | 3-4 | Low-Med | not listed | No | "Export my showcase" is a reasonable product feature. |
| Advanced analytics dashboard | 2 | Low-Med | 6-8 | Med | not listed | No | Charts, real-time updates, PDF/CSV export. |

### Blockchain

| Module | Pts | Relevance | Time (p-days) | Complexity | In proposal | Our plan | Notes |
|---|---|---|---|---|---|---|---|
| Tournament scores on blockchain / ICP backend | 2 / 1 | N/A | - | - | - | – | No tournaments. The ICP backend is also incompatible with SSR. |

### Modules of choice (candidates, to be justified in the README)

| Module | Pts | Relevance | Time (p-days) | Complexity | In proposal | Our plan | Notes |
|---|---|---|---|---|---|---|---|
| Room editor (drag and drop objects, save layouts) | 2 | Post-MVP | 10-15 | High | Stretch | No | Out of scope: the MVP room is not editable. The proposal also flags it as refusable. It would need the `room_objects` table and a layout version (see [database_schema.md](database_schema.md)). |
| External media embeds (YouTube / Spotify / oEmbed from the clickable objects) | 1 | High | 3-4 | Med | not listed | No | This is the core of our idea (vinyl player opens a playlist), so we build it anyway. Evaluator risk: it may be judged too small to count as a module. Needs a solid README justification. |

## 3. Comparison with the proposal

| Topic | Proposal | Our notes | Verdict |
|---|---|---|---|
| Rendering | 3D room (React Three Fiber), 2D as escape route | 2D pixel art, hotspots on an image | **Diverges.** The Advanced 3D module (2 pts) leaves the 14-point plan. 3D stays a stretch, by Matthieu if there is time. |
| Architecture | Modular monolith | Same ("Amandine said microservices are a pain") | Agree. |
| Frontend | React + TypeScript | React + TypeScript (Vite + React Router) | Agree, minus Three.js. |
| Backend | Go + Gin + GORM | NestJS + TypeScript | Diverges. NestJS is the proposal's own "lowest risk" candidate A without the 3D layer: one language on both sides, shared types, WebSocket gateways and validation built in. |
| Room editing | "Place it in the room" in the minimum product | Not editable in the MVP | Diverges. It is a scope cut. It removes the room-editor stretch, the `catalog_items` and `room_objects` tables, and the room layout version (see [database_schema.md](database_schema.md)). |
| Real-time | One WebSocket hub per room, broadcasting presence, object changes, guestbook entries and chat | Same hub per room | Agree, but narrower: no object-change broadcast and no guestbook. Presence, chat, new contents and notifications remain. |
| Image recognition | Stretch idea | Listed in the meeting notes | Agree, and promoted into the core plan. |
| Core modules | 9 modules = 14 pts | 10 modules = 14 pts | 8 of the 9 stay valid. Advanced 3D is replaced by Advanced search + Image recognition. |

Proposal core plan under our 2D decision:

| Proposal core module | Pts | Still valid in 2D? |
|---|---|---|
| Frameworks (front + back) | 2 | Yes |
| Real-time features | 2 | Yes |
| User interaction | 2 | Yes |
| Standard user management | 2 | Yes |
| **Advanced 3D graphics** | **2** | **No: replaced** |
| ORM | 1 | Yes |
| File upload | 1 | Yes |
| OAuth 2.0 | 1 | Yes |
| Custom design system | 1 | Yes |
| **Total still valid** | **12** | 2 more points needed |

## 4. Hardest and safest modules

**Hardest (cost and risk of ending with 0 points):** Advanced 3D, microservices, ELK, WAF + Vault, RAG and the ML recommendation system, the room editor, WCAG full compliance.

**Safest (low effort, clear acceptance criteria):** ORM, multiple languages, additional browsers, OAuth, PWA, GDPR, 2FA, health check and backups, Advanced search.

These two lists come from our reading of the subject and the estimates above. The question to the experts in the notes is still worth asking, since their view of how strict the evaluators are about each module is more reliable than ours.
