# Personal Website Handoff

Updated: August 9, 2026 (skatepark v4.0 "the ride" (3D WebGL), live on `/lab`, pending Nicole's review)

## Where things stand

`/lab` is now **the ride v4.0**: a real 3D world, not a 2D fake. A Three.js scene (esm.sh pin `three@0.170.0`) fills the viewport: sunset gradient sky, drifting faceted clouds, floating torus rings, London skyline, cream ground with grid, and a winding ink road (ribbon mesh, acid dashes, checkered start/finish). A low-poly skateboard (ink deck, acid underside, spinning wheels) rides the road; scroll progress drives its position along the curve with a chase camera, carve roll in turns, and a kickflip each time a new section activates. Content sits in floating cream cards over the world: hero (player card with photo, PLAYER_ROWS), Spot 01 Background, Spot 02 Builds, Spot 03 Outside (tall two-card section), then the finish line outro. HUD bottom-left tracks spot + ride progress. Chrome: top-left brand pill, top-right live London clock.

**Content additions in v4.0 (Nicole's request):**
- Background card: added "day to day at algo1" (Diagnose / Design / Test bullets) and "currently honing" chips (cs fundamentals, reading AI-written code, figma + ux craft, experiment design).
- Builds: each of the six builds now has a "Why it matters" line under the blurb, and won tags carry a Trophy icon.
- Outside card: PERSON_ROWS (mom of two cats; travel + food; Manus Fellow, still organizing community events; lately chewing on HRI and the trust layer) plus three generated polaroid illustrations (`/images/polaroid-cats.png`, `-travel.png`, `-food.png`, flat sticker style matching the palette; source files in `assets/`).
- **Sticker wall** (second card in the Outside section): visitors write a thought, it "folds into a paper plane" (Send icon flies off screen via `pkFly` keyframes) and POSTs to **`/api/thoughts`** (new Hono API route). The API rate-limits per IP (5 per 10 min), caps text at 500 chars, and appends to `thoughts.jsonl` in this repo. If a `ZO_API_KEY` secret exists in Settings > Advanced, it also fires `/zo/ask` to email Nicole each thought ("New thought on your sticker wall"). Without the key, thoughts still land in the jsonl file and can be read anytime.

Canonical route: **https://nicolllee.zo.space/lab** (public). `/` still holds the older 2D skatepark copy and was NOT touched.

## How we got here (for context, not to redo)

Nicole reviewed reference sites (Bruno Simon, Robby Leonardi's interactive resume, ryo.lu, Natalie Chan) for storytelling through interaction design, and decided the 3D/game-engine approaches (Bruno, ryo.lu) were too heavy to build well right now, but wanted something with a similarly strong unifying metaphor, closer to how Natalie Chan uses a ship-in-an-ocean motif to hold her whole site together. Nicole's own metaphor: skateboarding, tying into her personal life.

We iterated through scrappy preview routes (`/lab-preview-a` through `/lab-preview-a6`, `/lab-preview-b`) to find the feel before touching the real route:
- Option A (boxes, cards) beat Option B (a draggable/flingable node playground) on first read, but still felt static.
- Research into current high-DAU web games (used for inspiration on interactivity, not lifted wholesale) pushed the design toward motion tied to scroll rather than static cards.
- Nicole asked for a skateboard as a guide element; `/lab-preview-a4` added it bobbing over the route cards.
- Nicole asked to separate content so the first screen isn't overloaded, and to make the skateboard ride feel like the connective thread rather than a decoration; `/lab-preview-a5` and `/lab-preview-a6` reworked this into the current scroll-linked ride.
- Nicole approved `/lab-preview-a6` as the design to keep. All preview routes were then deleted (`/lab-preview-a`, `-a2`, `-a3`, `-a4`, `-a5`, `-a6`, `-b`) and the approved design became `/lab` itself.

If any preview route is ever needed again, its history is still recoverable via `get_space_route_history` + `undo_space_route` on `/lab` (the deleted preview routes' own history is gone once purged, but `/lab`'s own version history includes the pre-a6 state).

## What `/lab` was before (skatepark v1.0, superseded by v3.0 above)

**Structure:** one page, top nav (`← home`, `/work ↗`), hero, then a "journey" section with a sticky current-spot label and a dashed vertical track down the left side. A skateboard SVG rides along the track at a vertical position driven by scroll progress (`useRideProgress`), bobbing continuously and doing a 360 flip when the visitor first scrolls ("drop in"). Below the track are the three scenes as full sections; a closing contact section ends the page. No boot screen, no hub, no localStorage progress, no power button, no SFX toggle, no custom cursor.

**Hero:** live London-time pill ("right now · building the BeSci Engine at algo1 · [HH:MM:SS] London"), headline "Nicole's skatepark.", one-line positioning, a "drop in and follow the line" button that scrolls to the first scene.

**Scene 01 · Background** (accent coral): intro paragraph on being a behavioural scientist at algo1, then a work-history list pulled from `ROLES`: algo1 (Sep 2025–now), Applied Behaviour Change (2024–25), UCL Centre for Behaviour Change (2024).

**Scene 02 · Builds** (accent lime): intro line, then a 2-column grid of tap-to-expand "build stickers" (`BUILDS` array) covering Tella, Basket, Drift, donna.ai, EvaOS, Mindful Pi. No separate detail/link fields, no "See more" links.

**Scene 03 · Outside the clock** (accent yellow): two-column layout, left is prose (hardware turn: Pi, 3D printing, soldering; neuro/AI evenings; heading toward safe human-AI interaction and eventually her own company), right is an interest chip row (physical AI, neurotech, visual thinking, founder path) plus a languages line (中文 native, English fluent, 日本語 conversational). No corkboard/photo elements in this version.

**Closing:** "session complete" / "Keep in touch?" with Email me and LinkedIn buttons, footer "nicole jiang · skatepark v1.0 · london · 2026".

## Open items for Nicole

- **Approve v4.0 and decide on `/`:** keep `/` on the old 2D copy or promote the ride.
- **Sticker wall delivery:** add a `ZO_API_KEY` secret (Settings > Advanced) to get each thought emailed instantly; without it, thoughts accumulate in `thoughts.jsonl` (ask me to read them anytime).
- **Polaroids are AI illustrations**, not real photos. Swap in real cat/travel/dish photos anytime (replace the three asset files or ask me).
- Unconfirmed, carried over: Japanese "conversational" level, algo1 framing details, and all dates: pending Nicole's confirmation they are safe to state publicly.
- WebGL needs a GPU-capable browser; there is no static fallback yet. If the canvas fails to init, the page still shows content cards on the paper background (canvas stays invisible via the `ready` class gate).

## Design system (current palette)

**Palette (in code as `T`):** Paper `#F4EDDE` · Cream `#EAE2CE` · Ink `#0E0E0E` · Muted `#6B6558` · Flame `#FF3D1A` · Acid `#D6FF3D` · Sky `#4DA3FF` · Navy `#2C3E73` · Yellow `#F1C40F` · White `#FFFDF7`. Sans (Inter/system) for headings and body, monospace for labels/kickers/HUD chrome. (The older Lab Notebook palette below is superseded; the flame/acid set won during the Aug 8 sharpening pass.)

Avoid corporate gray, dark mode, AI gradients, mesh backgrounds, glassmorphism, stock photos, generic hero illustrations.

## Writing rules (permanent, applies to this page)

For all website copy on `/lab` and any future portfolio route: never use em dashes (use a period, comma, colon, or middot). Avoid AI-style writing: no "not just X but Y", no "in today's world", no hollow words (seamless, robust, leverage, delve, elevate, unlock, tapestry), no rule-of-three padding, no hedging filler. Plain, direct, short, natural.

## Working method

1. Inspect `/lab` with `get_space_route` before changing it.
2. Use `edit_space_route` for focused edits. Don't rewrite the whole route or copy another route into `/lab` without explicit approval.
3. One focused change at a time (content, layout, interaction, or responsive), not all at once.
4. Ask Nicole whenever a fact, metric, date, award, role, project status, or public-disclosure boundary is uncertain. Do not invent anything.
5. Preview with `agent-browser` against `http://localhost:3099/lab` and check `get_space_errors` after each meaningful change.
6. Keep `/`, `/play`, `/work`, `/about`, `/contact` untouched.

## Suggested first message for the new session

> Read `file 'Personal Website Handoff.md'` and `file 'Working with Nicole.md'`. We're continuing `/lab`, "the skatepark" (https://nicolllee.zo.space/lab), a scroll-driven skateboard ride with three scenes: Background, Builds, Outside the clock. Do not edit any other route. Inspect `/lab` first. Today I want to: [describe the next change]. Match my voice, no em dashes, no AI-style writing.

## Files

- `file 'Working with Nicole.md'` — durable, cross-task record of how Nicole makes decisions and wants to be helped (design, content, research, product, career), with the website build as a worked example. Read before proposing changes, on this project and any other.
- `file 'Personal Website Design Preferences.md'` — earlier detailed design doc; superseded by this handoff and the skatepark redesign. Reconcile if it causes confusion.
- `file 'Personal Website Plan.md'` — earlier strategic plan; useful context, latest decisions take priority.
- `file 'Personal Website Style Plans.md'` — alternatives considered; superseded by the skatepark direction above.
