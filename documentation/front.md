# What is this doc

Specs for the front. 

# Front: details

Context: subject p. 9 requires a "frontend that is clear, responsive, and accessible across all devices". Evaluators ask every team member to explain their code (p. 2-3, p. 6), and only fully demonstrable modules count (p. 11).

**Decisions (Nov 24)**

| | MVP | If there is time |
|---|---|---|
| Room | 2D pixel-art image with clickable hotspots (§2, §3) | 3D room, built by Matthieu (§1) |
| Menu | Simple text menu, one link per category (§4) | Galaxy menu: category icons orbit like planets (§4) |

Both extras read the same hotspot list as the MVP, so they never block it.

## 1. Why 2D is easier to explain than 3D

**2D (pixel art)**
- Model: a background image + a list of clickable zones. Each object (vinyl player, bookshelf...) has a position, a label and a target page.
- Few concepts: coordinates, scaling, hover and click events.
- Debugging is visual (a misplaced zone is seen immediately).
- The art is separate from the code (the room is just a PNG / SVG).

**Low poly 3D (e.g. React Three Fiber)**
- Needs a scene, camera, lights, meshes, materials, a render loop, raycasting for clicks, glTF model loading.
- Vibe-coded 3D code tends to be dense and hard to justify line by line.
- Extra topics to explain: performance, model size, mobile devices.

**Isometric 3D**
- Either a real 3D scene with an orthographic camera (same complexity as low poly), or 2D sprites sorted by depth with non-obvious math.
- Hardest to justify.

**Trade-off and decision**
- Only real 3D can validate the Major module "advanced 3D graphics with Three.js / Babylon.js" (2 pts, p. 17).
- 14 points are reachable without it, so 3D is an optional upgrade.
- **Decision: 2D for the MVP. If there is time, Matthieu builds a 3D version of the room** (e.g. React Three Fiber). It would count as a bonus module, but the bonus is capped at 5 points, so it only adds points if the buffer modules do not already fill that cap (see [modules_and_workload.md](modules_and_workload.md)).
- Keep the clickable objects as data (`{id, label, x, y, w, h, route}`) so the 3D scene can reuse them: only the room view changes, not the data or the pages behind it.

## 2. Stack options for the 2D version (with React)

### Option 1: Image + DOM / SVG hotspots (recommended)

The room is a PNG or SVG, and each object is a positioned `<button>` on top.

```tsx
const objects = [
  { id: 'vinyl', label: 'Music', x: 12, y: 58, w: 14, h: 12, route: '/music' },
  { id: 'shelf', label: 'Books', x: 60, y: 20, w: 20, h: 35, route: '/books' },
];

function Room() {
  const navigate = useNavigate();
  return (
    <div className="room">
      <img src="/room.png" alt="Your cosy living room" />
      {objects.map(o => (
        <button
          key={o.id}
          aria-label={o.label}
          onClick={() => navigate(o.route)}
          style={{ left: `${o.x}%`, top: `${o.y}%`, width: `${o.w}%`, height: `${o.h}%` }}
        />
      ))}
    </div>
  );
}
```

- Positions in percentages + CSS `aspect-ratio` on the container: hotspots scale with the screen.
- Hover, tooltip and glow effects in plain CSS. Pixel art needs `image-rendering: pixelated`.
- Real DOM buttons: keyboard and screen-reader accessibility work out of the box.
- React Router for navigation. The same `objects` array can drive the mobile menu.

### Option 2: Layered sprites + CSS animation

- Same structure, but each object is its own transparent PNG or sprite sheet.
- Allows animation (spinning record, flickering lamp) with CSS `steps()` animations.
- Still plain React and CSS.

### Option 3: Canvas / Phaser / PixiJS

- Everything is drawn on a `<canvas>`: useful for walking characters or complex animation.
- Canvas content is invisible to screen readers, so a parallel DOM layer would be needed for accessibility.
- Overkill for a showcase room with clickable objects.

## 3. Perspective in the PNG (pseudo-3D look)

- The image is just pixels, so it can be drawn in isometric, one-point perspective or three-quarter view. The code does not change.
- Angled objects fit badly in rectangles. Two fixes:
  - **SVG polygons** over the image (cleaner, recommended):
    ```tsx
    <svg viewBox="0 0 1600 900" className="room-overlay">
      <a href="/music" aria-label="Music">
        <polygon points="320,540 410,500 470,540 380,585" />
      </a>
    </svg>
    ```
    Data becomes `{ id, label, points, route }`. The `viewBox` keeps it responsive.
  - Rectangles with `clip-path: polygon(...)` (the focus outline gets clipped too).
- Boxy objects seen from the front can keep plain rectangles.

Things to watch:
- **Overlap / depth:** order the zones back to front in the DOM so the front object wins the click.
- **Hover highlight:** needs either a cut-out PNG per object aligned with the background, or a CSS outline / glow on the polygon.
- **Art consistency:** one camera angle for the whole room (AI-generated images often mix angles).
- **Pixel-art scaling:** avoid non-integer scaling (blur / distortion), or export at a higher resolution.
- **Mobile:** a wide image becomes small on a phone, so keep the mobile menu fallback.
- **Finding polygon coordinates:** open the image in an editor, or use a small helper that logs click positions as percentages.

## 4. Responsive menu

Decision: the menu is the main navigation on phones, and the room is a richer layer on top of it on larger screens. Both are generated from the same `objects` (hotspot) list, so they always show the same categories.

**MVP: simple text menu**
- One text link per category (books, movies, music, meditation, photography, video games, paintings, and the treasure chest for custom categories), generated from the hotspot list.
- A plain `<nav>` with a list of links: it works with the keyboard and screen readers without extra effort.
- On large screens it stays reachable next to the room (e.g. a collapsible side menu), so no page can only be reached by clicking the image.

**If there is time: galaxy menu**
- The member's avatar sits in the centre, and the category icons orbit around it like planets, on one or two rings.
- Built with CSS (or SVG) animations: each planet is a positioned element rotating around the centre. No game engine needed.
- Each icon stays a real link with a label (shown on hover and focus, always shown on touch screens), so it stays accessible.
- Respect `prefers-reduced-motion`: the orbits stop and the icons stay in place.
- If it is not ready in time, the text menu ships as is. Nothing else depends on it.

## 5. Evaluation talking points

- "The room is a picture, and each clickable object is a rectangle or polygon stored in a list."
- Accessibility (WCAG 2.1 AA Major module) is satisfied by real buttons / links with labels, not by canvas.
- Limitation to mention: the room is fixed, so users cannot rotate or move around it (unlike real 3D).
- The 3D room and the galaxy menu are extras: they reuse the hotspot data, so the MVP never depends on them.
