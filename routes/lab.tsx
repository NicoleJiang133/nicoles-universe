import { useState, useEffect, useRef, useCallback } from "react";
import {
  Play, ArrowRight, ArrowLeft, Volume2, VolumeX, Trophy, Check,
  Sparkles, Compass, Gamepad2, Zap, Mail, Power,
  Brain, Radar, Target, Palette, Rocket, Lock, Linkedin,
  BookOpen, Camera, Cat, MapPin, X,
} from "lucide-react";

const T = {
  paper: "#FAF7F0",
  cream: "#F2EBD9",
  ink: "#1A1A1A",
  muted: "#7A7468",
  coral: "#FF5C4D",
  sky: "#4DA3FF",
  lime: "#B8E847",
  yellow: "#F1C40F",
  red: "#C0392B",
  navy: "#2C3E73",
};

type View = "boot" | "hub" | "m1" | "m2" | "m3" | "complete";
const VALID: View[] = ["boot", "hub", "m1", "m2", "m3", "complete"];

const MISSIONS = [
  { id: "m1", n: "01", tag: "BACKGROUND", accent: T.coral, icon: Sparkles,
    title: "My background",
    sub: "Work and education. How I got here.",
    objective: "The path so far, and the way I think.", cards: false },
  { id: "m2", n: "02", tag: "THE BUILDS", accent: T.lime, icon: Trophy,
    title: "Side projects & hackathon builds",
    sub: "What I've shipped: prizes, users, real numbers.",
    objective: "Proof I can turn an idea into a working thing.", cards: true },
  { id: "m3", n: "03", tag: "OFF THE CLOCK", accent: T.yellow, icon: Compass,
    title: "Me outside of work",
    sub: "Languages, obsessions, and where I'm heading.",
    objective: "The curiosity that fuels everything.", cards: false },
] as const;

const ATTRS = [
  { name: "Diagnose why", accent: T.coral, icon: Brain,
    desc: "Read the real reason people act as they do." },
  { name: "Spot the pattern", accent: T.sky, icon: Radar,
    desc: "Find the signal in messy behaviour and data." },
  { name: "Decide what to build", accent: T.lime, icon: Target,
    desc: "Turn insight into the right thing to make." },
  { name: "Shape how it feels", accent: T.yellow, icon: Palette,
    desc: "Make it feel good to actually use." },
] as const;

const BUILDS = [
  { name: "Tella", group: "software", what: "An AI voice companion that calls older adults with warm daily check-ins, even on a landline, then flags anything off to their carer.", tag: "Launched · in beta",
    detail: "", link: "" },
  { name: "Basket", group: "software", what: "Five AI agents that watch the web for complaints when a product quietly changes its recipe, so brands hear the backlash in weeks, not months.", tag: "Won · Tokens LDN track",
    detail: "", link: "https://www.omorros.com/projects/basket" },
  { name: "Drift", group: "software", what: "AI that reads how you actually work, then points to what is worth automating. Built in 24 hours.", tag: "Shortlisted",
    detail: "", link: "" },
  { name: "Substrate", group: "software", what: "A shared memory layer so AI agents stop losing context and repeating each other's work.", tag: "Top 6 · 60+ teams",
    detail: "", link: "" },
  { name: "donna.ai", group: "physical", what: "A real-time voice and vision agent that calls delivery customers before a delay turns into a lost one. Built in five hours.", tag: "Won · Best use of ElevenLabs",
    detail: "", link: "" },
  { name: "EvaOS", group: "physical", what: "Physical AI you clip to a cap: notes, teleprompter, and navigation, all hands-free. An open platform for wearable AI.", tag: "Hardware build",
    detail: "", link: "" },
  { name: "Mindful Pi", group: "physical", what: "A fully offline meditation device on a Raspberry Pi. No screen, no internet. It hears your mood and builds a session on-device.", tag: "Won · Overmind track",
    detail: "", link: "" },
] as const;

const ROLES = [
  { org: "algo1", role: "Behavioural Scientist", when: "Sep 2025 to now", note: "Behaviour-led AI for grocery retail. Work out why shoppers act as they do, then build and test what shifts it." },
  { org: "Applied Behaviour Change", role: "Product & Behavioural Science Associate", when: "2024 to 2025", note: "Behavioural diagnosis, intervention design, and research for health and wellbeing products. Lifted engagement 20% and wellbeing 30%." },
  { org: "UCL Centre for Behaviour Change", role: "Research Assistant", when: "2024", note: "Behaviour change intervention ontologies, with the team that writes the field's standards." },
  { org: "Earlier, in China", role: "Product, UX & behavioural roles", when: "2020 to 2023", note: "Psychology practice, UX design, and go-to-market before moving into behavioural science full time." },
] as const;

const EDU = [
  { school: "UCL", degree: "MSc, Behaviour Change", note: "Distinction" },
  { school: "University of British Columbia", degree: "BA, Psychology", note: "Minor in Japanese. Dean's List." },
] as const;

const LANGS = ["中文 · native", "English · fluent", "日本語 · conversational"] as const;

const READING = {
  title: "[ your current read ]",
  author: "[ author ]",
  note: "[ one line on why it has you ]",
} as const;

const CAT_SHOTS = [
  { caption: "[ name and a moment ]", tilt: -4 },
  { caption: "[ the usual pose ]", tilt: 3 },
] as const;

const TRAVEL_SHOTS = [
  { caption: "[ place ]", tilt: 3 },
  { caption: "[ place ]", tilt: -3 },
  { caption: "[ place ]", tilt: 2 },
  { caption: "[ place ]", tilt: -2 },
] as const;

const PILL =
  "inline-flex items-center gap-2 rounded-full border-2 border-[#1A1A1A] bg-[#FAF7F0] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition shadow-[3px_3px_0_#1A1A1A] hover:shadow-[6px_6px_0_#1A1A1A] hover:-translate-y-0.5";

function GameStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
      @keyframes labIn { from { opacity:0; transform: translateY(10px);} to { opacity:1; transform:none; } }
      @keyframes labBlink { 0%,100%{opacity:1;} 50%{opacity:.25;} }
      @keyframes labRainbow { 0%{background-position:0% 50%;} 100%{background-position:200% 50%;} }
      @keyframes labFloat { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-6px);} }
      .lab-view { animation: labIn .45s cubic-bezier(.2,.7,.2,1) both; }
      .lab-rainbow { background: linear-gradient(90deg,${T.coral},${T.yellow},${T.lime},${T.sky},${T.navy},${T.coral}); background-size:200% auto; -webkit-background-clip:text; background-clip:text; color:transparent; animation: labRainbow 6s linear infinite; }
      .lab-blink { animation: labBlink 1.1s steps(1) infinite; }
      .lab-float { animation: labFloat 3s ease-in-out infinite; }
      @media (pointer:fine){ .lab-nocursor, .lab-nocursor * { cursor:none !important; } }
      @media (prefers-reduced-motion: reduce){ .lab-view,.lab-rainbow,.lab-blink,.lab-float{animation:none !important;} }
    `,
      }}
    />
  );
}

function CustomCursor() {
  const [fine, setFine] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    setFine(true);
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setActive(!!(el.closest && el.closest("a,button,[data-hover]")));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);
  if (!fine) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[100]"
      style={{
        left: pos.x,
        top: pos.y,
        transform: `translate(-50%,-50%) scale(${active ? 1.7 : 1})`,
        transition: "transform .15s ease",
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 999,
          border: `2px solid ${T.coral}`,
          background: active ? T.coral : "transparent",
          opacity: active ? 0.5 : 1,
        }}
      />
    </div>
  );
}

function useSfx(on: boolean) {
  const ctx = useRef<AudioContext | null>(null);
  return useCallback(
    (freq = 440, dur = 0.08, type: OscillatorType = "square") => {
      if (!on) return;
      try {
        if (!ctx.current)
          ctx.current = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
        const ac = ctx.current;
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = type;
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.05, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
        o.connect(g);
        g.connect(ac.destination);
        o.start();
        o.stop(ac.currentTime + dur);
      } catch {}
    },
    [on],
  );
}

function ProgressHUD({ done }: { done: string[] }) {
  const n = MISSIONS.filter((m) => done.includes(m.id)).length;
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <span className="hidden font-mono text-[10px] font-bold uppercase tracking-widest text-[#7A7468] sm:inline">
        Explored
      </span>
      <div className="flex gap-1">
        {MISSIONS.map((m) => (
          <div
            key={m.id}
            className="h-2 w-5 rounded-full border border-[#1A1A1A] sm:w-6"
            style={{ background: done.includes(m.id) ? m.accent : "transparent" }}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] font-bold text-[#1A1A1A]">
        {n}/{MISSIONS.length}
      </span>
    </div>
  );
}

function Placeholder({
  label,
  lines = 3,
  accent = T.muted,
}: {
  label: string;
  lines?: number;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border-2 border-dashed border-[#1A1A1A]/30 bg-[#F2EBD9]/40 p-5">
      <p
        className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest"
        style={{ color: accent }}
      >
        {label}
      </p>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 rounded bg-[#1A1A1A]/10"
            style={{ width: `${92 - i * 11}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function Polaroid({
  caption,
  tilt,
  accent,
  label,
  icon: Icon,
}: {
  caption: string;
  tilt: number;
  accent: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <figure
      className="relative w-[150px] rounded-sm border-2 border-[#1A1A1A] bg-white p-2.5 pb-3 shadow-[4px_5px_0_#1A1A1A] transition hover:-translate-y-1 hover:rotate-0 sm:w-[168px]"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <span
        aria-hidden
        className="absolute -top-2.5 left-1/2 size-4 -translate-x-1/2 rounded-full border-2 border-[#1A1A1A] shadow-[1px_1px_0_#1A1A1A]"
        style={{ background: accent }}
      />
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-sm border-2 border-dashed border-[#1A1A1A]/25 bg-[#F2EBD9]">
        <div className="flex flex-col items-center gap-1 text-[#7A7468]">
          <Icon className="size-6" />
          <span
            className="font-mono text-[8px] font-bold uppercase tracking-widest"
            style={{ color: accent }}
          >
            {label}
          </span>
        </div>
      </div>
      <figcaption className="mt-2.5 text-center font-serif text-[13px] italic text-[#2A2F3E]">
        {caption}
      </figcaption>
    </figure>
  );
}

export default function Lab() {
  const [view, setView] = useState<View>("boot");
  const [done, setDone] = useState<string[]>([]);
  const [sfxOn, setSfxOn] = useState(false);
  const [openBuild, setOpenBuild] = useState<number | null>(null);
  const blip = useSfx(sfxOn);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("lab_progress");
      const saved = raw ? JSON.parse(raw) : {};
      if (Array.isArray(saved.done)) setDone(saved.done);
      const hash = window.location.hash.replace("#", "") as View;
      if (VALID.includes(hash)) setView(hash);
      else if (saved.booted) setView("hub");
    } catch {}
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    if (window.location.hash.replace("#", "") !== view)
      history.replaceState(null, "", `#${view}`);
    try {
      const raw = localStorage.getItem("lab_progress");
      const prev = raw ? JSON.parse(raw) : {};
      localStorage.setItem(
        "lab_progress",
        JSON.stringify({ ...prev, done, booted: prev.booted || view !== "boot" }),
      );
    } catch {}
  }, [view, done]);

  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace("#", "") as View;
      if (VALID.includes(h)) setView(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (view.length === 2 && view[0] === "m")
      setDone((d) => (d.includes(view) ? d : [...d, view]));
  }, [view]);

  useEffect(() => {
    if (openBuild === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenBuild(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openBuild]);

  const go = (v: View, sound = 520) => {
    blip(sound);
    setOpenBuild(null);
    setView(v);
    window.scrollTo(0, 0);
  };

  const mIndex = MISSIONS.findIndex((x) => x.id === view);
  const mission = mIndex >= 0 ? MISSIONS[mIndex] : null;
  const nextRoute = ((MISSIONS.find((m) => !done.includes(m.id)) ||
    MISSIONS[0]).id) as View;
  const prev = () =>
    mIndex > 0 ? go(MISSIONS[mIndex - 1].id as View, 420) : go("hub", 420);
  const next = () =>
    mIndex < MISSIONS.length - 1
      ? go(MISSIONS[mIndex + 1].id as View, 620)
      : go("complete", 740);

  return (
    <main
      style={
        {
          "--page-bg": T.paper,
          "--page-fg": T.ink,
        } as React.CSSProperties
      }
      className="lab-nocursor relative min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)]"
    >
      <GameStyles />
      <CustomCursor />

      {/* paper grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.4) 1px, transparent 1px)",
          backgroundSize: "4px 4px",
        }}
      />

      {/* top chrome */}
      {view !== "boot" && (
        <header className="sticky top-0 z-40 border-b-2 border-[#1A1A1A] bg-[#FAF7F0]/90 px-4 py-3 backdrop-blur sm:px-8">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
            <button
              onClick={() => go("hub", 420)}
              data-hover
              className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest"
            >
              <Gamepad2 className="size-4" style={{ color: T.coral }} />
              nicole jiang
            </button>
            <div className="flex items-center gap-3 sm:gap-4">
              {view !== "complete" && <ProgressHUD done={done} />}
              <button
                onClick={() => go("boot", 320)}
                data-hover
                aria-label="Back to title screen"
                title="Back to title screen"
                className="flex size-8 items-center justify-center rounded-full border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] transition hover:-translate-y-0.5 hover:bg-[#FF5C4D]"
              >
                <Power className="size-4" />
              </button>
              <button
                onClick={() => {
                  setSfxOn((s) => !s);
                }}
                data-hover
                aria-label="Toggle sound effects"
                className="flex size-8 items-center justify-center rounded-full border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] transition hover:-translate-y-0.5"
                style={{ background: sfxOn ? T.lime : "transparent" }}
              >
                {sfxOn ? (
                  <Volume2 className="size-4" />
                ) : (
                  <VolumeX className="size-4" />
                )}
              </button>
            </div>
          </div>
        </header>
      )}

      <div key={view} className="lab-view relative z-10">
        {/* BOOT */}
        {view === "boot" && (
          <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
            <div className="lab-float mb-7 flex size-28 items-center justify-center overflow-hidden rounded-full border-2 border-[#1A1A1A] bg-[#F2EBD9] shadow-[4px_4px_0_#1A1A1A] sm:size-32">
              <img
                src="/images/nicole-photo.png"
                alt="Nicole Jiang"
                className="size-full object-cover"
              />
            </div>
            <h1
              className="font-serif text-6xl font-bold text-[#1A1A1A] sm:text-8xl"
              style={{ letterSpacing: "-0.03em" }}
            >
              Nicole Jiang
            </h1>
            <p className="mt-6 max-w-md font-serif text-lg text-[#2A2F3E]">
              Behavioural scientist who designs AI products that change
              behaviour, then tests whether they actually did.
            </p>
            <button
              onClick={() => go("hub", 660)}
              data-hover
              className="mt-10 inline-flex items-center gap-3 rounded-full border-2 border-[#1A1A1A] bg-[#1A1A1A] px-8 py-4 font-mono text-sm font-bold uppercase tracking-widest text-[#FAF7F0] shadow-[4px_4px_0_#FF5C4D] transition hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#FF5C4D]"
            >
              <Play className="size-5" /> Press start
            </button>
            <p className="lab-blink mt-6 font-mono text-[10px] uppercase tracking-widest text-[#7A7468]">
              ▶ insert curiosity to continue
            </p>
          </section>
        )}

        {/* HUB */}
        {view === "hub" && (
          <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="rounded-2xl border-2 border-[#1A1A1A] bg-[#F2EBD9] p-6 shadow-[4px_4px_0_#1A1A1A] sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="size-24 shrink-0 overflow-hidden rounded-2xl border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A]">
                  <img
                    src="/images/nicole-photo.png"
                    alt="Nicole Jiang"
                    className="size-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h1
                    className="font-serif text-3xl font-semibold sm:text-4xl"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    Nicole Jiang
                  </h1>
                  <p className="mt-1 font-serif text-base italic text-[#2A2F3E]">
                    Behavioural Science × AI Product Design · London
                  </p>
                  <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-widest text-[#7A7468]">
                    abilities · four in one person
                  </p>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {ATTRS.map((a) => {
                      const Icon = a.icon;
                      return (
                        <div
                          key={a.name}
                          className="flex items-start gap-3 rounded-xl border-2 border-[#1A1A1A] bg-[#FAF7F0] p-3 shadow-[2px_2px_0_#1A1A1A]"
                        >
                          <div
                            className="flex size-9 shrink-0 items-center justify-center rounded-lg border-2 border-[#1A1A1A]"
                            style={{ background: a.accent }}
                          >
                            <Icon className="size-4 text-[#1A1A1A]" />
                          </div>
                          <div>
                            <p className="font-mono text-[11px] font-bold uppercase tracking-wide">
                              {a.name}
                            </p>
                            <p className="mt-0.5 font-serif text-[13px] leading-snug text-[#2A2F3E]">
                              {a.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-3 font-serif text-[13px] italic text-[#2A2F3E]">
                    Most people have one or two of these. The rare part is all
                    four in one person.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex items-end justify-between">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#2C3E73]">
                  choose your route
                </p>
                <h2 className="mt-1 font-serif text-2xl font-semibold">
                  Understanding Nicole
                </h2>
                <p className="mt-1 max-w-xl font-serif text-sm text-[#2A2F3E]">
                  Three separate routes into who I am. Follow them in any order.
                  Explore all three for the full picture. About a minute each.
                </p>
              </div>
              <button
                onClick={() => go("m2", 640)}
                data-hover
                className="hidden font-mono text-[11px] font-bold uppercase tracking-wide text-[#C0392B] underline decoration-wavy underline-offset-4 sm:inline"
              >
                jump to the builds →
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {MISSIONS.map((m) => {
                const Icon = m.icon;
                const isDone = done.includes(m.id);
                const isNextUp =
                  !isDone &&
                  MISSIONS.find((x) => !done.includes(x.id))?.id === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => go(m.id as View, 560)}
                    data-hover
                    className="group flex w-full items-center gap-4 rounded-xl border-2 border-[#1A1A1A] bg-[#FAF7F0] p-4 text-left shadow-[3px_3px_0_#1A1A1A] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#1A1A1A]"
                  >
                    <div
                      className="flex size-11 shrink-0 items-center justify-center rounded-lg border-2 border-[#1A1A1A]"
                      style={{ background: m.accent }}
                    >
                      <Icon className="size-5 text-[#1A1A1A]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#7A7468]">
                        Route {m.n} · {m.tag}
                      </p>
                      <p
                        className="font-serif text-lg font-semibold"
                        style={{ letterSpacing: "-0.01em" }}
                      >
                        {m.title}
                      </p>
                    </div>
                    {isDone ? (
                      <span className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase text-[#1A1A1A]">
                        <Check className="size-4" style={{ color: T.lime }} />{" "}
                        done
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {isNextUp && (
                          <span
                            className="lab-blink rounded-full border-2 border-[#1A1A1A] px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wide"
                            style={{ background: T.coral }}
                          >
                            start here
                          </span>
                        )}
                        <span className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wide text-[#7A7468] transition group-hover:text-[#1A1A1A]">
                          enter
                          <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                        </span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col items-center gap-3">
              <button
                onClick={() => go(nextRoute, 660)}
                data-hover
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#1A1A1A] bg-[#1A1A1A] px-7 py-3.5 font-mono text-sm font-bold uppercase tracking-widest text-[#FAF7F0] shadow-[4px_4px_0_#FF5C4D] transition hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#FF5C4D]"
              >
                <Play className="size-4" />{" "}
                {done.length ? "Keep exploring" : "Start exploring"}
              </button>
              <button
                onClick={() => go("m2", 600)}
                data-hover
                className="font-mono text-[11px] font-bold uppercase tracking-wide text-[#C0392B] underline decoration-wavy underline-offset-4 sm:hidden"
              >
                jump to the builds →
              </button>
            </div>
          </section>
        )}

        {/* MISSION */}
        {mission && (
          <section className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
            <p
              className="font-mono text-xs font-bold uppercase tracking-widest"
              style={{ color: mission.accent }}
            >
              // {mission.n} · {mission.tag}
            </p>
            <div className="mt-3 flex items-start gap-4">
              <div
                className="flex size-12 shrink-0 items-center justify-center rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A]"
                style={{ background: mission.accent }}
              >
                <mission.icon className="size-6 text-[#1A1A1A]" />
              </div>
              <div>
                <h1
                  className="font-serif text-4xl font-semibold leading-tight sm:text-5xl"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {mission.title}
                </h1>
                <p className="mt-1 font-serif text-lg italic text-[#2A2F3E]">
                  {mission.sub}
                </p>
              </div>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-[#1A1A1A] bg-[#FAF7F0] px-4 py-2 shadow-[3px_3px_0_#1A1A1A]">
              <Zap className="size-3.5" style={{ color: mission.accent }} />
              <span className="font-mono text-[11px] font-bold uppercase tracking-wide">
                Objective: {mission.objective}
              </span>
            </div>

            <div className="mt-10 space-y-5">
              {mission.id === "m1" && (
                <>
                  <div className="space-y-4 font-serif text-[15px] leading-relaxed text-[#2A2F3E]">
                    <p>
                      I'm a behavioural scientist at{" "}
                      <strong className="text-[#1A1A1A]">algo1</strong>, an AI
                      startup in London building hyperpersonalised shopping for
                      grocery retail. My job: work out why people do what they
                      do, design the product that shifts it, then prove whether
                      it worked.
                    </p>
                    <p>
                      I came in through psychology, not code. Two degrees in how
                      people think, then years spent using it to build real
                      things. The pattern never changed: the interesting problem
                      is always human before it is technical.
                    </p>
                  </div>

                  <div>
                    <p
                      className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: mission.accent }}
                    >
                      Work
                    </p>
                    <div className="space-y-3">
                      {ROLES.map((r) => (
                        <div
                          key={r.org}
                          className="rounded-xl border-2 border-[#1A1A1A] bg-[#FAF7F0] p-4 shadow-[3px_3px_0_#1A1A1A]"
                        >
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                            <p className="font-serif text-lg font-semibold text-[#1A1A1A]">
                              {r.role}
                            </p>
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wide text-[#7A7468]">
                              {r.when}
                            </span>
                          </div>
                          <p
                            className="font-mono text-[11px] font-bold uppercase tracking-wide"
                            style={{ color: mission.accent }}
                          >
                            {r.org}
                          </p>
                          <p className="mt-2 font-serif text-[14px] leading-snug text-[#2A2F3E]">
                            {r.note}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p
                      className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: mission.accent }}
                    >
                      Education
                    </p>
                    <div className="space-y-3">
                      {EDU.map((e) => (
                        <div
                          key={e.school}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-[#1A1A1A] bg-[#FAF7F0] p-4 shadow-[3px_3px_0_#1A1A1A]"
                        >
                          <div>
                            <p className="font-serif text-lg font-semibold text-[#1A1A1A]">
                              {e.school}
                            </p>
                            <p className="font-serif text-[14px] text-[#2A2F3E]">
                              {e.degree}
                            </p>
                          </div>
                          <span className="rounded-full border-2 border-[#1A1A1A] bg-[#B8E847] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wide">
                            {e.note}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className="rounded-xl border-l-4 bg-[#F2EBD9]/50 px-4 py-3"
                    style={{ borderColor: mission.accent }}
                  >
                    <span className="font-serif text-sm italic text-[#2A2F3E]">
                      <strong className="not-italic">The through-line:</strong>{" "}
                      every product problem is a behaviour problem first.
                    </span>
                  </div>
                </>
              )}

              {mission.id === "m2" && (
                <>
                  <p className="font-serif text-[15px] leading-relaxed text-[#2A2F3E]">
                    Most of these were built in a weekend, a few in five hours.
                    Different domains, one instinct: find a real person with a
                    real problem, then build the smallest thing that removes it.
                  </p>
                  {[
                    { key: "software", label: "Software & AI Agents",
                      note: "Things that live on a screen." },
                    { key: "physical", label: "Physical AI & Hardware",
                      note: "And I don't stop at the screen." },
                  ].map((shelf) => {
                    const items = BUILDS.map((b, i) => ({ b, i })).filter(
                      (x) => x.b.group === shelf.key,
                    );
                    const cart = [T.coral, T.sky, T.lime, T.yellow];
                    return (
                      <div key={shelf.key}>
                        <div className="mb-1 flex items-baseline gap-2">
                          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A]">
                            {shelf.label}
                          </p>
                          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#7A7468]">
                            · {items.length}
                          </span>
                        </div>
                        <p className="mb-4 font-serif text-[13px] italic text-[#2A2F3E]">
                          {shelf.note}
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {items.map(({ b, i }, slot) => {
                            const accent = cart[slot % cart.length];
                            return (
                              <button
                                key={b.name}
                                onClick={() => {
                                  blip(560);
                                  setOpenBuild(i);
                                }}
                                data-hover
                                className="group relative flex flex-col overflow-hidden rounded-xl border-2 border-[#1A1A1A] bg-[#FAF7F0] text-left shadow-[3px_3px_0_#1A1A1A] transition hover:-translate-y-1 hover:shadow-[7px_7px_0_#1A1A1A]"
                              >
                                <div
                                  className="flex items-center justify-between border-b-2 border-[#1A1A1A] px-4 py-2"
                                  style={{ background: accent }}
                                >
                                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]">
                                    Slot {String(slot + 1).padStart(2, "0")}
                                  </span>
                                  <span aria-hidden className="flex gap-1">
                                    <span className="h-3 w-1 rounded-sm bg-[#1A1A1A]/70" />
                                    <span className="h-3 w-1 rounded-sm bg-[#1A1A1A]/70" />
                                    <span className="h-3 w-1 rounded-sm bg-[#1A1A1A]/70" />
                                  </span>
                                </div>
                                <div className="flex flex-1 flex-col p-5">
                                  <div className="flex items-start justify-between gap-2">
                                    <span className="font-serif text-lg font-semibold text-[#1A1A1A]">
                                      {b.name}
                                    </span>
                                    <Trophy className="size-4 shrink-0 text-[#1A1A1A]" />
                                  </div>
                                  <p className="mt-2 flex-1 font-serif text-[13px] leading-snug text-[#2A2F3E]">
                                    {b.what}
                                  </p>
                                  <div className="mt-4 flex items-center justify-between gap-2">
                                    <span
                                      className="inline-flex items-center gap-1 rounded-full border-2 border-[#1A1A1A] px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide"
                                      style={{ background: accent }}
                                    >
                                      {b.tag}
                                    </span>
                                    <span className="flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-wide text-[#7A7468] transition group-hover:text-[#1A1A1A]">
                                      insert
                                      <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                                    </span>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {mission.id === "m3" && (
                <>
                  <div className="space-y-4 font-serif text-[15px] leading-relaxed text-[#2A2F3E]">
                    <p>
                      Lately I keep ending up in hardware. I clipped my first AI
                      device to a cap at a build sprint and have not stopped
                      since: Raspberry Pis, 3D printers, soldering my first
                      board. After years of pixels, working with atoms is the
                      most fun I have had in a while.
                    </p>
                    <p>
                      My evenings go to neuro and AI nights. Neural interfaces,
                      whole-brain emulation, how minds fail and change. As a
                      behavioural scientist, watching how the brain actually
                      works keeps reshaping how I think about why people are
                      irrational.
                    </p>
                    <p>
                      Where I am heading: human and AI interaction that people
                      actually feel safe adopting, and, eventually, a company of
                      my own.
                    </p>
                  </div>

                  {/* Currently reading */}
                  <div>
                    <p
                      className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: mission.accent }}
                    >
                      On my nightstand
                    </p>
                    <div className="flex gap-4 rounded-xl border-2 border-[#1A1A1A] bg-[#FAF7F0] p-4 shadow-[3px_3px_0_#1A1A1A]">
                      <div className="flex h-32 w-[88px] shrink-0 flex-col items-center justify-center gap-1.5 rounded border-2 border-dashed border-[#1A1A1A]/25 bg-[#F2EBD9] text-[#7A7468]">
                        <BookOpen className="size-6" />
                        <span className="font-mono text-[8px] font-bold uppercase tracking-widest">
                          cover
                        </span>
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#7A7468]">
                          Currently reading
                        </p>
                        <p className="mt-1 font-serif text-xl font-semibold text-[#1A1A1A]">
                          {READING.title}
                        </p>
                        <p
                          className="font-mono text-[11px] font-bold uppercase tracking-wide"
                          style={{ color: mission.accent }}
                        >
                          {READING.author}
                        </p>
                        <p className="mt-2 font-serif text-[13px] italic leading-snug text-[#2A2F3E]">
                          {READING.note}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Corkboard: cat */}
                  <div>
                    <p
                      className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: mission.accent }}
                    >
                      My cat
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 rounded-2xl border-2 border-[#1A1A1A] bg-[#F2EBD9]/60 px-4 py-8 shadow-[3px_3px_0_#1A1A1A] sm:justify-start sm:gap-8 sm:px-8">
                      {CAT_SHOTS.map((p, i) => (
                        <Polaroid
                          key={i}
                          caption={p.caption}
                          tilt={p.tilt}
                          accent={T.coral}
                          label="cat"
                          icon={Cat}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Corkboard: travel */}
                  <div>
                    <p
                      className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: mission.accent }}
                    >
                      Places I have been
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 rounded-2xl border-2 border-[#1A1A1A] bg-[#F2EBD9]/60 px-4 py-8 shadow-[3px_3px_0_#1A1A1A] sm:justify-start sm:gap-8 sm:px-8">
                      {TRAVEL_SHOTS.map((p, i) => (
                        <Polaroid
                          key={i}
                          caption={p.caption}
                          tilt={p.tilt}
                          accent={T.sky}
                          label="travel"
                          icon={MapPin}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p
                      className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: mission.accent }}
                    >
                      Languages
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {LANGS.map((l) => (
                        <span
                          key={l}
                          className="rounded-full border-2 border-[#1A1A1A] bg-[#FAF7F0] px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wide shadow-[2px_2px_0_#1A1A1A]"
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    className="rounded-xl border-l-4 bg-[#F2EBD9]/50 px-4 py-3"
                    style={{ borderColor: mission.accent }}
                  >
                    <span className="font-serif text-sm italic text-[#2A2F3E]">
                      <strong className="not-italic">The through-line:</strong>{" "}
                      the day job pays the bills; curiosity picks the next
                      problem.
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-12 flex items-center justify-between border-t-2 border-dashed border-[#1A1A1A]/30 pt-6">
              <button onClick={prev} data-hover className={PILL}>
                <ArrowLeft className="size-4" /> {mIndex === 0 ? "Routes" : "Prev"}
              </button>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#7A7468]">
                {mIndex + 1} / {MISSIONS.length}
              </span>
              <button
                onClick={next}
                data-hover
                className={PILL}
                style={{ background: mission.accent }}
              >
                {mIndex === MISSIONS.length - 1 ? "Finish" : "Next"}{" "}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </section>
        )}

        {/* COMPLETE */}
        {view === "complete" && (
          <section className="mx-auto max-w-2xl px-5 py-16 text-center sm:px-8 sm:py-20">
            <div className="lab-float mx-auto flex size-16 items-center justify-center rounded-2xl border-2 border-[#1A1A1A] bg-[#F1C40F] shadow-[4px_4px_0_#1A1A1A]">
              <Rocket className="size-8 text-[#1A1A1A]" />
            </div>
            <p className="mt-5 font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#7A7468]">
              more to come
            </p>
            <h1
              className="mt-3 font-serif text-4xl font-semibold sm:text-6xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              Watch this space.
            </h1>
            <p className="mt-4 mx-auto max-w-md font-serif text-lg text-[#2A2F3E]">
              I build out of curiosity, and a belief that real problems are
              worth solving.
            </p>

            <div className="mx-auto mt-7 flex max-w-md flex-wrap justify-center gap-2">
              {MISSIONS.map((m) => (
                <span
                  key={m.id}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#1A1A1A] bg-[#FAF7F0] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wide shadow-[2px_2px_0_#1A1A1A]"
                >
                  <Check className="size-3.5" style={{ color: T.lime }} />
                  {m.tag}
                </span>
              ))}
            </div>

            {/* locked next chapter, fused into the contact CTAs */}
            <div className="mx-auto mt-4 max-w-md rounded-2xl border-2 border-[#1A1A1A] bg-[#F2EBD9] p-5 shadow-[4px_4px_0_#1A1A1A] sm:p-6">
              <div className="flex items-center justify-center gap-2">
                <Lock className="size-4 text-[#7A7468]" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-[#7A7468]">
                  What comes next
                </span>
                <span className="lab-blink font-mono text-[9px] font-bold uppercase tracking-wide text-[#C0392B]">
                  locked
                </span>
              </div>
              <p className="mt-2 font-serif text-base text-[#1A1A1A]">
                Reach out and you're first to see it.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <a
                  href="mailto:nicolejiang2324@gmail.com"
                  data-hover
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#1A1A1A] bg-[#FF5C4D] px-5 py-4 font-mono text-sm font-bold uppercase tracking-wide text-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#1A1A1A]"
                >
                  <Mail className="size-5" /> Email me
                </a>
                <a
                  href="https://www.linkedin.com/in/nicole-jiang-567054201/"
                  target="_blank"
                  rel="noreferrer"
                  data-hover
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#1A1A1A] bg-[#2C3E73] px-5 py-4 font-mono text-sm font-bold uppercase tracking-wide text-[#FAF7F0] shadow-[3px_3px_0_#1A1A1A] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#1A1A1A]"
                >
                  <Linkedin className="size-5" /> LinkedIn
                </a>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-5 font-mono text-[11px] uppercase tracking-widest text-[#7A7468]">
              <button
                onClick={() => {
                  setDone([]);
                  go("boot", 300);
                }}
                data-hover
                className="inline-flex items-center gap-1.5 hover:text-[#1A1A1A]"
              >
                <Play className="size-3.5" /> Play again
              </button>
              <a href="/work" data-hover className="hover:text-[#1A1A1A]">
                /work
              </a>
            </div>
          </section>
        )}
      </div>

      {/* BUILD DETAIL MODAL */}
      {openBuild !== null &&
        (() => {
          const b = BUILDS[openBuild];
          return (
            <div
              onClick={() => setOpenBuild(null)}
              role="dialog"
              aria-modal="true"
              aria-label={`${b.name} details`}
              className="fixed inset-0 z-[95] flex items-end justify-center bg-[#1A1A1A]/50 p-4 backdrop-blur-sm sm:items-center"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="lab-view relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border-2 border-[#1A1A1A] bg-[#FAF7F0] p-6 shadow-[6px_6px_0_#1A1A1A] sm:p-8"
              >
                <button
                  onClick={() => setOpenBuild(null)}
                  data-hover
                  aria-label="Close"
                  className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] transition hover:-translate-y-0.5 hover:bg-[#FF5C4D]"
                >
                  <X className="size-4" />
                </button>
                <span className="inline-block rounded-full border-2 border-[#1A1A1A] bg-[#B8E847] px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide">
                  {b.tag}
                </span>
                <h3
                  className="mt-3 pr-10 font-serif text-3xl font-semibold text-[#1A1A1A]"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {b.name}
                </h3>
                <p className="mt-3 font-serif text-[15px] leading-relaxed text-[#2A2F3E]">
                  {b.what}
                </p>
                {b.detail ? (
                  <div className="mt-4 space-y-3 font-serif text-[14px] leading-relaxed text-[#2A2F3E]">
                    {b.detail.split("\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border-2 border-dashed border-[#1A1A1A]/30 bg-[#F2EBD9]/50 p-4">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#7A7468]">
                      the full story
                    </p>
                    <p className="mt-1 font-serif text-[13px] italic text-[#2A2F3E]">
                      More detail on this build is on the way.
                    </p>
                  </div>
                )}
                {b.link && (
                  <a
                    href={b.link}
                    target="_blank"
                    rel="noreferrer"
                    data-hover
                    className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-[#1A1A1A] bg-[#1A1A1A] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wide text-[#FAF7F0] shadow-[3px_3px_0_#FF5C4D] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#FF5C4D]"
                  >
                    See more <ArrowRight className="size-4" />
                  </a>
                )}
              </div>
            </div>
          );
        })()}

      {view !== "boot" && (
        <footer className="relative z-10 border-t-2 border-[#1A1A1A] px-5 py-6 sm:px-8">
          <div className="mx-auto flex max-w-4xl items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#7A7468]">
            <span>nicole jiang · v0.3 / build 153</span>
            <span>© 2026 · London</span>
          </div>
        </footer>
      )}
    </main>
  );
}
