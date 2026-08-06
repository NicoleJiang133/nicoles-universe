import { useEffect, useRef, useState } from "react";
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
  { id: "meditate", icon: Waves, cover: "🧘", title: "Mindful Pi", subtitle: "Offline meditation device", hours: "48h", track: "On-device AI Hackathon", prizes: "1 prize (Overmind track)", stack: ["Raspberry Pi", "Cognee", "Local LLM"], blurb: "No screen, no internet. The medium can't undermine the message. Local memory you choose to share.", win: true },
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

export default function Home() {
  const [view, setView] = useState<"boot" | "play">("boot");
  const [hovered, setHovered] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);
  const [keys, setKeys] = useState<{ a: boolean; d: boolean; space: boolean }>({ a: false, d: false, space: false });
  const [playerX, setPlayerX] = useState(50);
  const [score, setScore] = useState(0);
  const [obstacles, setObstacles] = useState<{ id: number; x: number; y: number; type: "star" | "void" }[]>([]);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setView("play"), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (view !== "play") return;
    const onKey = (e: KeyboardEvent, down: boolean) => {
      if (e.key === "a" || e.key === "ArrowLeft") setKeys((k) => ({ ...k, a: down }));
      if (e.key === "d" || e.key === "ArrowRight") setKeys((k) => ({ ...k, d: down }));
      if (e.key === " ") { setKeys((k) => ({ ...k, space: down })); e.preventDefault(); }
    };
    const dn = (e: KeyboardEvent) => onKey(e, true);
    const up = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener("keydown", dn);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", dn); window.removeEventListener("keyup", up); };
  }, [view]);

  useEffect(() => {
    if (view !== "play") return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 16;
      last = now;
      setPlayerX((x) => Math.max(8, Math.min(92, x + (keys.d ? 1.2 : 0) * dt - (keys.a ? 1.2 : 0) * dt)));
      setObstacles((obs) => {
        const next = obs.map((o) => ({ ...o, y: o.y + 0.6 * dt })).filter((o) => o.y < 105);
        if (Math.random() < 0.04) {
          next.push({ id: now + Math.random(), x: 10 + Math.random() * 80, y: -5, type: Math.random() > 0.3 ? "star" : "void" });
        }
        return next;
      });
      setScore((s) => s + (keys.space ? 0.5 : 0.2));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [view, keys]);

  return (
    <main
      className="min-h-screen w-full relative overflow-hidden"
      style={{ background: theme.paper, color: theme.ink, fontFamily: '"Courier New", monospace' }}
    >
      <style>{`
        @keyframes float { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-6px) } }
        @keyframes pulse-dot { 0%,100%{ opacity: 1 } 50%{ opacity: 0.3 } }
        @keyframes blink { 0%,100%{ opacity: 1 } 50%{ opacity: 0 } }
        .float { animation: float 3s ease-in-out infinite; }
        .pulse-dot { animation: pulse-dot 1.6s ease-in-out infinite; }
        .blink { animation: blink 1s steps(1) infinite; }
        .pixel { image-rendering: pixelated; }
        @import url('https://fonts.googleapis.com/css2?family=VT323&family=Space+Mono:wght@400;700&display=swap');
      `}</style>

      {view === "boot" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: theme.paper }}>
          <div className="text-6xl mb-6" style={{ color: theme.coral }}>▶</div>
          <div className="text-sm" style={{ color: theme.muted }}>loading portfolio...</div>
          <div className="mt-4 w-48 h-1" style={{ background: theme.cream }}>
            <div className="h-full" style={{ background: theme.coral, width: "100%", animation: "pulse-dot 1.6s ease-in-out infinite" }} />
          </div>
        </div>
      )}

      {view === "play" && (
        <>
          {/* HUD top bar */}
          <header
            className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4"
            style={{ borderBottom: `1px dashed ${theme.ink}`, background: theme.paper }}
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full pulse-dot" style={{ background: theme.coral }} />
              <span className="text-sm font-bold tracking-wider">NICOLE JIANG</span>
              <span className="text-xs" style={{ color: theme.muted }}>// behavioural product builder</span>
            </div>
            <nav className="flex items-center gap-4 text-xs">
              <a href="#work" className="hover:underline">[1] WORK</a>
              <a href="#engine" className="hover:underline">[2] ENGINE</a>
              <a href="#vibe" className="hover:underline">[3] VIBE</a>
              <a href="mailto:nicolejiang2324@gmail.com" className="px-3 py-1 border-2" style={{ borderColor: theme.ink, color: theme.ink }}>[C] CONTACT</a>
            </nav>
          </header>

          {/* Hero / marquee */}
          <section className="pt-24 px-6 pb-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-xs mb-2" style={{ color: theme.muted }}>// file: nicole.exe  ·  v3.2  ·  last updated today</div>
              <h1 className="text-5xl md:text-7xl font-bold leading-none mb-4" style={{ fontFamily: '"VT323", monospace' }}>
                I build products that<br />
                <span style={{ color: theme.coral }}>change behaviour</span>,
                <span style={{ background: theme.yellow, padding: "0 8px" }}> not just screens</span>.
              </h1>
              <p className="text-base max-w-2xl mb-6" style={{ color: theme.inkSoft }}>
                Product & behavioural science. 3+ years embedding COM-B, EAST, MINDSPACE into AI product strategy
                at <span style={{ color: theme.coral, fontWeight: 700 }}>algo1.ai</span>. Hackathon-obsessed. Tinkering with robots, neurotech, and whatever else catches my eye.
              </p>

              {/* Stats ticker */}
              <div className="flex flex-wrap gap-3 mb-6">
                {stats.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.k} className="flex items-center gap-2 px-3 py-2 border-2" style={{ borderColor: theme.ink, boxShadow: theme.shadow }}>
                      <Icon className="w-4 h-4" style={{ color: theme.coral }} />
                      <span className="text-xs" style={{ color: theme.muted }}>{s.k}</span>
                      <span className="text-sm font-bold">{s.v}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* The game: scroll horizontally by holding A/D or ←/→, press SPACE to score */}
          <section id="work" className="relative py-6" style={{ background: theme.cream, borderTop: `2px solid ${theme.ink}`, borderBottom: `2px solid ${theme.ink}` }}>
            <div className="max-w-6xl mx-auto px-6 mb-4 flex items-baseline justify-between">
              <h2 className="text-2xl font-bold" style={{ fontFamily: '"VT323", monospace' }}>&gt; 5 HACKATHONS_SHIPPED</h2>
              <div className="text-xs" style={{ color: theme.muted }}>use [A/D] or [←/→] to steer · [SPACE] to score</div>
            </div>
            <div
              className="relative mx-auto overflow-hidden"
              style={{ height: 280, background: theme.paper, borderTop: `1px dashed ${theme.ink}`, borderBottom: `1px dashed ${theme.ink}` }}
            >
              {/* ground line */}
              <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: theme.ink }} />

              {/* player */}
              <div
                ref={playerRef}
                className="absolute bottom-2"
                style={{ left: `${playerX}%`, transform: "translateX(-50%)", transition: "left 0.05s linear" }}
              >
                <div className="text-3xl float">🥷</div>
              </div>

              {/* obstacles / stars */}
              {obstacles.map((o) => (
                <div key={o.id} className="absolute text-2xl" style={{ left: `${o.x}%`, top: `${o.y}%` }}>
                  {o.type === "star" ? "⭐" : "🕳️"}
                </div>
              ))}

              {/* HUD score */}
              <div className="absolute top-2 right-3 text-xs" style={{ color: theme.ink }}>
                SCORE: <span className="font-bold" style={{ color: theme.coral }}>{Math.floor(score)}</span>
              </div>
            </div>

            {/* Project cards row */}
            <div className="max-w-6xl mx-auto px-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((p) => {
                  const Icon = p.icon;
                  const isHover = hovered === p.id;
                  return (
                    <div
                      key={p.id}
                      onMouseEnter={() => setHovered(p.id)}
                      onMouseLeave={() => setHovered(null)}
                      className="p-4 border-2 cursor-pointer"
                      style={{
                        borderColor: theme.ink,
                        background: isHover ? theme.yellow : theme.paper,
                        boxShadow: theme.shadow,
                        transform: isHover ? "translate(-2px,-2px)" : "none",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-3xl">{p.cover}</div>
                        <div className="flex items-center gap-1">
                          <Icon className="w-4 h-4" style={{ color: theme.coral }} />
                          <span className="text-xs" style={{ color: theme.muted }}>{p.hours}</span>
                        </div>
                      </div>
                      <div className="text-lg font-bold">{p.title}</div>
                      <div className="text-xs mb-2" style={{ color: theme.muted }}>{p.subtitle}</div>
                      <div className="text-xs mb-3" style={{ color: theme.inkSoft }}>{p.blurb}</div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {p.stack.map((s) => (
                          <span key={s} className="text-[10px] px-1.5 py-0.5" style={{ background: theme.cream, border: `1px solid ${theme.ink}` }}>{s}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span style={{ color: theme.muted }}>{p.track}</span>
                        {p.win ? (
                          <span className="px-1.5 py-0.5 font-bold" style={{ background: theme.lime, color: theme.ink }}>🏆 {p.prizes}</span>
                        ) : (
                          <span style={{ color: theme.muted }}>{p.prizes}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Engine section: the 6 layers */}
          <section id="engine" className="py-12 px-6" style={{ background: theme.paper }}>
            <div className="max-w-6xl mx-auto">
              <div className="text-xs mb-2" style={{ color: theme.muted }}>// proprietary</div>
              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: '"VT323", monospace' }}>&gt; THE BESCI ENGINE</h2>
              <p className="text-sm mb-6 max-w-2xl" style={{ color: theme.inkSoft }}>
                The moat: I don't do insights &rarr; features. I do insights &rarr; diagnosis &rarr; intervention &rarr; test &rarr; document &rarr; govern.
                Six layers, COM-B spine, IPC library underneath. Null results count.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {layers.map((l) => (
                  <div
                    key={l.n}
                    className="p-4 border-2 flex gap-3"
                    style={{ borderColor: theme.ink, boxShadow: theme.shadow, background: theme.paper }}
                  >
                    <div className="text-3xl font-bold" style={{ color: theme.coral, fontFamily: '"VT323", monospace' }}>{l.n}</div>
                    <div>
                      <div className="text-base font-bold">{l.t}</div>
                      <div className="text-xs" style={{ color: theme.inkSoft }}>{l.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Vibe section: my curiosity beyond work */}
          <section id="vibe" className="py-12 px-6" style={{ background: theme.cream, borderTop: `2px solid ${theme.ink}` }}>
            <div className="max-w-6xl mx-auto">
              <div className="text-xs mb-2" style={{ color: theme.muted }}>// currently obsessing over</div>
              <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: '"VT323", monospace' }}>&gt; OFF_DUTY.exe</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {interests.map((x) => {
                  const Icon = x.i;
                  return (
                    <div key={x.t} className="p-4 border-2" style={{ borderColor: theme.ink, background: theme.paper, boxShadow: theme.shadow }}>
                      <Icon className="w-6 h-6 mb-2" style={{ color: theme.coral }} />
                      <div className="text-sm font-bold mb-1">{x.t}</div>
                      <div className="text-xs" style={{ color: theme.inkSoft }}>{x.d}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-8 px-6 text-center text-xs" style={{ color: theme.muted, background: theme.paper, borderTop: `1px dashed ${theme.ink}` }}>
            <div className="mb-1">© nicole jiang · london, uk · last build: today</div>
            <div>built by hand · powered by curiosity</div>
          </footer>
        </>
      )}
    </main>
  );
}