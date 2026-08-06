# Personal Website — Style Iteration Plan

**Status:** Active iteration
**Date:** 2026-07-10
**Goal:** Move from "generic AI portfolio" to a personal, playful, light-mode, techy-vibe site. Three directions, then pick.

---

## Why iterate at all

The current site (Plan A — already built at `/`, `/work`, `/about`, `/contact`) is solid but reads as:
- Generic "product designer portfolio" — could be anyone
- Dark mode by default — you said you want light
- Light on personality — not enough of your voice, curiosity, ocean/space vibes
- No real interactive signature — scroll-and-read, not play

You asked for: light mode, playful, modern, interactive, techy, with inspiration from gaming/VR/AR/playful landing pages. So I built three alternatives.

---

## Plan A — "Calm Tech" (current site, refactor not rebuild)

**What it is:** A modern editorial portfolio. Hairline borders, sharp type, neutral paper background, a single warm accent color, restrained micro-interactions. Bruno Simon × Brittany Chiang × Linear-lite.

**Vibe:** Restrained, considered, "I make this look easy." Works for headhunters, recruiters, serious product folks. Risk: feels too "product designer template."

**Current state:** Live at https://nicolllee.zo.space — light background, warm accent, four pages already exist.

**Keep if:** You want credibility-first, recruiter-safe, "mature" energy.

---

## Plan B — "Playable Portfolio" (gaming-influenced)

**What it is:** The portfolio as a small game. Light mode but with a CRT-arcade-meets-modern feel. Pixel-detail accent moments. Interactive case-study "level cards" you click to play. A persistent floating BeSci "console" widget. Each hackathon project becomes a "level" with stats (win count, hours, stack) like a game card. Cursor has a custom trail. Scroll = progress bar. Subtle scanline/grain texture overlay. Confetti on key interactions.

**Vibe:** Confident, fun, technically playful, "I build things fast and they work." Energy: like a developer-arcade fusion. References: Bruno Simon's interactive portfolio, T3 retro, sammii.hashnode's color reactive system, the cursor-reveal pattern.

**Concrete features:**
- **Cursor:** Custom trail with color that derives from current page context
- **Hero:** "Press START" interaction — animations begin only when you click
- **Project cards:** Game-cartridge aesthetic — colorful spines, stats, "1st place / 48h / 2 prizes" badges
- **BeSci Engine:** Rendered as a console/dashboard widget with mini-charts
- **Personality section:** Pixel-art style emoji-but-better icons for ocean, space, languages
- **Sound:** Optional subtle chiptune hover sounds (off by default, toggle visible)
- **Color palette:** Cream/paper bg (#FAF8F3), ink black, electric coral accent, sky blue secondary

**Risk:** Could feel gimmicky if not executed with taste. Needs restraint on where the playfulness lands.

**Build effort:** Medium-high. ~6-8 hours of polish work.

---

## Plan C — "VR/AR Spatial" (dimensional, immersive)

**What it is:** The site as a 3D-ish space. Cards float at slightly different z-depths. Scroll = parallax move through a layered "room." Light mode, but with depth via shadows and overlapping elements. Hovering on a project reveals a "card flip" with the case study. A persistent mini-map shows where you are. Sections are floating panels in a 3D-coordinated grid. Smooth WebGL-free CSS transforms.

**Vibe:** Curious, explorable, "there's more here than meets the eye." Closer to a museum exhibition or a Linear product page. References: Refs Gallery's parallax + depth treatment, Linear's "propulsive scroll narrative," arcade UI's spatial logic without the pixel aesthetic.

**Concrete features:**
- **Hero:** Your name at center, surrounded by orbiting vocabulary tags ("behavioural science", "AI", "ocean", "space") that gently float
- **Section transitions:** Camera-zoom or "pan" between sections
- **Project case studies:** Cards that flip on hover, revealing the full story
- **Stats panel:** Floating "trophy case" — hackathon wins, languages, +20%/+30%/+50% impact numbers as 3D-style counters
- **Mini-map nav:** Persistent sidebar showing all sections as a constellation
- **Personality:** "What I'm into" rendered as a star-map of interests (neuroscience, hardware, robotics, ocean, space)
- **Color palette:** White/off-white bg, soft shadows, deep ink, one neon accent (electric violet or coral)

**Risk:** 3D-feel without WebGL can feel dated if the transforms are too obvious. Needs to feel light, not heavy.

**Build effort:** Medium. Mostly CSS transforms + smart scroll handling.

---

## Plan D — "Lo-fi Lab Notebook" (most personal, least portfolio-like)

**What it is:** The site styled as if it's your actual research notebook. Light cream paper texture, handwritten headings on real type, margin scribbles, sticky-note annotations on the side, ink stamps, "BUILDING IN PUBLIC" tags. Sticky-note style bio card. Yellow highlight, red ink corrections, blue ink for thoughts. Each project = a torn-out notebook page. Sections feel like chapters of a thesis. Personal: family, ocean, space, languages woven as marginalia.

**Vibe:** Human, vulnerable, "this is my actual brain." Most personal of the four. References: Research blogs, Medium's reading mode, Drudge Report's analog scrappiness, modern brutalist editorial (David Carson influence, but warmer).

**Concrete features:**
- **Paper texture:** Subtle, warm — not distracting
- **Headings:** Mix of serif and a confident sans (e.g., Fraunces + Inter)
- **Margin notes:** Hand-feel annotations on key paragraphs — your actual thoughts, in a "scrawl" font
- **Project pages:** Look like journal entries with date stamps, doodles, "TIL" notes
- **Sticky notes:** Pull-quotes from your own writing
- **Color palette:** Off-white paper, ink black, navy blue margin, yellow highlighter, red correction ink
- **Personal touches:** Trophies as hand-drawn star stickers, your name in cursive once, your languages each get a tiny flag (without being cringe)

**Risk:** Could feel unserious if not balanced. Needs to read as "intentional aesthetic" not "I gave up on design."

**Build effort:** High for craft. Lower for code. Highest personality payoff.

---

## How to compare

| Dimension | A: Calm Tech | B: Playable | C: Spatial VR | D: Lab Notebook |
|---|---|---|---|---|
| Light mode | ✓ | ✓ | ✓ | ✓ |
| Playful | low | high | medium | medium |
| Techy vibe | low | high | high | medium |
| Personal | low | medium | low | very high |
| Recruiter-safe | very | medium | medium | low |
| Build effort | done | M-H | M | M-H |
| Differentiation | low | high | high | very high |
| Matches your vibe (high-energy, curious, fearless, ocean/space) | partial | high | high | very high |

---

## Recommendation

**Start with B (Playable Portfolio)** as the v2. It hits your brief most directly — gaming inspiration, playful, techy, light mode. Keep A as the "professional fallback" you can switch to via a header toggle.

**Then iterate toward D (Lab Notebook) over time** — D is the most original direction and the one that would actually stand out. B is the faster path to "this is not a template."

If you want C (Spatial), it pairs well with your interest in hardware/physical AI/neurotech — the depth metaphor works.

---

## Next step

Pick one (or describe a hybrid). I'll build it in zo.space. Estimated build time: 2-4 hours of Zo work depending on which direction.

Live routes to compare:
- https://nicolllee.zo.space/ — current Plan A
- (B, C, D to be built)
