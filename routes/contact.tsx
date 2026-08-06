import { ArrowLeft, Mail, Linkedin, MessageSquare, Sparkles } from "lucide-react";

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

const asks = [
  {
    title: "You're building a behaviour-led AI product",
    body:
      "You're shipping an AI product that makes decisions about people — what they see, when, why. You want someone who can design the intervention, run the test, and govern the ethics. That's my day job at algo1.ai, and it's what I'd love to do at scale.",
  },
  {
    title: "You're a founder or researcher in physical AI, neurotech, or robotics",
    body:
      "You're building the next generation of embodied intelligence and you need a behavioural lens — how does the system earn trust, shape habit, communicate intent. I want in on this conversation.",
  },
  {
    title: "You want to jam on a BeSci × AI problem",
    body:
      "You've got a problem statement and a hunch that behavioural science + AI is the answer. You want a sharp collaborator for a sprint, a workshop, or a research dive. Let's go.",
  },
];

const notYet = [
  "Recruiting for a large platform PM role (I can refer you to better people)",
  "Quick logo design or one-off content pieces",
  "Anything involving manipulating user behaviour for short-term revenue gains (see: my work on dark patterns and the EU AI Act)",
];

export default function Contact() {
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
          <a href="/about" className="hover:text-[var(--page-fg)]">About</a>
          <a href="/contact" className="text-[var(--page-fg)]">Contact</a>
        </div>
      </nav>

      <header className="mx-auto max-w-3xl px-6 pb-12 pt-20 sm:px-10 sm:pt-28">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--page-muted)] hover:text-[var(--page-fg)]"
        >
          <ArrowLeft className="size-3.5" /> Back
        </a>
        <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-[var(--page-accent)]">
          Contact
        </p>
        <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          I want to talk to you if…
        </h1>
        <p className="mt-6 text-base leading-relaxed text-[var(--page-muted)] sm:text-lg">
          I take on a small number of collaborations. Here's what I'm looking
          for, and what I'm not.
        </p>
      </header>

      <section className="mx-auto max-w-3xl px-6 pb-16 sm:px-10">
        <div className="space-y-4">
          {asks.map((a, i) => (
            <div
              key={a.title}
              className="rounded-2xl border border-[var(--page-border)] bg-[var(--page-surface)] p-6 sm:p-8"
            >
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--page-accent)]">
                0{i + 1}
              </p>
              <h2 className="mt-3 text-balance text-xl font-semibold sm:text-2xl">
                {a.title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[var(--page-muted)]">
                {a.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16 sm:px-10">
        <div className="rounded-2xl border border-[var(--page-border)] bg-[var(--page-surface)]/60 p-6 sm:p-8">
          <h2 className="text-lg font-semibold">
            Not yet, but maybe later
          </h2>
          <ul className="mt-5 space-y-3 text-sm text-[var(--page-muted)]">
            {notYet.map((n) => (
              <li key={n} className="flex gap-3">
                <span className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-[var(--page-muted)]" />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20 sm:px-10">
        <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--page-muted)]">
          Reach me directly
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <a
            href="mailto:nicolejiang2324@gmail.com"
            className="group flex items-start gap-4 rounded-2xl border border-[var(--page-border)] bg-[var(--page-surface)] p-5 transition hover:border-[var(--page-accent)]/40"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--page-accent-soft)] text-[var(--page-accent)]">
              <Mail className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="mt-1 text-sm text-[var(--page-muted)]">
                nicolejiang2324@gmail.com
              </p>
              <p className="mt-2 text-xs text-[var(--page-muted)]">
                Best for: project enquiries, collaborations
              </p>
            </div>
          </a>
          <a
            href="https://www.linkedin.com/in/nicole-jiang-567054201/"
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-4 rounded-2xl border border-[var(--page-border)] bg-[var(--page-surface)] p-5 transition hover:border-[var(--page-accent)]/40"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--page-accent-soft)] text-[var(--page-accent)]">
              <Linkedin className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium">LinkedIn</p>
              <p className="mt-1 text-sm text-[var(--page-muted)]">
                /in/nicole-jiang-567054201
              </p>
              <p className="mt-2 text-xs text-[var(--page-muted)]">
                Best for: async chats, warm intros
              </p>
            </div>
          </a>
        </div>
      </section>

      <section className="border-t border-[var(--page-border)] bg-[var(--page-surface)]/40 py-16">
        <div className="mx-auto max-w-2xl px-6 text-center sm:px-10">
          <MessageSquare className="mx-auto size-7 text-[var(--page-accent)]" />
          <h2 className="mt-4 text-balance text-xl font-semibold">
            One thing that helps me reply faster
          </h2>
          <p className="mt-3 text-sm text-[var(--page-muted)]">
            Open with the specific person, the specific moment, and the specific
            friction you saw. I'll know in one paragraph whether I can help.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--page-muted)]">
            <Sparkles className="size-3" /> BeSci is the lens, even in email
          </p>
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
