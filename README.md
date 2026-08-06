# Nicole's Universe

The source for Nicole Jiang's personal site, a portfolio living at [nicolllee.zo.space](https://nicolllee.zo.space).

Behavioural scientist and AI product builder. The site shows the work, the method (the BeSci Engine), and the obsessions, across a few different visual worlds.

## Routes

Each file is a self-contained React page route (Tailwind CSS, `lucide-react` icons). They run on a Bun + Hono server on Zo Space, so there is no separate build config in this repo. The files here are the page source, kept in version control.

| Route | File | What it is |
|-------|------|------------|
| `/` | `routes/home.tsx` | Home. Retro-terminal landing with a playable steer-and-score strip. |
| `/play` | `routes/play.tsx` | Arcade-flavoured "press start" portfolio: moat, projects, engine, vibe. |
| `/lab` | `routes/lab.tsx` | Cartridge/console interactive: three "routes" through background, builds, and life off the clock. Progress saved to `localStorage`. |
| `/work` | `routes/work.tsx` | The serious case-study view: the BeSci Engine, five hackathon builds, day-job outcomes. |
| `/about` | `routes/about.tsx` | The story, the moat, current obsessions. |
| `/contact` | `routes/contact.tsx` | Who to reach out, and who not to, plus direct links. |

## Docs

Planning and design notes in `docs/`:

- `Plan.md` · the overall site plan
- `Handoff.md` · working state and what is still open
- `Design-Preferences.md` · visual direction and voice
- `Style-Plans.md` · style explorations per route

## Editing

These routes are edited through Zo Space tools, not by running a local dev server. The copies here mirror the live routes so the work is backed up and diffable. To change the live site, edit the route in Zo Space, then update the matching file here.

---

Built by Nicole Jiang · London
