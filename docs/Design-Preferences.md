# Personal Website Design Preferences

> A design system lock for `nicolllee.zo.space`. These rules are the source of truth — change them deliberately, not by drift.
> **Current canonical direction (July 2026): Lab Notebook.** Iterate on `https://nicolllee.zo.space/lab` first. Keep `/` unchanged until a Lab revision is approved and explicitly promoted.

---

## 1. Style direction

**Light mode only. Playful, modern, interactive, techy.** Inspired by the gaming industry, VR/AR, and the best playful landing pages on the internet.

Two reference aesthetics feed the current site:

- **`/lab`** — a lab-notebook aesthetic. Yellow highlighter, red wavy underline, sticky notes, mono margin notes, the feeling of a working notebook.
- **`/play`** — a press-start arcade theme. The boot screen, the cartridge shelf, the "Insert coin. Continue?" prompt, the traffic-light dashboard widgets.

The canonical Lab page is `https://nicolllee.zo.space/lab`. It is the design base for ongoing content and visual revisions. The pure Play direction is retained separately as an experiment and should not be mixed into the Lab route unless explicitly requested.

The canonical site should feel like a personal research notebook — authored, annotated, evidence-led, and still in motion. Each page is a different entry in the same notebook.

---

## 2. Color palette

Eight named colors. The paper + ink foundation plus five accents.

| Token | Hex | Use |
|---|---|---|
| `paper` | `#FAF7F0` | Page background. Warm off-white. |
| `cream` | `#F2EBD9` | Secondary surfaces, tinted panels. |
| `ink` | `#1A1A1A` | Primary text, borders, shadows. |
| `muted` | `#7A7468` | Secondary text. Warm gray-brown — never a cold gray. |
| `coral` | `#FF5C4D` | The dominant accent. Headings, hover states, cursor, press-start hover, the pulsing nav dot. |
| `sky` | `#4DA3FF` | Secondary accent. Logo letter, quiet highlights. |
| `lime` | `#B8E847` | Won badges, `last_ship` pill, success dots. |
| `yellow` | `#F1C40F` | Highlighter. The "change behaviour" highlight in the hero, the H2 highlight on "Behavioural product judgement." |
| `red-ink` | `#C0392B` | Correction ink. Wavy underline on "test whether they actually did". |
| `navy` | `#2C3E73` | Quiet serif. The small "— opening claim" label. |

**Saturation discipline.** Coral is the only color that gets full saturation everywhere. Other accents are either used as fills (lime for badges, sky in the nico.li logo) or as quiet highlights (navy on the small serif label).

**No corporate gray. No AI-vibe gradients. No mesh backgrounds.** The only texture is a subtle dot grid at 4% opacity, and that's it.

---

## 3. Typography

Four type roles. Every piece of text on the site maps to one of them.

**Headings — tight bold sans.**
- Inter or equivalent geometric sans.
- Letter-spacing: `-0.03em` to `-0.04em` on big headlines.
- Line-height: `0.95–1.0` on display sizes; relax slightly on H2/H3.

**Body — regular weight sans.**
- Same family as headings, regular weight.
- Line-height: `~1.6` (relaxed).
- Color: `ink` for primary, `muted` for secondary.

**Mono accents — small uppercase tracked mono.**
- 10–11px.
- Letter-spacing: `0.2–0.3em`.
- Uppercase.
- Color: `ink` or `muted`.
- Used for every label UI: `live_build: true`, `// 01 — the moat`, `~/stats.json`, `besci.engine v1.0`, `output: ipc[]`, `a) diagnosis`, `last_ship`, `a/b)`, `c)`, etc.

**Serif accents — occasional, two roles.**
- A single serif face used in two places only:
  1. Section labels — "the named system →", "— opening claim".
  2. The sticky-note text on the yellow / pink / blue notes.
- The stickies themselves carry the serif feel: a colored card + serif body + the lab-notebook warmth.

**Casing rules.**
- Section mono labels: lowercase.
- Headings: sentence case ("Behavioural product judgement.", "The cartridge shelf.", "What I'm into right now.").
- Body: normal sentence case.

---

## 4. Borders & shadows

**Borders.** Hard `2px` `ink` borders. No soft hairlines. No `1px` on cards.

**Shadows.** Sticker shadows. The toy/diorama / neo-brutalist feel.

- Default card shadow: `3px 3px 0 #1A1A1A`.
- Hover shadow: `6px 6px 0 #1A1A1A`.
- No soft drop shadows. No blur. No `0 4px 12px rgba(...)` anywhere.

**Border radius.**
- Cards: `rounded-2xl`.
- Pills and buttons: `rounded-full`.

---

## 5. Interactive signature elements

These are the things that make the site feel like a game, not a template. Don't remove them. They are the design.

**Press-start boot screen.** The `nicole.js` wordmark renders each letter in a different color — `n` coral, `i` sky, `c` coral, `o` lime, `l` ink, `e` coral, `.` ink, `j` coral, `s` sky (per the latest render rule). The full name only appears after the user clicks **Press start**, with an 8-bit pulse animation on click. This is the signature entrance — see Section 11.

**Custom coral cursor.** A soft-blur red dot that lerps behind the real cursor using `mix-blend-multiply` and a `2px` blur. Hidden on mobile / touch devices.

**Coin confetti.** Clicking "See the 5 projects" spawns 6 `✦` particles that pop up, rotate, and fade. Subtle, satisfying, no library bloat.

**Three sticky notes.** Yellow / pink / blue. Each slightly rotated: `-2°`, `1.5°`, `-1°`. Reserved for personality-tagged callouts in the hero — e.g. "~155h shipped in 2026", "4 languages, 4 prize tracks", "1 yellow highlighter running out".

**Yellow highlighter + red wavy underline.** Used on the hero H1 ("change behaviour" highlighted, "test whether they actually did" wavy-underlined in red ink). The prose itself carries the lab-notebook feel.

**Console / dashboard widgets.** The `~/stats.json` card and the `besci.engine v1.0` layer card both use traffic-light dots (red / green / blue) + mono labels in the header. The "I read dashboards" signal.

**Section labels in `// 01 — the moat` format.** Every section is numbered like a code comment. Reinforces the dev aesthetic.

**`last_ship: 2d ago` green pill.** In the stats card. A tiny detail that makes the site feel alive and current. Update the relative time.

**SFX on/off toggle.** Always visible, top right. Currently a visual placeholder. Sound is real-toggled but silent by default. Don't remove the placeholder — the toggle is part of the signature.

**Nav.** Sticky top bar, semi-transparent paper background, blurs the page underneath. Pulsing coral dot next to `nicole.` in the logo. Section links use the `§` symbol (`§ Moat`, `§ Projects`, `§ Engine`, `§ Vibe`).

---

## 6. Personality expressed through design

**High energy, positive, optimistic, fearless, super extraverted, high curiosity** — all expressed through **color, not copy**. The palette itself (coral + lime + sky + yellow) carries the energy. Avoid muted grays except the `muted` text color.

**Interests (ocean / space / travel / etc.)** are expressed through **copy only**, not imagery. No hero illustrations. No stock photography. Text is the hero.

**`/#vibe` — the four interests.** Each card has a small colored icon container with a `2px` solid border and a `20%` tinted background. Colors cycle through the palette: coral, sky, lime, yellow.

**Bilingual / multilingual** is expressed as small uppercase mono labels. **Avoid flag emoji** — feels cringe. Use language codes in mono.

---

## 7. Content hierarchy

The site must always have these sections, in this order, with this structure.

### HERO
- One bold claim with the yellow highlighter + red wavy underline.
- A 2-line bio.
- Two CTAs.
- 3 sticky notes (yellow / pink / blue) as personality callouts.
- `~/stats.json` console card on the right.

### MOAT — "Behavioural product judgement."
- Yellow highlighter on the H2.
- 4 cards in a 2×2 grid: `a) diagnosis`, `b) patterns`, `c) articulation`, `d) feel`.
- Each card has a tiny `a)` / `b)` / `c)` / `d)` mono label.
- The BeSci Engine sticky note is the callout to the next section.

### PROJECTS — "The cartridge shelf"
- Game-cartridge aesthetic.
- 5 cards.
- Each card: cover emoji, "won" badge (omit if didn't win), title, subtitle, blurb, stack pills, mono footer with hours / prizes / track.
- Hover lifts the card and grows the shadow from `3px` to `6px`.

### ENGINE — "The BeSci Engine"
- `besci.engine v1.0` console widget as the header card.
- 6 layer cards in a 3×2 grid.
- Each layer: number, title, 1-line description, small green status dot.

### VIBE — "What I'm into right now"
- 4 cards in a row.
- Each: colored icon container + title + 1-line description.
- Colors cycle through the palette.

### CLOSING
- "Insert coin. Continue?" CTA section.
- One last playful prompt. Game reference, not a casual one.

### FOOTER
- Minimal.
- Left: `v0.1 / build <n>`.
- Right: email + LinkedIn.

---

## 8. Tone of copy

- First person, opinionated, no hedging.
- Use `I`, not `we`, for personal work.
- **Specific numbers, never vague.** "5 hackathon projects. 4 won something. ~155 hours." — not "many" or "several".
- Acknowledge failure or null results openly. The Vibify card honestly says `0 prizes`.
- Lowercase for section mono labels. Sentence case for headings.
- The closing **"Insert coin. Continue?"** is a deliberate game reference — the site equivalent of a Netflix "are you still watching?" prompt, but playful. It is not casual phrasing; it carries the arcade metaphor.

---

## 9. Hard rules

These break the design. Don't bend them.

- **Light mode only.** No dark mode toggle. The paper + ink + accent palette *is* the design.
- **No corporate gray.** The `muted` text is a warm gray-brown (`#7A7468`), not a cold gray.
- **No generic stock photography or hero illustrations.** Text is the hero.
- **No "AI vibe" gradients or mesh backgrounds.** The only texture is a subtle dot grid at 4% opacity.
- **The 3 sticky-note colors (yellow / pink / blue) are reserved for personality callouts.** Don't use them as primary buttons or section backgrounds.
- **Coral (`#FF5C4D`) is the only color that gets full saturation.** Other accents are fills (lime badges, sky logo letter) or quiet highlights (navy serif label).
- **3px / 6px hard offset shadows only.** No blur shadows. No `rgba(...)` drop shadows anywhere.

---

## 10. Footer signature line

`© Nicole Jiang · London · v0.1 / build 142`

Keep the version number / build number. It is part of the lab-notebook feeling. **Update the build number when shipping meaningful changes** — every section shipped, every interaction shipped, every meaningful visual change bumps the build.

---

## 11. Press-start boot screen

The press-start boot screen **is** the homepage entry. Do not replace it with a regular hero.

- The `nicole.js` rainbow wordmark is rendered with each letter in its own color (per Section 5).
- The "Press start" button must stay.
- The 8-bit pulse on click must stay.
- The full name only appears after the click.

This is the signature. Do not remove it under any pressure to "look more professional" — see Section 13.

---

## 12. Multi-page consistency

Each page should feel like a different "screen" of the same arcade. Examples:

- **Boot screen** — `/` (homepage)
- **Work shelf** — `/work`
- **About / method screen** — `/about`
- **Contact screen** — `/contact`

Visual consistency across all pages is enforced by:

- Same paper background.
- Same ink color.
- Same coral accent.
- Same mono UI labels (`// NN — section name`).
- Same hard-offset shadows (`3px` / `6px`).
- Same sticky-note style where applicable.

Variety comes from **content and page-specific interaction**, never from the visual system. The system stays constant; the screens vary.

---

## 13. What to avoid

- Generic "AI product designer" template energy.
- Long, scrolling, undisciplined copy.
- Soft glassmorphism / blur panels.
- Bootstrap-looking grids.
- Stock illustrations.
- "Professional" / recruiter-default energy that reads as trying to please everyone.
- **Removing the boot screen under any pressure to "look more professional".** The boot screen is the signature. It stays.

---

## Source of truth

Current canonical working route:

- `/lab` — **Lab Notebook direction**, canonical for ongoing content and design revisions.

Supporting routes:

- `/` — Pure Play direction, retained as a separate visual experiment until the Lab version is promoted.
- `/work` — Existing work/archive page; bring it into the Lab system before treating it as final.
- `/about` — Existing about/method page; bring it into the Lab system before treating it as final.
- `/contact` — Existing contact page; bring it into the Lab system before treating it as final.

Canonical Lab page: https://nicolllee.zo.space/lab

Working rule:

1. Revise `/lab` first.
2. Verify content, mobile layout, accessibility, and links.
3. Only then promote the approved Lab version to `/`.
4. Keep `/` unchanged during Lab iteration.

If anything in the canonical Lab route drifts from this document, this document wins. Update the document, then update `/lab` to match.
