import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from "react";
import { ArrowRight, Mic, Headphones, Compass, Gamepad2, Volume2, VolumeX, Sparkles, Cpu, Waves, Radio, Bot, Trophy, Zap, Clock, MapPin } from "lucide-react";

const theme = {
  paper: "#FAF7F0",
  cream: "#F2EBD9",
  ink: "#1A1A1A",
  inkSoft: "#3A3A3A",
  muted: "#7A7468",
  coral: "#FF5C4D",
  sky: "#4DA3FF",
  lime: "#B8E847",
  yellow: "#F1C40F",
  red: "#C0392B",
  navy: "#2C3E73",
  shadow: "0 1px 0 rgba(26,26,26,0.06), 0 8px 24px -8px rgba(26,26,26,0.10)",
};

const projects = [
  { id: "tella", icon: Bot, cover: "🎙️", title: "Tella", subtitle: "Voice AI for elderly care", hours: "48h", track: "Productivity Top 3", prizes: "2 prizes", stack: ["ElevenLabs", "Anthropic", "Twilio", "ACI.dev"], blurb: "Proactive AI calls for the gaps between scheduled care visits. The smallest thing that removes the most pain.", win: true },
  { id: "donna", icon: Radio, cover: "📦", title: "donna.ai", subtitle: "Voice agent for delivery", hours: "5h", track: "Best Use of ElevenLabs", prizes: "1 prize", stack: ["ElevenLabs", "OpenAI", "Encord", "DeepMind", "Lovable"], blurb: "Real-time multimodal agent. Driver speaks, customer hears back before panic. 84% of broken delivery experiences = lost retailer customers.", win: true },
  { id: "vibify", icon: Headphones, cover: "🎧", title: "Vibify", subtitle: "Context-aware music recs", hours: "6h", track: "London AI Hack #2", prizes: "0 prizes", stack: ["Weaviate", "OpenAI", "Prolific", "ElevenLabs"], blurb: "Translates musical features into tokens, blends with weather + calendar. Match my vibe so I can get into flow.", win: false },
  { id: "meditation", icon: Waves, cover: "🧘", title: "Mindful Pi", subtitle: "Offline meditation device", hours: "48h", track: "On-device AI Hackathon", prizes: "1 prize (Overmind track)", stack: ["Raspberry Pi", "Cognee", "Local LLM"], blurb: "No screen, no internet. The medium can't undermine the message. Local memory you choose to share.", win: true },
  { id: "repvoice", icon: Mic, cover: "💊", title: "RepVoice", subtitle: "Voice OS for pharma reps", hours: "48h", track: "Voice AI Hack London", prizes: "Top 3 in Productivity", stack: ["Gradium", "Speechmatics", "Thymia", "TinyFish"], blurb: "Speak your post-call summary. CRM fields, MHRA alerts, Veeva auto-fill, voice-brief on next visit. Voice in. Paperwork out.", win: true },
];

const stats = [
  { k: "Hackathons", v: "5", icon: Gamepad2 },
  { k: "Prizes", v: "4", icon: Trophy },
  { k: "Hours shipped", v: "~155h", icon: Clock },
  { k: "Loc", v: "LDN", icon: MapPin },
];

const interests = [
  { i: Compass, t: "Physical AI", d: "Robots, locomotion, world models." },
  { i: Cpu, t: "Neurotech", d: "Brain-computer interfaces. Reading on it constantly." },
  { i: Waves, t: "The ocean", d: "Especially the deep ocean. It makes everything feel small in a good way." },
  { i: Sparkles, t: "The universe", d: "Spacetime. Black holes. The light-year kind of scale." },
];

const layers = [
  { n: "01", t: "Diagnose", d: "Specific person, moment, friction." },
  { n: "02", t: "Design", d: "Smallest intervention that could plausibly change the behaviour." },
  { n: "03", t: "Test", d: "1–5% effect sizes compound. Value lives in the portfolio." },
  { n: "04", t: "Document", d: "Every IPC tagged. Null results = knowledge." },
  { n: "05", t: "Govern", d: "APEASE. Dark patterns. DSA, AI Act, GDPR." },
  { n: "06", t: "AI-loop", d: "Personalisation, decay, RL sequencing." },
];

function Sticky({ text, rotate = -2, color = "yellow" }: { text: string; rotate?: number; color?: "yellow" | "pink" | "blue" }) {
  const colors = {
    yellow: { bg: "#F1C40F", text: "#1A1A1A" },
    pink: { bg: "#FFD6E0", text: "#1A1A1A" },
    blue: { bg: "#C5DAFF", text: "#1A1A1A" },
  };
  return (
    <div
      className="inline-block px-3 py-2 font-serif text-sm shadow-md"
      style={{ background: colors[color].bg, color: colors[color].text, transform: `rotate(${rotate}deg)` }}
    >
      {text}
    </div>
  );
}

function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let x = 0, y = 0, tx = 0, ty = 0;
    let raf = 0;
    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5C4D] mix-blend-multiply md:block" style={{ filter: "blur(2px)" }} />
  );
}

function Coin({ x, y, delay = 0 }: { x: string; y: string; delay?: number }) {
  return (
    <div aria-hidden className="pointer-events-none fixed z-[90] text-2xl opacity-0" style={{ left: x, top: y, animation: `coinPop 1.6s ${delay}s ease-out forwards` }}>
      <style>{`@keyframes coinPop { 0% { transform: translateY(0) scale(0); opacity: 0; } 20% { transform: translateY(-30px) scale(1); opacity: 1; } 80% { transform: translateY(-90px) scale(1) rotate(360deg); opacity: 1; } 100% { transform: translateY(-120px) scale(0.8) rotate(720deg); opacity: 0; } }`}</style>
      ✦
    </div>
  );
}

export default function Play() {
  const [booted, setBooted] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [coins, setCoins] = useState<{ id: number; x: string; y: string }[]>([]);

  const timers = useRef<number[]>([]);
  useEffect(() => () => { timers.current.forEach(window.clearTimeout); }, []);
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };

  const handleStart = () => {
    setPressed(true);
    later(() => setBooted(true), 600);
  };

  const triggerConfetti = (e: ReactMouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newCoins = Array.from({ length: 6 }).map((_, i) => ({ id: Date.now() + i, x: `${rect.left + Math.random() * rect.width}px`, y: `${rect.top}px` }));
    setCoins(newCoins);
    later(() => setCoins([]), 1800);
  };

  return (
    <main style={{ "--page-bg": theme.paper, "--page-fg": theme.ink, "--page-muted": theme.muted, "--page-coral": theme.coral, "--page-sky": theme.sky, "--page-lime": theme.lime, "--page-cream": theme.cream, "--page-yellow": theme.yellow, "--page-red": theme.red, "--page-navy": theme.navy } as CSSProperties} className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] font-sans antialiased">
      <Cursor />

      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-[0.04] mix-blend-multiply" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, rgba(0,0,0,0.3) 1px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(0,0,0,0.2) 1px, transparent 1px)", backgroundSize: "3px 3px, 5px 5px" }} />

      <button onClick={() => setSoundOn(!soundOn)} className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full border border-[#1A1A1A]/15 bg-[#FAF7F0] px-3 py-1.5 text-xs font-medium shadow-sm transition hover:bg-[#F2EBD9]">
        {soundOn ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
        <span className="hidden sm:inline">{soundOn ? "SFX on" : "SFX off"}</span>
      </button>

      {!booted ? (
        <section className="relative z-10 flex min-h-screen items-center justify-center px-6">
          <div className="text-center">
            <p className="mb-4 text-xs font-mono uppercase tracking-[0.3em] text-[#7A7468]">nico.li — v.0.1</p>
            <h1 className={`text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl ${pressed ? "animate-pulse" : ""}`} style={{ letterSpacing: "-0.03em" }}>
              <span className="text-[#FF5C4D]">n</span><span>i</span><span className="text-[#4DA3FF]">c</span><span>o</span><span className="text-[#B8E847]">l</span><span>e</span><span className="text-[#1A1A1A]">.</span><span className="text-[#FF5C4D]">js</span>
            </h1>
            <p className="mx-auto mt-6 max-w-md text-sm text-[#7A7468]">Behavioural scientist · AI product builder · plays on weekends</p>
            <button onClick={handleStart} className="group mt-12 inline-flex items-center gap-3 rounded-full border-2 border-[#1A1A1A] bg-[#1A1A1A] px-8 py-3 text-sm font-bold uppercase tracking-widest text-[#FAF7F0] transition hover:bg-[#FF5C4D] hover:border-[#FF5C4D]">
              <Gamepad2 className="size-4" /> Press start <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </button>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-[#7A7468]">↓ scroll to play ↓</p>
          </div>
        </section>
      ) : (
        <>
          <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-[#1A1A1A]/10 bg-[#FAF7F0]/80 px-6 py-3 backdrop-blur-md sm:px-10">
            <a href="/" className="flex items-center gap-2 text-sm font-bold">
              <span className="inline-block h-2 w-2 rounded-full bg-[#FF5C4D] animate-pulse" />
              nicole<span className="text-[#FF5C4D]">.</span>
            </a>
            <div className="hidden gap-6 text-sm font-medium sm:flex">
              <a href="#moat" className="hover:text-[#FF5C4D]">§ Moat</a>
              <a href="#projects" className="hover:text-[#FF5C4D]">§ Projects</a>
              <a href="#engine" className="hover:text-[#FF5C4D]">§ Engine</a>
              <a href="#vibe" className="hover:text-[#FF5C4D]">§ Vibe</a>
              <a href="/work" className="rounded-full bg-[#1A1A1A] px-3 py-1 text-[#FAF7F0] hover:bg-[#FF5C4D]">Work ↗</a>
            </div>
          </nav>

          {/* HERO */}
          <section className="relative overflow-hidden border-b border-[#1A1A1A]/10">
            <div className="mx-auto grid max-w-6xl gap-8 px-6 py-20 sm:px-10 md:grid-cols-12 md:py-32">
              <div className="md:col-span-8">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <p className="inline-flex items-center gap-2 rounded-full border border-[#1A1A1A]/20 bg-[#F2EBD9] px-3 py-1 font-mono text-[10px] uppercase tracking-widest">
                    <Zap className="size-3 text-[#FF5C4D]" /> live_build: true
                  </p>
                  <span className="font-serif text-[11px] uppercase tracking-widest text-[#2C3E73]">— opening claim</span>
                </div>
                <h1 className="text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl" style={{ letterSpacing: "-0.04em" }}>
                  I design AI products that <span className="bg-[#F1C40F] px-1 text-[#1A1A1A]">change behaviour</span> — and <span className="underline decoration-[#C0392B] decoration-wavy underline-offset-4">test whether they actually did</span>.
                </h1>
                <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#3A3A3A]">
                  Behavioural scientist at <span className="font-semibold">algo1.ai</span>. Hackathon builder on weekends. I work at the intersection of COM-B, EAST, and MINDSPACE — and the kind of shipping that produces evidence, not opinions.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <a href="#projects" onClick={triggerConfetti} className="group inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-5 py-3 text-sm font-bold text-[#FAF7F0] transition hover:bg-[#FF5C4D]">
                    See the 5 projects <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </a>
                  <a href="#engine" className="inline-flex items-center gap-2 rounded-full border-2 border-[#1A1A1A] px-5 py-3 text-sm font-bold transition hover:bg-[#1A1A1A] hover:text-[#FAF7F0]">
                    The method
                  </a>
                </div>
                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <Sticky text="~155h shipped in 2026" rotate={-2} color="yellow" />
                  <Sticky text="4 languages, 4 prize tracks" rotate={1.5} color="pink" />
                  <Sticky text="1 yellow highlighter running out" rotate={-1} color="blue" />
                </div>
              </div>
              <div className="md:col-span-4">
                <div className="rounded-2xl border-2 border-[#1A1A1A] bg-[#F2EBD9] p-5" style={{ boxShadow: theme.shadow }}>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#FF5C4D]" />
                      <span className="h-2 w-2 rounded-full bg-[#B8E847]" />
                      <span className="h-2 w-2 rounded-full bg-[#4DA3FF]" />
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#7A7468]">~/stats.json</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {stats.map((s) => {
                      const Icon = s.icon;
                      return (
                        <div key={s.k} className="rounded-lg border border-[#1A1A1A]/15 bg-[#FAF7F0] p-3">
                          <Icon className="mb-1.5 size-3.5 text-[#FF5C4D]" />
                          <div className="text-2xl font-bold leading-none">{s.v}</div>
                          <div className="mt-1 text-[10px] uppercase tracking-wider text-[#7A7468]">{s.k}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-[#1A1A1A]/15 pt-3 font-mono text-[10px] uppercase tracking-widest text-[#7A7468]">
                    <span>last_ship</span>
                    <span className="rounded bg-[#B8E847] px-1.5 py-0.5 text-[#1A1A1A]">2d ago</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* MOAT — the named intersection */}
          <section id="moat" className="border-b border-[#1A1A1A]/10 bg-[#F2EBD9] py-20 sm:py-28">
            <div className="mx-auto max-w-5xl px-6 sm:px-10">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#7A7468]">// 01 — the moat</p>
              <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl" style={{ letterSpacing: "-0.03em" }}>
                <span className="bg-[#F1C40F] px-1">Behavioural product judgement.</span>
              </h2>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#3A3A3A]">
                The rare ability to see <em>why</em> people behave as they do, spot the <em>pattern</em> in the data, articulate <em>what should be built</em> — and design <em>how it should feel</em>. Most PMs have one or two of these. I have all four, and I ship the work to prove it.
              </p>

              <div className="mt-12 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border-2 border-[#1A1A1A] bg-[#FAF7F0] p-6" style={{ boxShadow: "3px 3px 0 #1A1A1A" }}>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#FF5C4D]">a) diagnosis</p>
                  <h3 className="mt-2 text-2xl font-bold">Why people do what they do.</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#3A3A3A]">MSc Behaviour Change (Distinction), UCL. COM-B + BCTTv1 + EAST + MINDSPACE, applied in production at algo1.</p>
                </div>
                <div className="rounded-2xl border-2 border-[#1A1A1A] bg-[#FAF7F0] p-6" style={{ boxShadow: "3px 3px 0 #1A1A1A" }}>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#FF5C4D]">b) patterns</p>
                  <h3 className="mt-2 text-2xl font-bold">What the data is actually saying.</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#3A3A3A]">A/B tests, segmentation, temporal curves. Calibrated to real-world 1–5% effect sizes — the 6x gap (DellaVigna & Linos 2022).</p>
                </div>
                <div className="rounded-2xl border-2 border-[#1A1A1A] bg-[#FAF7F0] p-6" style={{ boxShadow: "3px 3px 0 #1A1A1A" }}>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#FF5C4D]">c) articulation</p>
                  <h3 className="mt-2 text-2xl font-bold">What should be built — and why.</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#3A3A3A]">From research insight to PRDs to dev-ready stories. The IPC (Intervention Performance Card) framework turns every test into a unit of evidence.</p>
                </div>
                <div className="rounded-2xl border-2 border-[#1A1A1A] bg-[#FAF7F0] p-6" style={{ boxShadow: "3px 3px 0 #1A1A1A" }}>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#FF5C4D]">d) feel</p>
                  <h3 className="mt-2 text-2xl font-bold">How it should feel to use.</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#3A3A3A]">Visual thinker. Designed every screen of Tella, donna.ai, Mindful Pi. I feel a bad interface before I can name why.</p>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-2">
                <span className="font-serif text-xs uppercase tracking-widest text-[#7A7468]">the named system →</span>
                <a href="#engine"><Sticky text="The BeSci Engine" rotate={-2} color="blue" /></a>
              </div>
            </div>
          </section>

          {/* PROJECTS */}
          <section id="projects" className="border-b border-[#1A1A1A]/10 py-20 sm:py-28">
            <div className="mx-auto max-w-6xl px-6 sm:px-10">
              <div className="mb-12 flex items-end justify-between gap-6">
                <div>
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#7A7468]">// 02 — projects</p>
                  <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl" style={{ letterSpacing: "-0.03em" }}>The cartridge shelf.</h2>
                  <p className="mt-4 max-w-xl text-base text-[#3A3A3A]">5 hackathon projects. 4 won something. ~155 hours of shipping. <a href="/work" className="font-semibold text-[#FF5C4D] hover:underline">Full case studies →</a></p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((p) => {
                  return (
                    <a key={p.id} href={`/work#${p.id}`} onMouseEnter={() => setHovered(p.id)} onMouseLeave={() => setHovered(null)} className="group relative overflow-hidden rounded-2xl border-2 border-[#1A1A1A] bg-[#FAF7F0] p-6 transition hover:-translate-y-1" style={{ boxShadow: hovered === p.id ? "6px 6px 0 #1A1A1A" : "3px 3px 0 #1A1A1A" }}>
                      <div className="mb-4 flex items-start justify-between">
                        <div className="text-5xl" role="img" aria-label={p.title}>{p.cover}</div>
                        {p.win && (
                          <div className="flex items-center gap-1 rounded-full bg-[#B8E847] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A]">
                            <Trophy className="size-2.5" /> won
                          </div>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold leading-tight" style={{ letterSpacing: "-0.02em" }}>{p.title}</h3>
                      <p className="mt-1 text-sm text-[#7A7468]">{p.subtitle}</p>
                      <p className="mt-4 text-sm leading-relaxed text-[#3A3A3A]">{p.blurb}</p>
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {p.stack.map((s) => (
                          <span key={s} className="rounded-full border border-[#1A1A1A]/20 bg-[#F2EBD9] px-2 py-0.5 font-mono text-[10px]">{s}</span>
                        ))}
                      </div>
                      <div className="mt-5 flex items-center justify-between border-t border-[#1A1A1A]/10 pt-4 font-mono text-[10px] uppercase tracking-widest text-[#7A7468]">
                        <span>⏱ {p.hours}</span>
                        <span>{p.prizes}</span>
                        <span>{p.track}</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ENGINE */}
          <section id="engine" className="border-b border-[#1A1A1A]/10 bg-[#F2EBD9] py-20 sm:py-28">
            <div className="mx-auto max-w-6xl px-6 sm:px-10">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#7A7468]">// 03 — engine</p>
              <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl" style={{ letterSpacing: "-0.03em" }}>The BeSci Engine.</h2>
              <p className="mt-4 max-w-2xl text-base text-[#3A3A3A]">6 layers. Diagnose → design → test → document → govern → AI loop. The named method I built at algo1. <a href="/work#besci" className="font-semibold text-[#FF5C4D] hover:underline">Read the full breakdown →</a></p>

              <div className="mt-12 rounded-2xl border-2 border-[#1A1A1A] bg-[#FAF7F0] p-4 sm:p-6" style={{ boxShadow: "6px 6px 0 #1A1A1A" }}>
                <div className="mb-4 flex items-center justify-between border-b border-[#1A1A1A]/15 pb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#FF5C4D] animate-pulse" />
                    <span className="h-2 w-2 rounded-full bg-[#B8E847]" />
                    <span className="h-2 w-2 rounded-full bg-[#4DA3FF]" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#7A7468]">besci.engine v1.0</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#7A7468]">output: ipc[]</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {layers.map((l) => (
                    <div key={l.n} className="rounded-xl border border-[#1A1A1A]/15 bg-[#F2EBD9] p-4 transition hover:border-[#1A1A1A]">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-[#FF5C4D]">{l.n}</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-[#B8E847]" />
                      </div>
                      <h3 className="mt-2 text-lg font-bold">{l.t}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#3A3A3A]">{l.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* VIBE */}
          <section id="vibe" className="border-b border-[#1A1A1A]/10 py-20 sm:py-28">
            <div className="mx-auto max-w-6xl px-6 sm:px-10">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#7A7468]">// 04 — vibe</p>
              <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl" style={{ letterSpacing: "-0.03em" }}>What I'm into right now.</h2>
              <p className="mt-4 max-w-2xl text-base text-[#3A3A3A]">High curiosity. I learn whatever feels interesting this week.</p>
              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {interests.map((b, i) => {
                  const Icon = b.i;
                  const colors = ["#FF5C4D", "#4DA3FF", "#B8E847", "#FF5C4D"];
                  return (
                    <div key={b.t} className="rounded-2xl border-2 border-[#1A1A1A] bg-[#FAF7F0] p-5" style={{ boxShadow: "3px 3px 0 #1A1A1A" }}>
                      <div className="mb-3 flex size-10 items-center justify-center rounded-lg" style={{ background: colors[i] + "33", border: `2px solid ${colors[i]}` }}>
                        <Icon className="size-5" style={{ color: colors[i] }} />
                      </div>
                      <h3 className="text-lg font-bold">{b.t}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-[#3A3A3A]">{b.d}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CLOSING */}
          <section className="py-24 sm:py-32">
            <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[#7A7468]">// 99 — game.over?</p>
              <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl" style={{ letterSpacing: "-0.03em" }}>Insert coin. <span className="text-[#FF5C4D]">Continue?</span></h2>
              <p className="mt-5 text-base text-[#3A3A3A] sm:text-lg">Building an AI product that needs a behavioural lens? I take on a small number of collaborations.</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-6 py-3 text-sm font-bold text-[#FAF7F0] transition hover:bg-[#FF5C4D]">Start a conversation <ArrowRight className="size-4" /></a>
                <a href="/work" className="inline-flex items-center gap-2 rounded-full border-2 border-[#1A1A1A] px-6 py-3 text-sm font-bold transition hover:bg-[#1A1A1A] hover:text-[#FAF7F0]">See all work</a>
              </div>
            </div>
          </section>

          <footer className="border-t border-[#1A1A1A]/10 py-10">
            <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 text-sm text-[#7A7468] sm:flex-row sm:items-center sm:px-10">
              <div>© Nicole Jiang · London · v0.1 / build 142</div>
              <div className="flex gap-5 font-mono text-xs">
                <a href="/play" className="text-[#FF5C4D]">/play</a>
                <a href="/" className="hover:text-[#1A1A1A]">/home</a>
                <a href="/lab" className="hover:text-[#1A1A1A]">/lab</a>
                <a href="mailto:nicolejiang2324@gmail.com" className="hover:text-[#1A1A1A]">email</a>
                <a href="https://www.linkedin.com/in/nicole-jiang-567054201/" target="_blank" rel="noreferrer" className="hover:text-[#1A1A1A]">linkedin</a>
              </div>
            </div>
          </footer>
        </>
      )}

      {coins.map((c) => <Coin key={c.id} x={c.x} y={c.y} />)}
    </main>
  );
}