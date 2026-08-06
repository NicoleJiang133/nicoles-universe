# Personal Website Handoff

Updated: August 6, 2026 (build 153, v0.3)

## Where things stand

`/lab` is a **playable, route-based game** called **Understanding Nicole**, skinned in the warm paper "Lab Notebook" palette. The game is the information architecture; the palette is the visual skin.

The shell, a full real-content pass, and a round of design refinement are **done**. The three routes are filled with real facts pulled from Nicole's LinkedIn and corrected by her. The builds section has been restructured into a two-shelf cartridge gallery with clickable detail modals, and Route 03 is now a personal "corkboard" awaiting photos. The current job is **finishing content**: Nicole supplying per-build detail + links, and the Route 03 personal assets (book, cat, travel), plus any further copy polish route by route.

Canonical route: **https://nicolllee.zo.space/lab**

Do not edit `/`, `/play`, `/work`, `/about`, or `/contact`. Work only on `/lab`. Promote to `/` only after Nicole explicitly approves.

## The model (decided this session, supersedes the old 4-mission "playthrough")

The *visitor* is the player. The objective is **understanding Nicole**. The three sections are **routes**, not levels: equal, ungated, pick-in-any-order branches (like choosing a storyline), not a 1→2→3 difficulty ladder. The pull comes from a "collect the set" completion meter, not from leveling up.

**The three routes:**
1. **Route 01 · BACKGROUND** — "My background" (work and education)
2. **Route 02 · THE BUILDS** — "Side projects & hackathon builds" (the card grid lives here)
3. **Route 03 · OFF THE CLOCK** — "Me outside of work" (hardware, neuro/AI, trajectory, languages)

The BeSci Engine section was **dropped** on purpose (it overlaps the future `/work` page). Do not re-add a fourth route without Nicole asking.

**Locked architecture:**
- Single route (`/lab`) with view *states* (`boot`, `hub`, `m1`, `m2`, `m3`, `complete`), deep-linkable via hash (`/lab#m2`), progress saved to `localStorage` under `lab_progress`.
- Resume behavior: a returning visitor with a bare `/lab` URL lands on the **hub** (not boot). A **power button (⏻)** in the header returns anyone to the title screen from any view. First-time visitors and hash deep-links behave correctly.
- "Done" logic: no badge on a route until it is opened; opening it flips it to a green-check `done` (we assume they read it); the `Explored 0/3` meter ticks up; **Play again** fully resets `done`.
- Guardrail: every route is directly clickable, plus a "jump to the builds →" escape hatch for time-poor recruiters. Nothing is hard-locked.

## What each screen currently shows (all live, build 153)

**Boot / title** — Nicole's real photo (circular frame), clean serif "Nicole Jiang", one-line proposition ("Behavioural scientist who designs AI products that change behaviour, then tests whether they actually did."), "Press start", and a blinking "▶ insert curiosity to continue". No `nicole.js`, no rainbow wordmark, no "A Playable Portfolio" line (all removed).

**Hub** — player card with the same real photo, role line "Behavioural Science × AI Product Design · London", and the four abilities as an **equipped loadout** (2×2 cards, icon + one-line effect, no bars, no scores, no ranking): Diagnose why · Spot the pattern · Decide what to build · Shape how it feels. Caption: "Most people have one or two of these. The rare part is all four in one person." Below: "choose your route → Understanding Nicole" and the three route cards with the `start here` nudge on the first unexplored one.

**Routes 01–03** — filled with real content (see "Content in place" below).

**Complete** — rocket icon, overline "more to come", headline "Watch this space.", subline "I build out of curiosity, and a belief that real problems are worth solving." A **locked "What comes next"** card is fused directly into two large contact buttons: **Email me** (mailto, coral) and **LinkedIn** (real profile, navy). Small quiet "Play again" and "/work" links below.

## Content in place (from LinkedIn, corrected by Nicole)

**Route 01 — Work:** algo1 (Behavioural Scientist, Sep 2025 to now); Applied Behaviour Change (2024–25, "lifted engagement 20% and wellbeing 30%"); UCL Centre for Behaviour Change (RA, 2024); "Earlier, in China" (2020–23, four roles compressed into one card). **Education:** UCL MSc Behaviour Change (Distinction); UBC BA Psychology (Japanese minor, Dean's List).

**Route 02 — Builds (7 cards, two labeled cartridge shelves):**
- **Software & AI Agents · 4:** Tella ("Launched · in beta"), Basket ("Won · Tokens LDN track"), Drift ("Shortlisted"), Substrate ("Top 6 · 60+ teams").
- **Physical AI & Hardware · 3:** donna.ai ("Won · Best use of ElevenLabs"), EvaOS ("Hardware build"), Mindful Pi ("Won · Overmind track").
- RepVoice was **removed** this session. Basket was **added** from teammate Oriol's writeup (https://www.omorros.com/projects/basket): five AI agents that catch complaints when a product quietly changes its recipe.
- Cards are styled as arcade **game-select cartridges** (colored label band, `SLOT 0X`, grip notches, `INSERT →` cue) and are **clickable**: each opens a detail modal (win tag, name, summary, "The full story" section, optional "See more" link). Close via X, backdrop, or Esc; navigating away closes it too.

**Route 03 — Off the clock:** a personal **corkboard**. Keeps Nicole's existing writing (the hardware turn: Raspberry Pi, 3D printing, soldering; neuro/AI evenings; heading toward safe human-AI interaction and eventually her own company; languages). Redesigned with scrapbook sections and **empty labeled placeholders** for content she'll supply: "On my nightstand" (book cover + title/author/note), "My cat" (2 tilted polaroids, coral pushpins, captions), "Places I have been" (4 travel polaroids, sky-blue pushpins). Polaroids tilt, have hard offset shadows, and straighten on hover. **Languages:** 中文 native · English fluent · 日本語 conversational.

### Open items / content Nicole still owes
- **Per-build detail + links (Route 02):** every card has empty `detail` and `link` fields except Basket (which has a working "See more" link). Nicole sends, per build, a longer story (problem, what she built, her role, outcome) + any link (Devpost/demo/GitHub/LinkedIn); drop into the `detail`/`link` slots and the placeholder is replaced automatically.
- **Route 03 assets:** book (title, author, cover), cat photos + cat's name, travel photos + place names. Slots are built and waiting.
- **donna.ai category:** currently sits under "Physical AI & Hardware" (Nicole's call, based on the "AI for the Real World" theme), but it's a software voice/vision agent with no hardware. Flagged as a possible category slip; a clean fix if she wants it is renaming that shelf "Real-World AI & Hardware". Left as-is pending her decision.
- **Basket framing:** currently uses teammate Oriol's engineering-first line. If Nicole had a specific behavioural/UX role, retune to credit what she brought.
- **Languages:** confirm Japanese "conversational" and that Korean stays dropped.
- **Tella** stated as "Launched · in beta". Confirm safe public line.
- The **algo1 20% / 30% numbers** and all dates — confirm safe to state publicly.

## Design system (Lab Notebook)

**Feel:** light mode only, warm paper background, ink text, hard-edged playful UI, personal research notebook rather than corporate portfolio. Playfulness comes from labels, movement, colour, and interaction, not random decoration.

**Palette (in code as `T`):** Paper `#FAF7F0` · Cream `#F2EBD9` · Ink `#1A1A1A` · Muted `#7A7468` · Coral `#FF5C4D` · Sky `#4DA3FF` · Lime `#B8E847` · Yellow `#F1C40F` · Red `#C0392B` · Navy `#2C3E73`.

Avoid corporate gray, dark mode, AI gradients, mesh backgrounds, glassmorphism, stock photos, generic hero illustrations.

**Live signature elements (keep unless Nicole asks to remove):** custom coral cursor on desktop (hidden on touch); mono labels (`// 01 · BACKGROUND`, `Route 01`, `v0.3 / build 153`); hard offset shadows (`3px 3px 0 #1A1A1A`, hover `6px 6px 0`); rounded cards and pill buttons; SFX toggle (top-right, silent by default, retro blips); power button to title; progress HUD / collection meter; paper-grain overlay; **cartridge-shelf build cards** with detail modals (Route 02); **scrapbook polaroids** with pushpins (Route 03).

**Asset:** the real photo is at `Images/nicole-portrait.png` (workspace) and uploaded to the site as `/images/nicole-photo.png`. Reuse this exact asset on the homepage so the whole portfolio reads as one person.

## Writing rules (now a permanent Zo rule)

For all website copy (`/lab` and any future portfolio route): **never use em dashes** (use a period, comma, colon, or middot). **Avoid AI-style writing**: no "not just X but Y", no "in today's world", no hollow words (seamless, robust, leverage, delve, elevate, unlock, tapestry), no rule-of-three padding, no hedging filler. Plain, direct, short, natural. Keep copy concise, crisp, and punchy.

## Working method

1. Inspect `/lab` with `get_space_route` before changing it.
2. Use `edit_space_route` for focused edits. Don't rewrite the whole route or copy another route into `/lab` without explicit approval.
3. One focused change at a time (content, layout, interaction, or responsive), not all at once.
4. Ask Nicole whenever a fact, metric, date, award, role, project status, or public-disclosure boundary is uncertain. Do not invent anything.
5. Preview the live route and check `get_space_errors` after each meaningful change.
6. Bump the build number (`build 153` → next) only after a meaningful approved change.
7. Keep `/` and `/play` untouched.

## Suggested first message for the new session

> Read `file 'Personal Website Handoff.md'` and `file 'Working with Nicole.md'`. We're continuing the `/lab` game, "Understanding Nicole" (https://nicolllee.zo.space/lab). Do not edit any other route. Inspect `/lab` first. I want to keep filling in content: [I'll paste per-build detail + links for Route 02, and/or the Route 03 personal assets (book, cat photos, travel photos)]. Match my voice, no em dashes, no AI-style writing.

## Files

- `file 'Working with Nicole.md'` — durable, cross-task record of how Nicole makes decisions and wants to be helped (design, content, research, product, career), with the website build as a worked example. Read before proposing changes.
- `file 'Personal Website Design Preferences.md'` — earlier detailed design doc; NOTE it still lists old signature elements (`nicole.js`, rainbow wordmark, sticky notes, traffic-light dots) that no longer exist on `/lab`. This handoff supersedes it. Reconcile if it causes confusion.
- `file 'Personal Website Plan.md'` — earlier strategic plan; useful context, latest decisions take priority.
- `file 'Personal Website Style Plans.md'` — alternatives considered; the game direction above is the chosen one.
