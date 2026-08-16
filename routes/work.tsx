import type { CSSProperties } from "react";
import { ArrowRight, ArrowLeft, Beaker, Radio, Sparkles, Headphones, Waves, Music2, Bot, Building2, Mic, BookOpen, Wrench } from "lucide-react";

const theme = {
  bg: "#0a0e1a",
  surface: "#111726",
  surfaceHi: "#1a2236",
  fg: "#f5f1e8",
  muted: "#8b95a8",
  accent: "#ff7a5c",
  accentSoft: "rgba(255, 122, 92, 0.15)",
  border: "rgba(255, 255, 255, 0.08)",
};

// The system I'm building at algo1 — the named framework = moat amplifier.
const system = {
  icon: Beaker,
  label: "The system",
  title: "The BeSci Engine",
  subtitle: "A 6-layer operating system for AI products that change behaviour",
  context: "Built at algo1.ai · 2025 – present · solo practitioner",
  role: "Design, build, governance",
  problem:
    "Most AI products ship nudges without diagnosing the behaviour, without testing whether they worked, and without learning across interventions. The result: a portfolio of one-off bets, no compounding knowledge, growing ethical risk. Then the EU AI Act and DSA show up.",
  approach: [
    "Diagnose the behaviour with COM-B (Capability, Opportunity, Motivation) before designing anything.",
    "Pick BCTs from the 93-technique taxonomy that target the specific COM-B gap, mapped through EAST and MINDSPACE.",
    "Run as a real A/B test with a hypothesis, a primary metric, segmentation, and decay tracking — calibrated to realistic 1–5% effect sizes.",
    "Document every test as an IPC (Intervention Performance Card) with confidence rating, effect size, and contextual modifiers.",
    "Govern every nudge through APEASE (Acceptable, Practicable, Effective, Affordable, Side-effect-free, Equitable) with a hard 3–5 nudge budget per shopping trip.",
    "Close the loop: AI helps generate the next hypothesis, search the IPC library, and detect when an intervention is decaying.",
  ],
  outcome:
    "A working system that turns every nudge into a unit of evidence. The IPC library is the compounding moat — every test makes the next one smarter.",
  line: "How I run behavioural science on AI products.",
};

// Case studies — impact first, decision and trade-off visible.
const hackathons = [
  {
    id: "tella",
    icon: Radio,
    badge: "Won 2 prize tracks · 48-hour MVP · still iterating",
    title: "Tella — voice AI for the gap between care visits",
    context: "AI Engine Hackathon · Aug 2025 · 3-person team",
    role: "Co-founder, product & behavioural design",
    problem:
      "Many care systems rely on scheduled visits. Health needs, medication routines, loneliness, and anxiety don't follow a timetable. Families know this. Carers know this. The product didn't.",
    approach: [
      "Started with the user, not the tech: a family caregiver managing a parent with dementia, the 11pm moment when they can't reach anyone.",
      "Designed Tella to call the person proactively — voice, not screen — using ElevenLabs, Twilio, Anthropic, and ACI.dev for multi-agent orchestration.",
      "Led the conversation design with a behavioural lens: when to speak, when to listen, when to escalate to a human, when to stay silent.",
      "Built a safeguarding loop so families see summaries, not transcripts — care without surveillance.",
    ],
    outcome:
      "Won Best Use of ACI.dev in an Agentic Product + Largest Systems Built with Leap. Continued as a personal project after the hackathon — still iterating on the conversation patterns and the IPCs I designed for elderly users.",
    line: "The smallest thing that removes the most pain.",
  },
  {
    id: "donna",
    icon: Mic,
    badge: "Won Best Use of ElevenLabs · 5-hour build · 4 women",
    title: "donna.ai — a voice agent for the silence in delivery tracking",
    context: "AI for the Real World Hack · 4-person all-women team",
    role: "Product lead · user narrative · demo",
    problem:
      "A frozen dot on a delivery tracking page isn't neutral. It's anxiety. The customer fills the gap with the worst assumption: that nobody on the other end cares. 84% of customers who feel that way won't return — not to the carrier, to the brand whose name is on the order.",
    approach: [
      "Reframed the problem: the issue wasn't the delay, it was the silence. The fix didn't require a faster delivery — it required a voice before silence became indifference.",
      "Built a multimodal agent that listens to the driver (dashcam + voice), classifies the issue, and calls the customer with real context.",
      "Frame I designed: 'Your driver has hit a problem — can we reschedule to 4pm?' The experience that was about to become a lost customer becomes something else entirely.",
      "Kept the human in the loop on the retailer side — live visibility into delays, damage flags, the full picture.",
    ],
    outcome:
      "Working MVP in 5 hours. 124 reactions, 16 comments, multiple inbound from retail operators. 3 of us had worked in retail and knew exactly what that silence costs.",
    line: "Pixels in. Action out. In seconds.",
  },
  {
    id: "meditation",
    icon: Waves,
    badge: "Won Overmind track · privacy as architecture, not feature",
    title: "Offline meditation device — Raspberry Pi, no screen, no internet",
    context: "On-device AI Hackathon · 4-person team",
    role: "Behavioural & interaction design · memory personalisation",
    problem:
      "Most meditation apps ask you to detach from your phone while still using your phone. The medium undermines the message. And people dealing with anxiety, sleep issues, or early mental health concerns are often the most reluctant to talk to anything that 'remembers' them, because they don't know where that data goes.",
    approach: [
      "Built a fully offline device on a Raspberry Pi: no screen, no internet, no connectivity at all. You speak, it picks up on your mood, generates a guided session, voice and soundscape, entirely on-device.",
      "Designed the memory layer (cognee, local) to adapt to a person across sessions without ever feeling like surveillance.",
      "Same memory layer that personalises sessions could, by the person's choice, become something to bring into a therapy conversation — on their terms, not by default.",
    ],
    outcome:
      "Won the Overmind track. The deeper point landed with judges: privacy as architecture, not a privacy feature bolted on.",
    line: "The medium has to match the message.",
  },
  {
    id: "repvoice",
    icon: Headphones,
    badge: "Top 3 (Productivity track) · pharma-domain problem",
    title: "RepVoice — voice AI OS for UK pharma field reps",
    context: "Voice AI Hack London · 4-person team",
    role: "Product lead · behavioural design",
    problem:
      "Pharma field reps finish a call, sit in a car park at 6pm, and have to do 45 minutes of post-call admin: CRM fields, MHRA adverse event alerts, Veeva auto-fill, brief themselves on the next visit. Every minute is paperwork, not selling.",
    approach: [
      "Mapped the workflow first: which fields, which order, which information had to be captured for compliance vs. which was 'nice to have.'",
      "Built a voice-first OS: speak the post-call summary, we handle CRM fields, flag MHRA adverse events automatically, pre-fill Veeva, and voice-brief the rep on the next visit.",
      "Designed the safety rails: any adverse event mention triggers a structured capture flow before the summary continues.",
    ],
    outcome:
      "Working demo in one weekend. Top 3 in the Productivity track. Validated the pattern: voice in, paperwork out.",
    line: "Voice in. Paperwork out.",
  },
  {
    id: "vibify",
    icon: Music2,
    badge: "6-hour MVP · user-research first",
    title: "Vibify — music recommender that knows your context, not just your genre",
    context: "London AI Hack #2 · 3-person team",
    role: "Lead PM · user research with Prolific",
    problem:
      "Most music apps feel great until you need the right track for the exact moment. Precision drops, you end up skipping. Recommendations miss your mood, not your playlist.",
    approach: [
      "Started with users, not features: Prolific pulse survey + on-the-ground chats to map the pain and the JTBD ('match my vibe so I can get into flow').",
      "Translated musical features (tempo, rhythm, energy, timbre) into tokens to learn subjective preferences beyond labels like 'lo-fi' or 'indie.'",
      "Blended preferences with objective signals (weather + calendar) — deep work Monday ≠ sunny Saturday.",
      "Designed for context & motivation to close the intention–behaviour gap.",
    ],
    outcome:
      "Working MVP in 6 hours. GitHub open-sourced. The pattern that has held: even in a 6-hour build, lead with a behavioural-science lens.",
    line: "Match my vibe so I can get into flow.",
  },
];

// Work projects from algo1 + earlier roles — measurable outcomes, not vibes.
const dayJob = [
  {
    id: "abc",
    icon: Building2,
    badge: "+20% engagement · +10% retention · +30% wellbeing",
    title: "A/B-tested public-health nudges",
    where: "Applied Behaviour Change Consultancy · Jun 2024 – Mar 2025",
    role: "Product & Behavioural Science Associate (Intern)",
    story:
      "End-to-end product lifecycle for AI-driven public health comms and digital healthcare tools. Embedded COM-B into PRDs and dev-ready stories. Prototyped an interactive onboarding carousel applying Easy, Timely, Attractive (EAST). Triaged 8+ live bugs pre-launch. Built automated Notion insight repos (Behavioural Science Playbook, Survey QA) that cut the team's learning cycle time.",
    line: "Behavioural science is a measurement discipline, not a vibes discipline.",
  },
  {
    id: "wuhan",
    icon: Wrench,
    badge: "–50% workplace stress · +15% team productivity",
    title: "Workplace wellbeing intervention program",
    where: "Wuhan Yudian Psychological Counselling Co. · Apr 2022 – Sep 2023",
    role: "Behavioural Intervention Specialist",
    story:
      "Designed and ran evidence-based behavioural interventions that measurably reduced workplace stress. Benchmarked 10+ wellbeing platforms and built feedback loops to support sustained behaviour change post-launch. This is where I learned: the difference between a one-off workshop and a sustained intervention is the measurement system behind it.",
    line: "One-off workshops are feelings. Feedback loops are outcomes.",
  },
  {
    id: "dtise",
    icon: BookOpen,
    badge: "+40% platform engagement · faster PMF",
    title: "Enterprise SaaS UX revamp",
    where: "DTise AI-Tech · Aug 2020 – Mar 2021",
    role: "Product Associate (UX Focused)",
    story:
      "Revamped enterprise SaaS UX with Figma + behavioural frameworks. Synthesised user feedback into iterative roadmap improvements, accelerating product-market fit. Collaborated across engineering and marketing to align delivery with user needs and GTM goals. My first real lesson: design that doesn't account for how people actually behave is just decoration.",
    line: "Design that ignores behaviour is decoration.",
  },
];

const personal = [
  {
    icon: Bot,
    title: "AI Academic & Career Planning Assistant",
    when: "May 2025 – present",
    body:
      "Conducted 12+ discovery interviews to map behavioural barriers and enablers in academic planning. Designed an MVP with goal-setting and personalisation loops to reduce drop-off risk.",
  },
  {
    icon: Wrench,
    title: "Product Operation Workflow Automation Tool",
    when: "Jun 2025 – present",
    body:
      "Built and iterated MVP using low-code tools and agile processes. Designed user journey visualisation to identify friction points across funnels.",
  },
  {
    icon: Sparkles,
    title: "Manus AI · Product Growth Fellow",
    when: "May 2025 – present",
    body:
      "Translated community feedback into actionable growth improvements for onboarding and retention. Led user outreach, Q&A, and demo delivery at external events and hackathons.",
  },
];

export default function Work() {
  return (
    <main
      style={
        {
          "--page-bg": theme.bg,
          "--page-fg": theme.fg,
          "--page-surface": theme.surface,
          "--page-surface-hi": theme.surfaceHi,
          "--page-muted": theme.muted,
          "--page-accent": theme.accent,
          "--page-accent-soft": theme.accentSoft,
          "--page-border": theme.border,
        } as CSSProperties
      }
      className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] font-sans antialiased"
    >
      <nav className="flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-10">
        <a href="/" className="flex items-center gap-2 text-sm tracking-wide">
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--page-accent)]" />
          <span className="font-medium">Nicole Jiang</span>
        </a>
        <div className="hidden gap-8 text-sm text-[var(--page-muted)] sm:flex">
          <a href="/work" className="text-[var(--page-fg)]">Work</a>
          <a href="/about" className="hover:text-[var(--page-fg)]">About</a>
          <a href="/contact" className="hover:text-[var(--page-fg)]">Contact</a>
        </div>
      </nav>

      <header className="mx-auto max-w-4xl px-6 pb-12 pt-16 sm:px-10 sm:pt-24">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--page-muted)] hover:text-[var(--page-fg)]"
        >
          <ArrowLeft className="size-3.5" /> Back
        </a>
        <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-[var(--page-accent)]">
          Work
        </p>
        <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          One system, five hackathons, three jobs. Same lens.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--page-muted)] sm:text-lg">
          I picked these because together they show the full arc: a system I'm
          building, a personal project I'm iterating on, sharp collaborations
          with people I trust, and the day-job work that funds it. Everything
          else is below.
        </p>
      </header>

      {/* 01 — THE SYSTEM (the moat amplifier) */}
      <section id="besci" className="border-y border-[var(--page-border)] bg-[var(--page-surface)]/40 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 sm:px-10">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--page-accent-soft)] text-[var(--page-accent)]">
              <Beaker className="size-5" />
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--page-muted)]">
              01 · The system I'm building
            </p>
          </div>

          <h2 className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {system.title}
          </h2>
          <p className="mt-3 text-base text-[var(--page-muted)] sm:text-lg">
            {system.subtitle}
          </p>

          <dl className="mt-8 grid gap-x-8 gap-y-3 border-y border-[var(--page-border)] py-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wider text-[var(--page-muted)]">Context</dt>
              <dd className="mt-1">{system.context}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-[var(--page-muted)]">My role</dt>
              <dd className="mt-1">{system.role}</dd>
            </div>
          </dl>

          <div className="mt-8">
            <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--page-muted)]">
              The problem
            </h3>
            <p className="mt-3 text-base leading-relaxed sm:text-lg">{system.problem}</p>
          </div>

          <div className="mt-8">
            <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--page-muted)]">
              How it's built
            </h3>
            <ul className="mt-3 space-y-2 text-base leading-relaxed sm:text-lg">
              {system.approach.map((a, j) => (
                <li key={j} className="flex gap-3">
                  <span className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-[var(--page-accent)]" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 rounded-2xl border border-[var(--page-accent)]/30 bg-[var(--page-accent-soft)] p-5 sm:p-6">
            <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--page-accent)]">
              Why it matters
            </h3>
            <p className="mt-3 text-base leading-relaxed sm:text-lg">{system.outcome}</p>
          </div>

          <p className="mt-6 text-sm font-medium text-[var(--page-muted)]">
            <span className="text-[var(--page-fg)]">In one line:</span> {system.line}
          </p>
        </div>
      </section>

      {/* 02 — HACKATHONS — impact first, decision visible */}
      <section className="mx-auto max-w-4xl space-y-24 px-6 py-20 sm:px-10 sm:space-y-32 sm:py-28">
        {hackathons.map((p, i) => {
          const Icon = p.icon;
          return (
            <article key={p.id} id={p.id} className="scroll-mt-24">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--page-accent-soft)] text-[var(--page-accent)]">
                  <Icon className="size-5" />
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--page-accent)]">
                  0{i + 2} · Hackathon · {p.badge}
                </p>
              </div>

              <h2 className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                {p.title}
              </h2>

              <dl className="mt-6 grid gap-x-8 gap-y-3 border-y border-[var(--page-border)] py-5 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-[var(--page-muted)]">Context</dt>
                  <dd className="mt-1">{p.context}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-[var(--page-muted)]">My role</dt>
                  <dd className="mt-1">{p.role}</dd>
                </div>
              </dl>

              <div className="mt-8">
                <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--page-muted)]">
                  The problem
                </h3>
                <p className="mt-3 text-base leading-relaxed sm:text-lg">{p.problem}</p>
              </div>

              <div className="mt-8">
                <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--page-muted)]">
                  What I did
                </h3>
                <ul className="mt-3 space-y-2 text-base leading-relaxed sm:text-lg">
                  {p.approach.map((a, j) => (
                    <li key={j} className="flex gap-3">
                      <span className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-[var(--page-accent)]" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 rounded-2xl border border-[var(--page-accent)]/30 bg-[var(--page-accent-soft)] p-5 sm:p-6">
                <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--page-accent)]">
                  Outcome
                </h3>
                <p className="mt-3 text-base leading-relaxed sm:text-lg">{p.outcome}</p>
              </div>

              <p className="mt-6 text-sm font-medium text-[var(--page-muted)]">
                <span className="text-[var(--page-fg)]">In one line:</span> {p.line}
              </p>
            </article>
          );
        })}
      </section>

      {/* DAY JOB — measured outcomes from the CV */}
      <section className="border-t border-[var(--page-border)] bg-[var(--page-surface)]/40 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 sm:px-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--page-muted)]">
            The day job
          </p>
          <h2 className="mt-3 text-balance text-2xl font-semibold sm:text-3xl">
            Before algo1: where the measurement habit got built.
          </h2>
          <div className="mt-10 space-y-4">
            {dayJob.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.id}
                  id={d.id}
                  className="scroll-mt-24 rounded-2xl border border-[var(--page-border)] bg-[var(--page-surface)] p-6 sm:p-7"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--page-accent-soft)] text-[var(--page-accent)]">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold sm:text-xl">{d.title}</h3>
                        <p className="mt-0.5 text-sm text-[var(--page-muted)]">{d.where}</p>
                      </div>
                    </div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--page-accent)]">
                      {d.badge}
                    </p>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--page-fg)]/85 sm:text-base">
                    {d.story}
                  </p>
                  <p className="mt-4 text-sm font-medium text-[var(--page-muted)]">
                    <span className="text-[var(--page-fg)]">In one line:</span> {d.line}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ONGOING PERSONAL BUILDS */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 sm:px-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--page-muted)]">
            Currently iterating on
          </p>
          <h2 className="mt-3 text-balance text-2xl font-semibold sm:text-3xl">
            Three personal projects I keep coming back to.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {personal.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.title}
                  className="rounded-2xl border border-[var(--page-border)] bg-[var(--page-surface)] p-5"
                >
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--page-accent-soft)] text-[var(--page-accent)]">
                    <Icon className="size-4" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{m.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-wider text-[var(--page-muted)]">
                    {m.when}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--page-muted)]">
                    {m.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--page-border)] py-20">
        <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
          <h2 className="text-balance text-2xl font-semibold sm:text-3xl">
            See the thinking, not just the work.
          </h2>
          <p className="mt-3 text-[var(--page-muted)]">
            Read about the methodology, the moat, and the obsessions.
          </p>
          <a
            href="/about"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--page-border)] px-5 py-3 text-sm font-medium hover:bg-[var(--page-surface)]"
          >
            About me <ArrowRight className="size-4" />
          </a>
        </div>
      </section>

      <footer className="border-t border-[var(--page-border)] py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 px-6 text-sm text-[var(--page-muted)] sm:flex-row sm:items-center sm:px-10">
          <div>© Nicole Jiang · London</div>
          <div className="flex gap-6">
            <a href="mailto:nicolejiang2324@gmail.com" className="hover:text-[var(--page-fg)]">Email</a>
            <a
              href="https://www.linkedin.com/in/nicole-jiang-567054201/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--page-fg)]"
            >
              LinkedIn
            </a>
            <a href="/contact" className="hover:text-[var(--page-fg)]">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
