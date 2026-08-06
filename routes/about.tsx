import { ArrowLeft, ArrowRight, Sparkles, Cpu, Waves, Telescope, Brain, MessageCircle, Bot, Microscope } from "lucide-react";

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

const timeline = [
  {
    period: "2025 — present",
    role: "Behavioural Scientist",
    org: "algo1.ai · London",
    body:
      "Building the BeSci Engine — a 6-layer system for designing, testing, and accumulating behavioural interventions in a real-time in-store AI product. Tablets on shopping trolleys, scan-and-go, location-triggered personalised nudges. Solo practitioner.",
  },
  {
    period: "2024 — 2025",
    role: "Product & Behavioural Science Associate (Intern)",
    org: "Applied Behaviour Change Consultancy · London",
    body:
      "AI-driven public health communication and digital healthcare tools. Embedded COM-B, ran A/B tests, prototyped onboarding flows, built Notion playbooks. +20% engagement, +30% reported wellbeing.",
  },
  {
    period: "2023 — 2024",
    role: "MSc Behaviour Change (Distinction)",
    org: "University College London (UCL)",
    body:
      "Behavioural intervention design, theories of behaviour change, digital workplace, health & wellbeing, behavioural economics. Dissertation on codes of conduct (with Mindful Business Charter).",
  },
  {
    period: "2022 — 2023",
    role: "Behavioural Intervention Specialist",
    org: "Wuhan Yudian Psychological Counselling Co. · Wuhan",
    body:
      "Evidence-based interventions for workplace stress, team productivity, post-launch feedback loops. −50% reported workplace stress, +15% team productivity.",
  },
  {
    period: "2020 — 2021",
    role: "Product Associate (UX Focused)",
    org: "DTise AI-Tech · Shanghai",
    body:
      "Enterprise SaaS UX with Figma and behavioural frameworks. +40% engagement, accelerated product-market fit.",
  },
  {
    period: "2016 — 2020",
    role: "BA Psychology, Minor in Japanese",
    org: "University of British Columbia · Vancouver",
    body:
      "Dean's List, International Student Scholarship. Where the curiosity started.",
  },
];

const moats = [
  {
    title: "Behavioural product judgement",
    body:
      "The rare ability to translate between behavioural science, design, engineering, and business — so the BeSci person, the designer, the engineer, and the founder all understand each other through me.",
  },
  {
    title: "Methodology you can name",
    body:
      "The BeSci Engine is a 6-layer operating system — diagnosis, design, test, library, governance, AI loop. Every layer compounds. The IPC library is the moat.",
  },
  {
    title: "Builder, not observer",
    body:
      "I've shipped AI products end-to-end — solo, in hackathon teams, in 48 hours, in 5 hours. I don't just design the experiment, I run it.",
  },
  {
    title: "Taste as refusal",
    body:
      "I write like I build: with a point of view. I refuse to ship a feature without testing whether it worked. I refuse to ship a portfolio that reads like a CV.",
  },
];

const poking = [
  { icon: Microscope, label: "Neurotech" },
  { icon: Cpu, label: "Physical AI" },
  { icon: Bot, label: "Robotics" },
  { icon: Waves, label: "Oceans" },
  { icon: Telescope, label: "Space" },
  { icon: Brain, label: "Memory & agency" },
];

export default function About() {
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
        } as React.CSSProperties
      }
      className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] font-sans antialiased"
    >
      <nav className="flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-10">
        <a href="/" className="flex items-center gap-2 text-sm tracking-wide">
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--page-accent)]" />
          <span className="font-medium">Nicole Jiang</span>
        </a>
        <div className="hidden gap-8 text-sm text-[var(--page-muted)] sm:flex">
          <a href="/work" className="hover:text-[var(--page-fg)]">Work</a>
          <a href="/about" className="text-[var(--page-fg)]">About</a>
          <a href="/contact" className="hover:text-[var(--page-fg)]">Contact</a>
        </div>
      </nav>

      <header className="mx-auto max-w-4xl px-6 pb-12 pt-20 sm:px-10 sm:pt-28">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--page-muted)] hover:text-[var(--page-fg)]"
        >
          <ArrowLeft className="size-3.5" /> Back
        </a>
        <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-[var(--page-accent)]">
          About
        </p>
        <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Behavioural scientist. AI product builder. Currently obsessed with how
          AI should sound, feel, and remember.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--page-muted)] sm:text-lg">
          I'm Nicole — a behavioural scientist working at the intersection of
          behaviour change and AI products. I run experiments, then write up
          what actually happened. I split my time between algo1.ai (where I'm
          building the BeSci Engine), weekend hackathons, and a long list of
          personal obsessions.
        </p>
      </header>

      {/* STORY */}
      <section className="mx-auto max-w-3xl px-6 pb-20 sm:px-10">
        <h2 className="text-balance text-2xl font-semibold sm:text-3xl">
          The path here, briefly.
        </h2>
        <div className="mt-10 space-y-10 border-l border-[var(--page-border)] pl-6 sm:pl-8">
          {timeline.map((t) => (
            <div key={t.period} className="relative">
              <span className="absolute -left-[27px] sm:-left-[35px] top-1.5 size-3 rounded-full border-2 border-[var(--page-accent)] bg-[var(--page-bg)]" />
              <p className="text-xs uppercase tracking-wider text-[var(--page-muted)]">
                {t.period}
              </p>
              <h3 className="mt-1 text-lg font-semibold">{t.role}</h3>
              <p className="text-sm text-[var(--page-muted)]">{t.org}</p>
              <p className="mt-3 text-base leading-relaxed text-[var(--page-fg)]/90">
                {t.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* THE MOAT */}
      <section className="border-y border-[var(--page-border)] bg-[var(--page-surface)]/40 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 sm:px-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--page-muted)]">
            The moat
          </p>
          <h2 className="mt-3 max-w-3xl text-balance text-2xl font-semibold sm:text-3xl">
            Four things I can do that most people can't — at the same time.
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[var(--page-border)] bg-[var(--page-border)] sm:grid-cols-2">
            {moats.map((m) => (
              <div key={m.title} className="bg-[var(--page-surface)] p-6 sm:p-8">
                <h3 className="text-lg font-semibold">{m.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--page-muted)]">
                  {m.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POKING AT */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 sm:px-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--page-muted)]">
            Currently poking at
          </p>
          <h2 className="mt-3 max-w-3xl text-balance text-2xl font-semibold sm:text-3xl">
            Things I'm not building yet, but can't stop thinking about.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-[var(--page-muted)]">
            The curiosity is the point. I learn whatever I'm drawn to — these
            are the threads I'm pulling right now.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {poking.map((p) => {
              const Icon = p.icon;
              return (
                <span
                  key={p.label}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--page-border)] bg-[var(--page-surface)] px-4 py-2 text-sm"
                >
                  <Icon className="size-4 text-[var(--page-accent)]" />
                  {p.label}
                </span>
              );
            })}
          </div>
          <p className="mt-8 text-sm text-[var(--page-muted)]">
            Languages: English (native), Mandarin (native), Japanese (fluent),
            Korean & French (beginner). I read across both my worlds.
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--page-border)] py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
          <Sparkles className="mx-auto size-8 text-[var(--page-accent)]" />
          <h2 className="mt-4 text-balance text-2xl font-semibold sm:text-3xl">
            If any of this is what you're trying to build — let's talk.
          </h2>
          <p className="mt-3 text-[var(--page-muted)]">
            Behaviour-led AI products, founder collaborations, or just a sharp
            conversation about how people change.
          </p>
          <a
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--page-accent)] px-6 py-3 text-sm font-medium text-[#0a0e1a] transition hover:brightness-110"
          >
            <MessageCircle className="size-4" />
            Start a conversation
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
