import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Brain, Camera, Compass, Gamepad2, Mail, Target, Wrench } from "lucide-react";

const T = {
  paper: "#F1ECE0",
  cream: "#EAE2CE",
  ink: "#0E0E0E",
  muted: "#6B6558",
  flame: "#FF3D1A",
  acid: "#D6FF3D",
  sky: "#4DA3FF",
  navy: "#2C3E73",
  yellow: "#F1C40F",
  white: "#FFFDF7",
};

const SPOTS = [
  { id: "background", number: "01", label: "Quarterpipe", title: "How I got here", icon: Brain },
  { id: "builds", number: "02", label: "Rail", title: "What I build", icon: Wrench },
  { id: "outside", number: "03", label: "Bowl", title: "What pulls me forward", icon: Compass },
] as const;

const SPOT_IDS = SPOTS.map((s) => s.id);

const ROLES = [
  { org: "algo1", role: "Behavioural Scientist", when: "Sep 2025 to now", note: "Behaviour-led AI for grocery retail. I work out why shoppers act as they do, then design and test what shifts it." },
  { org: "Applied Behaviour Change", role: "Product and Behavioural Science Associate", when: "2024 to 2025", note: "Behavioural diagnosis, intervention design, and research for health and wellbeing products." },
  { org: "UCL Centre for Behaviour Change", role: "Research Assistant", when: "2024", note: "Behaviour change intervention ontologies, with the team that writes the field's standards." },
];

const BUILDS = [
  { name: "Tella", tag: "Launched · in beta", text: "An AI voice companion that calls older adults with warm daily check-ins, even on a landline, then flags anything off to their carer." },
  { name: "Basket", tag: "Won · Tokens LDN track", text: "Five AI agents that watch the web for complaints when a product quietly changes its recipe, so brands hear the backlash in weeks, not months." },
  { name: "Drift", tag: "Shortlisted", text: "AI that reads how you actually work, then points to what is worth automating. Built in 24 hours." },
  { name: "donna.ai", tag: "Won · Best use of ElevenLabs", text: "A real-time voice and vision agent that calls delivery customers before a delay turns into a lost one." },
  { name: "EvaOS", tag: "Hardware build", text: "Physical AI you clip to a cap: notes, teleprompter, and navigation, all hands-free." },
  { name: "Mindful Pi", tag: "Won · Overmind track", text: "A fully offline meditation device on a Raspberry Pi. No screen, no internet. It hears your mood and builds a session on-device." },
];

const PLAYER_ROWS = [
  ["player", "nicole jiang"],
  ["class", "behavioural scientist"],
  ["base", "london, uk"],
  ["status", "building at algo1"],
  ["wins", "3 hackathons"],
  ["motto", "enjoy the ride"],
];

function useLondonTime() {
  const [now, setNow] = useState("");
  useEffect(() => {
    const tick = () => setNow(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Europe/London" }).format(new Date()));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);
  return now;
}

const bandFor = (w: number) => (w < 700 ? { cx: 42, amp: 11 } : { cx: 150, amp: 62 });
const depthAt = (t: number) => 0.58 + 0.5 * t;
const roadX = (t: number, w: number) => {
  const { cx, amp } = bandFor(w);
  return cx + amp * Math.sin(t * Math.PI * 1.9 + 0.4);
};
const carveAt = (t: number, w: number, h: number) => {
  const { amp } = bandFor(w);
  const dxdt = amp * 1.9 * Math.PI * Math.cos(t * Math.PI * 1.9 + 0.4);
  return Math.max(-30, Math.min(30, ((Math.atan2(dxdt, Math.max(h, 1)) * 180) / Math.PI) * 2.4));
};

function buildRoad(w: number, h: number, spotTs: number[]) {
  const mobile = w < 700;
  const base = mobile ? 15 : 25;
  const grow = mobile ? 14 : 37;
  const N = 72;
  const left: string[] = [];
  const right: string[] = [];
  const leftI: string[] = [];
  const rightI: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = roadX(t, w);
    const y = t * h;
    const half = base + grow * t;
    const halfI = half * 0.68;
    left.push(`${(x - half).toFixed(1)},${y.toFixed(1)}`);
    right.unshift(`${(x + half).toFixed(1)},${y.toFixed(1)}`);
    leftI.push(`${(x - halfI).toFixed(1)},${y.toFixed(1)}`);
    rightI.unshift(`${(x + halfI).toFixed(1)},${y.toFixed(1)}`);
  }
  const dashes: { x: number; y: number; rot: number; d: number }[] = [];
  for (let t = 0.055; t < 0.972; t += 0.031) {
    if (spotTs.some((s) => Math.abs(s - t) < 0.024)) continue;
    dashes.push({ x: roadX(t, w), y: t * h, rot: carveAt(t, w, h), d: depthAt(t) });
  }
  const line = (t0: number) => {
    const half = (base + grow * t0) * 0.68;
    const sq = (half * 2) / 6;
    const cx = roadX(t0, w);
    const squares = [];
    for (let k = 0; k < 6; k++) {
      squares.push({ x: cx - half + sq * (k + 0.5), y: t0 * h, size: sq, dark: k % 2 === 0 });
    }
    return { squares, cx, cy: t0 * h, rot: carveAt(t0, w, h) };
  };
  return { outer: left.concat(right).join(" "), inner: leftI.concat(rightI).join(" "), dashes, start: line(0.016), finish: line(0.984) };
}

function useJourney(ids: readonly string[]) {
  const refs = useRef<Record<string, HTMLElement | null>>({});
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(ids[0]);
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState<{ w: number; h: number; spots: { id: string; t: number; tm: number }[] }>({
    w: 0,
    h: 1,
    spots: ids.map((id, i) => ({ id, t: (i + 1) / (ids.length + 1), tm: (i + 1) / (ids.length + 1) })),
  });

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const w = track.offsetWidth;
      const h = Math.max(track.offsetHeight, 1);
      const spots = ids.map((id, i) => {
        const el = refs.current[id];
        const t = el ? Math.min(Math.max(el.offsetTop / h, 0), 1) : (i + 1) / (ids.length + 1);
        const tm = el ? Math.min(Math.max((el.offsetTop + el.offsetHeight * 0.42) / h, 0.03), 0.96) : t;
        return { id, t, tm };
      });
      setMetrics((prev) =>
        Math.abs(prev.w - w) < 1 && Math.abs(prev.h - h) < 1 && prev.spots.every((s, i) => Math.abs(s.t - spots[i].t) < 0.001 && Math.abs(s.tm - spots[i].tm) < 0.001)
          ? prev
          : { w, h, spots }
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [ids]);

  useEffect(() => {
    const update = () => {
      const track = trackRef.current;
      if (!track) return;
      const viewport = window.innerHeight;
      const trackTop = track.getBoundingClientRect().top + window.scrollY;
      const marker = window.scrollY + viewport * 0.34;
      const travelled = Math.min(Math.max((marker - trackTop) / Math.max(track.offsetHeight, 1), 0), 1);
      setProgress(travelled);
      let next = ids[0];
      let nearest = Number.POSITIVE_INFINITY;
      ids.forEach((id) => {
        const rect = refs.current[id]?.getBoundingClientRect();
        if (!rect) return;
        const distance = Math.abs(rect.top - viewport * 0.34);
        if (distance < nearest) {
          nearest = distance;
          next = id;
        }
      });
      setActive(next);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ids]);

  return { refs, trackRef, active, progress, metrics };
}

function Deck({ size = 1, spin = false }: { size?: number; spin?: boolean }) {
  return (
    <div className={spin ? "deck-mark deck-spin" : "deck-mark"} style={{ width: 96 * size, height: 52 * size }} aria-hidden>
      <svg viewBox="0 0 190 100" width={96 * size} height={52 * size}>
        <g transform="translate(95 46) rotate(-6)">
          <path d="M-70-9 C-65-16-56-18-47-18 H47 C56-18 65-16 70-9 L66 6 C62 12 55 14 47 14 H-47 C-55 14-62 12-66 6Z" fill={T.ink} />
          <path d="M-52-13 H52" stroke={T.acid} strokeWidth="6" strokeLinecap="round" />
          <path d="M-46 15v12M46 15v12" stroke={T.ink} strokeWidth="6" />
          <rect x="-58" y="25" width="26" height="6" rx="3" fill={T.flame} />
          <rect x="32" y="25" width="26" height="6" rx="3" fill={T.flame} />
          <circle cx="-46" cy="37" r="10" fill={T.paper} stroke={T.ink} strokeWidth="4" />
          <circle cx="46" cy="37" r="10" fill={T.paper} stroke={T.ink} strokeWidth="4" />
          <circle cx="-46" cy="37" r="3" fill={T.flame} />
          <circle cx="46" cy="37" r="3" fill={T.flame} />
        </g>
      </svg>
    </div>
  );
}

function Cone() {
  return (
    <svg viewBox="0 0 60 66" width="46" height="50">
      <path d="M30 8 L47 54 H13 Z" fill={T.flame} stroke={T.ink} strokeWidth="4" strokeLinejoin="round" />
      <path d="M21 36h18" stroke={T.white} strokeWidth="7" />
      <rect x="7" y="52" width="46" height="9" rx="4" fill={T.ink} />
    </svg>
  );
}

function Funbox() {
  return (
    <svg viewBox="0 0 130 84" width="110" height="72">
      <polygon points="18,28 100,28 114,12 32,12" fill={T.acid} stroke={T.ink} strokeWidth="4" strokeLinejoin="round" />
      <polygon points="100,28 114,12 114,46 100,62" fill={T.ink} />
      <rect x="18" y="28" width="82" height="34" fill={T.white} stroke={T.ink} strokeWidth="4" />
    </svg>
  );
}

function Obstacle({ kind }: { kind: "quarterpipe" | "rail" | "bowl" }) {
  if (kind === "quarterpipe") {
    return (
      <svg viewBox="0 0 180 130" className="obs-svg">
        <path d="M14 112 H150 V20 C150 74 118 104 46 112 Z" transform="translate(13,-11)" fill={T.acid} stroke={T.ink} strokeWidth="4" strokeLinejoin="round" />
        <path d="M14 112 H150 V20 C150 74 118 104 46 112 Z" fill={T.cream} stroke={T.ink} strokeWidth="4" strokeLinejoin="round" />
        <rect x="134" y="12" width="30" height="10" rx="4" transform="rotate(-6 149 17)" fill={T.flame} stroke={T.ink} strokeWidth="3.5" />
      </svg>
    );
  }
  if (kind === "rail") {
    return (
      <svg viewBox="0 0 180 120" className="obs-svg">
        <ellipse cx="90" cy="104" rx="64" ry="9" fill={T.ink} opacity="0.14" />
        <rect x="22" y="34" width="132" height="13" rx="6.5" transform="translate(9,-8)" fill={T.acid} stroke={T.ink} strokeWidth="4" />
        <rect x="54" y="42" width="9" height="60" fill={T.ink} />
        <rect x="118" y="42" width="9" height="60" fill={T.ink} />
        <rect x="22" y="34" width="132" height="13" rx="6.5" fill={T.flame} stroke={T.ink} strokeWidth="4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 180 126" className="obs-svg">
      <ellipse cx="90" cy="70" rx="76" ry="44" fill={T.navy} stroke={T.ink} strokeWidth="4" />
      <ellipse cx="90" cy="60" rx="76" ry="44" fill={T.white} stroke={T.ink} strokeWidth="4" />
      <ellipse cx="90" cy="60" rx="48" ry="26" fill={T.cream} stroke={T.ink} strokeWidth="3.5" />
      <ellipse cx="90" cy="60" rx="19" ry="10" fill={T.sky} stroke={T.ink} strokeWidth="3" />
    </svg>
  );
}

function Skyline() {
  return (
    <svg viewBox="0 0 800 120" preserveAspectRatio="xMidYMax slice" width="100%" height="100%">
      <g fill="currentColor">
        <rect x="0" y="72" width="46" height="48" />
        <rect x="58" y="46" width="34" height="74" />
        <rect x="102" y="80" width="52" height="40" />
        <rect x="166" y="30" width="26" height="90" />
        <rect x="202" y="62" width="44" height="58" />
        <rect x="258" y="88" width="60" height="32" />
        <rect x="330" y="52" width="36" height="68" />
        <rect x="376" y="76" width="48" height="44" />
        <rect x="700" y="58" width="40" height="62" />
        <rect x="752" y="82" width="48" height="38" />
      </g>
      <g stroke="currentColor" strokeWidth="5" fill="none">
        <circle cx="560" cy="62" r="42" />
        <path d="M560 20v84M518 62h84M531 33l58 58M589 33l-58 58" strokeWidth="3" />
        <path d="M536 104l-10 16M584 104l10 16" />
      </g>
    </svg>
  );
}

function SectionLead({ spot, eyebrow }: { spot: (typeof SPOTS)[number]; eyebrow: string }) {
  const Icon = spot.icon;
  return (
    <div className="section-lead">
      <div className="section-kicker">{eyebrow}</div>
      <div className="section-title-row">
        <span className="section-number">{spot.number}</span>
        <div>
          <p className="section-label">{spot.label}</p>
          <h2>{spot.title}</h2>
        </div>
        <Icon className="section-icon" size={26} strokeWidth={2} />
      </div>
    </div>
  );
}

function BuildDeck({ build, open, onClick }: { build: (typeof BUILDS)[number]; open: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`build-deck ${open ? "build-deck-open" : ""}`}>
      <span className="build-deck-strip" />
      <span className="build-deck-top">
        <span>{build.tag}</span>
        <ArrowUpRight size={16} />
      </span>
      <strong>{build.name}</strong>
      <span className="build-deck-text">{build.text}</span>
      <span className="build-deck-action">{open ? "close" : "tap to read"}</span>
    </button>
  );
}

const DECALS: { t: number; side: -1 | 1; kind: "cone" | "funbox" }[] = [
  { t: 0.14, side: -1, kind: "cone" },
  { t: 0.33, side: 1, kind: "cone" },
  { t: 0.52, side: -1, kind: "cone" },
  { t: 0.71, side: 1, kind: "funbox" },
  { t: 0.86, side: -1, kind: "cone" },
];

export default function Lab() {
  const now = useLondonTime();
  const { refs, trackRef, active, progress, metrics } = useJourney(SPOT_IDS);
  const [openBuild, setOpenBuild] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [trick, setTrick] = useState(0);
  const [tricking, setTricking] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const activeIndex = Math.max(SPOTS.findIndex((spot) => spot.id === active), 0);
  const prevIndex = useRef<number | null>(null);

  useEffect(() => {
    const startRide = () => setStarted(true);
    window.addEventListener("scroll", startRide, { passive: true, once: true });
    return () => window.removeEventListener("scroll", startRide);
  }, []);

  useEffect(() => {
    if (prevIndex.current === null) {
      prevIndex.current = activeIndex;
      return;
    }
    if (activeIndex !== prevIndex.current) {
      prevIndex.current = activeIndex;
      if (started) setTrick((k) => k + 1);
    }
  }, [activeIndex, started]);

  useEffect(() => {
    if (started) setTrick((k) => k + 1);
  }, [started]);

  useEffect(() => {
    if (trick === 0) return;
    setTricking(true);
    const timer = window.setTimeout(() => setTricking(false), 680);
    return () => window.clearTimeout(timer);
  }, [trick]);

  const jumpTo = (id: string) => {
    refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
    setStarted(true);
  };

  const road = useMemo(
    () => (metrics.w > 0 ? buildRoad(metrics.w, metrics.h, metrics.spots.map((s) => s.tm)) : null),
    [metrics]
  );

  const boardT = 0.016 + progress * (0.984 - 0.016);
  const boardX = metrics.w > 0 ? roadX(boardT, metrics.w) : 0;
  const boardY = boardT * metrics.h;
  const boardCarve = metrics.w > 0 ? carveAt(boardT, metrics.w, metrics.h) : 0;
  const boardDepth = depthAt(boardT);

  return (
    <main className="a6-page">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes a6Fade { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes a6Spin { 0% { transform: rotate(0); } 100% { transform: rotate(360deg); } }
        @keyframes a6Pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,61,26,.3); } 50% { box-shadow: 0 0 0 9px rgba(255,61,26,0); } }
        @keyframes boardBob { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-6px) rotate(2deg); } }
        @keyframes trickFlip { 0% { transform: rotate(0) translateY(0); } 42% { transform: rotate(180deg) translateY(-18px); } 100% { transform: rotate(360deg) translateY(0); } }
        @keyframes markerPop { 0% { transform: scale(.8); } 55% { transform: scale(1.09); } 100% { transform: scale(1); } }
        @keyframes cloudDrift { from { left: -140px; } to { left: calc(100% + 140px); } }
        .a6-page { min-height: 100vh; background: ${T.paper}; color: ${T.ink}; overflow-x: hidden; font-family: ui-sans-serif, Inter, system-ui, -apple-system, sans-serif; }
        .a6-page * { box-sizing: border-box; }
        .a6-page::before { content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: .07; background-image: radial-gradient(${T.ink} 1px, transparent 1px); background-size: 5px 5px; }
        .a6-shell { position: relative; z-index: 1; max-width: 980px; margin: 0 auto; padding: 0 28px; }
        .a6-nav { display:flex; justify-content:space-between; align-items:center; padding:24px 0; font:800 11px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.14em; text-transform:uppercase; color:${T.muted}; border-bottom: 3px solid ${T.ink}; }
        .a6-nav a { color:inherit; text-decoration:none; }
        .a6-nav a:hover { color:${T.flame}; }
        .a6-nav .nav-brand { display:flex; align-items:center; gap:9px; color:${T.ink}; }
        .a6-nav .nav-brand i { width:9px; height:9px; border-radius:50%; background:${T.flame}; animation:a6Pulse 1.8s ease infinite; }
        .a6-nav .nav-links { display:flex; align-items:center; gap:20px; }
        .hero { padding:52px 0 64px; animation:a6Fade .7s ease both; }
        .hero-grid { display:grid; grid-template-columns:1.25fr 1fr; gap:44px; align-items:center; }
        .now-pill { display:inline-flex; align-items:center; gap:9px; border:3px solid ${T.ink}; border-radius:999px; background:${T.white}; padding:8px 15px; box-shadow:4px 4px 0 ${T.ink}; font:800 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.08em; text-transform:uppercase; }
        .now-pill i { width:7px; height:7px; border-radius:50%; background:${T.flame}; animation:a6Pulse 1.8s ease infinite; }
        .now-pill em { font-style:normal; font-weight:600; letter-spacing:0; text-transform:none; color:${T.ink}; }
        .hero-copy h1 { margin:20px 0 0; font:900 clamp(48px,8vw,84px)/.92 ui-sans-serif, Inter, system-ui, sans-serif; letter-spacing:-.035em; text-transform:uppercase; }
        .hero-role { margin:12px 0 0; font:700 17px/1.4 ui-sans-serif, Inter, sans-serif; color:${T.flame}; text-transform:uppercase; letter-spacing:.02em; }
        .hero-summary { max-width:520px; margin:18px 0 0; font:16px/1.6 ui-sans-serif, Inter, sans-serif; color:#232019; }
        .hero-summary strong { color:${T.ink}; background:linear-gradient(180deg, transparent 62%, ${T.acid} 62%); padding:0 1px; }
        .hero-cta-row { display:flex; gap:12px; margin-top:30px; flex-wrap:wrap; }
        .drop-in { display:inline-flex; align-items:center; gap:9px; border:3px solid ${T.ink}; border-radius:999px; padding:12px 19px; background:${T.ink}; color:${T.paper}; box-shadow:5px 5px 0 ${T.flame}; font:800 11px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.1em; text-transform:uppercase; cursor:pointer; transition:transform .15s, box-shadow .15s; text-decoration:none; }
        .drop-in:hover { transform:translate(-2px,-2px); box-shadow:7px 7px 0 ${T.flame}; }
        .drop-in-ghost { background:transparent; color:${T.ink}; box-shadow:5px 5px 0 ${T.ink}; }
        .drop-in-ghost:hover { box-shadow:7px 7px 0 ${T.ink}; }
        .hero-stamps { display:flex; flex-wrap:wrap; gap:8px; margin-top:26px; }
        .hero-stamps span { border:2px solid ${T.ink}; border-radius:999px; padding:6px 9px; background:${T.white}; box-shadow:2px 2px 0 ${T.ink}; font:800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.08em; text-transform:uppercase; }
        .hero-stamps span:nth-child(2) { background:${T.acid}; }
        .hero-stamps span:nth-child(3) { background:${T.flame}; color:${T.white}; }
        .hero-stamps span:nth-child(4) { background:${T.navy}; color:${T.white}; }
        .journey-map { display:flex; align-items:center; gap:8px; margin-top:14px; }
        .journey-map-label { margin-right:3px; font:800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.12em; text-transform:uppercase; color:${T.muted}; }
        .journey-map i { display:block; width:9px; height:9px; border:2px solid ${T.ink}; border-radius:50%; background:${T.flame}; }
        .journey-map i:nth-of-type(2) { background:${T.acid}; }
        .journey-map i:nth-of-type(3) { background:${T.white}; }
        .journey-map b { width:22px; height:2px; background:${T.ink}; opacity:.45; }
        .hero-portrait { position:relative; display:flex; justify-content:center; perspective:1000px; }
        .player-card { position:relative; width:100%; max-width:330px; background:${T.white}; border:4px solid ${T.ink}; border-radius:24px; box-shadow:10px 10px 0 ${T.flame}; transform:rotate(1.5deg); transition:transform .18s ease; }
        .player-card-head { display:flex; align-items:center; gap:8px; background:${T.ink}; color:${T.paper}; padding:9px 14px; border-radius:18px 18px 0 0; font:800 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.14em; text-transform:uppercase; }
        .player-card-head em { margin-left:auto; font-style:normal; color:${T.acid}; }
        .player-body { padding:14px 14px 13px; }
        .player-photo { position:relative; border:3px solid ${T.ink}; border-radius:16px; overflow:hidden; background:${T.ink}; }
        .player-photo img { display:block; width:100%; aspect-ratio:4/5; object-fit:cover; filter:grayscale(.08) contrast(1.05); }
        .portrait-tag { position:absolute; left:12px; bottom:12px; display:inline-flex; align-items:center; border:3px solid ${T.ink}; border-radius:999px; background:${T.acid}; padding:5px 11px; font:800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.1em; text-transform:uppercase; color:${T.ink}; box-shadow:3px 3px 0 ${T.ink}; }
        .player-rows { margin-top:13px; display:grid; gap:7px; }
        .player-rows .pr { display:flex; justify-content:space-between; gap:12px; font:800 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.08em; text-transform:uppercase; }
        .player-rows .pr b { color:${T.muted}; font-weight:800; }
        .player-rows .pr span { color:${T.ink}; text-align:right; }
        .hero-route-note { position:absolute; left:-40px; bottom:20px; width:122px; padding:10px 11px; border:3px solid ${T.ink}; background:${T.white}; box-shadow:4px 4px 0 ${T.ink}; transform:rotate(-6deg); font:800 9px/1.35 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.05em; text-transform:uppercase; z-index:2; }
        .hero-route-note b { display:block; margin-bottom:6px; color:${T.flame}; }
        .hero-route-note span { display:block; color:${T.muted}; }
        .portrait-deck { position:absolute; right:-30px; bottom:-22px; transform:rotate(-14deg); z-index:2; }
        .deck-spin { animation:a6Spin .8s ease .05s both; }
        .journey-intro { display:flex; justify-content:space-between; align-items:flex-end; gap:22px; flex-wrap:wrap; padding:36px 0 30px; border-top:3px solid ${T.ink}; }
        .journey-intro h2 { margin:7px 0 0; font:900 clamp(26px,4vw,38px)/1.02 ui-sans-serif, Inter, sans-serif; letter-spacing:-.03em; text-transform:uppercase; }
        .journey-intro > p { max-width:300px; margin:0; font:14px/1.55 ui-sans-serif, Inter, sans-serif; color:${T.muted}; }
        .journey-track { position:relative; }
        .map-layer { position:absolute; inset:0; z-index:0; overflow:hidden; pointer-events:none; background-image: linear-gradient(rgba(14,14,14,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(14,14,14,.08) 1px, transparent 1px); background-size:44px 44px; -webkit-mask-image:linear-gradient(90deg, #000 0%, #000 250px, transparent 380px); mask-image:linear-gradient(90deg, #000 0%, #000 250px, transparent 380px); }
        .skyline { position:absolute; left:0; right:0; top:0; height:118px; color:${T.ink}; opacity:.13; }
        .map-sun { position:absolute; top:30px; right:7%; width:66px; height:66px; border-radius:50%; background:${T.acid}; border:3px solid ${T.ink}; }
        .cloud { position:absolute; width:92px; height:26px; background:${T.white}; border:3px solid ${T.ink}; border-radius:999px; animation:cloudDrift 85s linear infinite; }
        .cloud::before { content:""; position:absolute; left:16px; top:-14px; width:34px; height:24px; background:${T.white}; border:3px solid ${T.ink}; border-bottom:0; border-radius:20px 20px 0 0; }
        .cloud.c1 { top:34px; animation-duration:95s; }
        .cloud.c2 { top:104px; width:64px; animation-duration:70s; animation-delay:-30s; }
        .cloud.c3 { top:168px; width:76px; animation-duration:115s; animation-delay:-70s; }
        .road-svg { position:absolute; left:0; top:0; display:block; }
        .decal { position:absolute; transform:translate(-50%,-100%); }
        .decal > div { transform-origin:50% 100%; }
        .spot-marker { position:absolute; z-index:1; transform:translate(-50%,-100%); }
        .spot-scale { transform-origin:50% 100%; }
        .spot-flag { display:flex; align-items:flex-end; gap:6px; margin-bottom:7px; }
        .spot-flag i { display:block; width:3px; height:26px; background:${T.ink}; }
        .spot-flag b { border:2px solid ${T.ink}; border-radius:6px; background:${T.white}; padding:3px 7px; font:800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.1em; box-shadow:2px 2px 0 ${T.ink}; }
        .spot-marker.lit .spot-flag b { background:${T.acid}; }
        .landed { display:inline-block; margin-left:2px; padding:3px 7px; border:2px solid ${T.ink}; border-radius:6px; background:${T.ink}; color:${T.paper}; font:800 8px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.1em; text-transform:uppercase; opacity:0; transform:translateY(6px) rotate(-4deg); transition:opacity .25s, transform .25s; }
        .spot-marker.lit .landed { opacity:1; transform:rotate(-4deg); }
        .spot-marker.lit .obs-pop { animation:markerPop .5s ease; }
        .obs-svg { display:block; width:150px; height:auto; filter:drop-shadow(4px 6px 0 rgba(14,14,14,.16)); }
        .board-anchor { position:absolute; z-index:3; transform:translate(-50%,-86%); pointer-events:none; will-change:left,top; }
        .board-rotate { position:relative; transform-origin:50% 60%; }
        .board-body { display:block; animation:boardBob 1.7s ease-in-out infinite; }
        .board-rotate.tricking .board-body { animation:trickFlip .62s cubic-bezier(.3,.7,.4,1) both; }
        .board-shadow { position:absolute; left:50%; bottom:-3px; width:88px; height:16px; border-radius:50%; background:${T.ink}; opacity:.16; transform:translateX(-50%); transition:transform .3s, opacity .3s; }
        .board-rotate.tricking .board-shadow { transform:translateX(-50%) scale(.55); opacity:.1; }
        .hud { position:fixed; left:18px; bottom:18px; z-index:50; display:flex; align-items:center; gap:11px; padding:9px 13px; border:3px solid ${T.ink}; border-radius:999px; background:${T.white}; box-shadow:4px 4px 0 ${T.ink}; font:800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.1em; text-transform:uppercase; opacity:0; transform:translateY(12px); transition:opacity .3s, transform .3s; pointer-events:none; }
        .hud.hud-on { opacity:1; transform:none; }
        .hud .hud-dot { width:7px; height:7px; border-radius:50%; background:${T.flame}; animation:a6Pulse 1.8s ease infinite; }
        .hud-bar { width:104px; height:8px; border:2px solid ${T.ink}; border-radius:999px; overflow:hidden; background:${T.paper}; }
        .hud-bar i { display:block; height:100%; background:${T.acid}; }
        .scene { position:relative; z-index:1; min-height:600px; padding:50px 0 84px 290px; scroll-margin-top:100px; }
        .scene + .scene { border-top:3px dashed rgba(14,14,14,.3); }
        .section-lead { margin-bottom:30px; }
        .section-kicker { font:800 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.18em; text-transform:uppercase; color:${T.flame}; }
        .section-title-row { display:flex; align-items:center; gap:15px; margin-top:9px; }
        .section-number { display:flex; align-items:center; justify-content:center; width:44px; height:44px; flex:none; border:3px solid ${T.ink}; border-radius:50%; background:${T.acid}; box-shadow:3px 3px 0 ${T.ink}; font:800 14px ui-monospace, SFMono-Regular, Menlo, monospace; }
        .section-label { margin:0 0 2px; font:800 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.14em; text-transform:uppercase; color:${T.muted}; }
        .section-title-row h2 { margin:0; font:900 clamp(28px,4.5vw,44px)/1.02 ui-sans-serif, Inter, sans-serif; letter-spacing:-.03em; text-transform:uppercase; }
        .section-icon { margin-left:auto; color:${T.ink}; }
        .scene-copy { max-width:620px; font:16px/1.65 ui-sans-serif, Inter, sans-serif; color:#232019; }
        .scene-copy strong { color:${T.ink}; }
        .work-list { margin-top:38px; border-top:3px solid ${T.ink}; }
        .work-row { display:grid; grid-template-columns:22px 1.1fr .7fr 1.6fr; gap:14px; padding:16px 0; border-bottom:2px solid rgba(14,14,14,.16); align-items:start; }
        .work-row .bolt { width:14px; height:14px; margin-top:6px; border-radius:50%; border:3px solid ${T.ink}; background:${T.paper}; }
        .work-row strong { font:800 17px ui-sans-serif, Inter, sans-serif; }
        .work-row .role { font:800 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.08em; text-transform:uppercase; color:${T.flame}; }
        .work-row time { font:10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.08em; text-transform:uppercase; color:${T.muted}; }
        .work-row p { margin:0; font:14px/1.5 ui-sans-serif, Inter, sans-serif; color:#232019; }
        .through-line { margin-top:32px; padding:15px 0 15px 18px; border-left:6px solid ${T.flame}; font:600 16px/1.5 ui-sans-serif, Inter, sans-serif; color:${T.ink}; }
        .build-intro { max-width:560px; margin-bottom:26px; font:16px/1.6 ui-sans-serif, Inter, sans-serif; color:#232019; }
        .build-field { display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:18px; }
        .build-deck { position:relative; min-height:172px; padding:19px 17px 15px; border:3px solid ${T.ink}; border-radius:20px; background:${T.white}; box-shadow:5px 5px 0 ${T.ink}; text-align:left; cursor:pointer; transition:transform .15s, box-shadow .15s; overflow:hidden; }
        .build-deck-strip { position:absolute; left:0; top:0; right:0; height:9px; background:${T.flame}; }
        .build-deck:nth-child(3n+2) .build-deck-strip { background:${T.acid}; }
        .build-deck:nth-child(3n) .build-deck-strip { background:${T.ink}; }
        .build-deck:hover, .build-deck-open { transform:translateY(-4px); box-shadow:8px 8px 0 ${T.ink}; }
        .build-deck-top { display:flex; justify-content:space-between; gap:12px; margin-top:6px; font:800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.09em; text-transform:uppercase; color:${T.muted}; }
        .build-deck strong { display:block; margin-top:20px; font:800 22px ui-sans-serif, Inter, sans-serif; letter-spacing:-.01em; }
        .build-deck-text { display:block; margin-top:8px; font:14px/1.45 ui-sans-serif, Inter, sans-serif; color:#232019; }
        .build-deck-action { display:block; margin-top:14px; font:800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.12em; text-transform:uppercase; color:${T.flame}; }
        .outside-grid { display:grid; grid-template-columns:1.05fr .95fr; gap:30px; align-items:start; }
        .outside-note { padding:20px 0; border-top:3px solid ${T.ink}; border-bottom:3px solid ${T.ink}; font:16px/1.65 ui-sans-serif, Inter, sans-serif; color:#232019; }
        .outside-note p { margin:0 0 16px; }
        .outside-note p:last-child { margin-bottom:0; }
        .interest-stack { display:flex; flex-wrap:wrap; gap:9px; }
        .interest { display:inline-flex; align-items:center; gap:8px; border:3px solid ${T.ink}; border-radius:999px; padding:9px 13px; background:${T.white}; box-shadow:3px 3px 0 ${T.ink}; font:800 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.06em; text-transform:uppercase; transform:rotate(-1.5deg); }
        .interest:nth-child(2) { background:${T.acid}; transform:rotate(1deg); }
        .interest:nth-child(3) { background:${T.flame}; color:${T.white}; transform:rotate(-1deg); }
        .interest:nth-child(4) { transform:rotate(1.5deg); }
        .language-line { margin-top:28px; font:800 11px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.08em; text-transform:uppercase; color:${T.muted}; }
        .end-sign { margin:42px 0 0; padding:26px 0; border-top:3px solid ${T.ink}; text-align:center; }
        .end-sign h2 { margin:5px 0 13px; font:900 34px ui-sans-serif, Inter, sans-serif; letter-spacing:-.03em; text-transform:uppercase; }
        .end-sign p { margin:0 auto; max-width:420px; font:15px/1.5 ui-sans-serif, Inter, sans-serif; color:${T.muted}; }
        .contact-row { display:flex; justify-content:center; gap:12px; margin-top:22px; }
        .contact-row a { display:inline-flex; align-items:center; gap:8px; border:3px solid ${T.ink}; border-radius:999px; padding:11px 17px; text-decoration:none; box-shadow:3px 3px 0 ${T.ink}; font:800 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.09em; text-transform:uppercase; }
        .contact-row a:first-child { background:${T.flame}; color:${T.white}; }
        .contact-row a:last-child { background:${T.ink}; color:${T.paper}; }
        .a6-footer { padding:22px 0 36px; border-top:3px solid ${T.ink}; display:flex; justify-content:space-between; align-items:center; font:800 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.1em; text-transform:uppercase; color:${T.muted}; }
        @media (max-width:760px) {
          .a6-shell { padding:0 18px; }
          .hero-grid { grid-template-columns:1fr; gap:36px; }
          .hero-portrait { order:-1; }
          .player-card { max-width:250px; }
          .portrait-deck { right:-12px; bottom:-16px; transform:rotate(-14deg) scale(.75); }
          .hero-route-note { left:0; }
          .map-layer { -webkit-mask-image:linear-gradient(90deg, #000 0%, #000 46px, transparent 118px); mask-image:linear-gradient(90deg, #000 0%, #000 46px, transparent 118px); background-size:34px 34px; }
          .skyline { height:78px; }
          .map-sun { width:46px; height:46px; right:5%; }
          .cloud { transform:scale(.7); }
          .obs-svg { width:92px; }
          .spot-flag { transform:scale(.82); transform-origin:left bottom; margin-bottom:4px; }
          .landed { display:none; }
          .scene { min-height:560px; padding-left:80px; }
          .build-field { grid-template-columns:1fr; }
          .outside-grid { grid-template-columns:1fr; gap:26px; }
          .work-row { grid-template-columns:16px 1fr; gap:8px; }
          .work-row time { order:3; }
          .work-row p { order:4; }
          .a6-nav .nav-links { gap:10px; }
          .a6-nav .nav-links a:nth-child(2) { display:none; }
          .a6-nav .nav-links a:nth-child(3) { display:none; }
          .hud { left:10px; bottom:10px; padding:8px 11px; gap:8px; }
          .hud-bar { width:58px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .board-body, .board-rotate.tricking .board-body, .cloud, .deck-spin, .spot-marker.lit .obs-pop { animation:none !important; }
        }
      `}} />

      <div className="a6-shell">
        <nav className="a6-nav">
          <a href="/" className="nav-brand"><i />nicole jiang</a>
          <span>the skatepark · park map</span>
          <div className="nav-links"><a href="#background">background ↗</a><a href="#builds">builds ↗</a><a href="#outside">outside ↗</a></div>
        </nav>

        <section className="hero">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="now-pill"><i /><b>right now</b><em>· building the BeSci Engine at algo1 · {now} London</em></div>
              <h1>Nicole Jiang.</h1>
              <p className="hero-role">Behavioural scientist. AI product builder. London.</p>
              <p className="hero-summary">I work where <strong>human behavior meets what we build.</strong> I diagnose why people act as they do, find the pattern, decide what is worth making, and shape it so it feels good to use.</p>
              <div className="hero-cta-row">
                <button className="drop-in" onClick={() => jumpTo("background")}><ArrowDown size={16} /> drop in</button>
                <a className="drop-in drop-in-ghost" href="https://www.linkedin.com/in/nicole-jiang-567054201/" target="_blank" rel="noreferrer">linkedin <ArrowUpRight size={15} /></a>
              </div>
              <div className="hero-stamps"><span>behaviour</span><span>product</span><span>AI</span><span>hardware</span></div>
            </div>
            <div
              className="hero-portrait"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const dx = (e.clientX - rect.left) / rect.width - 0.5;
                const dy = (e.clientY - rect.top) / rect.height - 0.5;
                setTilt({ x: dy * -6, y: dx * 8 });
              }}
              onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            >
              <div className="player-card" style={{ transform: `rotate(1.5deg) perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
                <div className="player-card-head"><Gamepad2 size={13} /> player card <em>NJ-01</em></div>
                <div className="player-body">
                  <div className="player-photo">
                    <img src="/images/nicole-portrait.png" alt="Nicole Jiang" />
                    <span className="portrait-tag">nicole · london</span>
                  </div>
                  <div className="player-rows">
                    {PLAYER_ROWS.map(([k, v]) => <div className="pr" key={k}><b>{k}</b><span>{v}</span></div>)}
                  </div>
                </div>
              </div>
              <div className="hero-route-note"><b>ride log / 01</b><span>smart ideas</span><span>shipped fast</span><span>with feeling</span></div>
              <div className="portrait-deck"><Deck size={1.05} spin={started} /></div>
            </div>
          </div>
        </section>

        <section className="journey-intro">
          <div>
            <p className="section-kicker">the ride</p>
            <h2>Three spots. One line.</h2>
          </div>
          <p>Scroll to move the board. Each spot gives you a different view of the person behind the work.</p>
          <div className="journey-map" aria-label="Three skatepark spots"><span className="journey-map-label">park map</span><i /><b /><i /><b /><i /></div>
        </section>

        <div className="journey-track" ref={trackRef}>
          {metrics.w > 0 && road && (
            <div className="map-layer" aria-hidden="true">
              <div className="skyline"><Skyline /></div>
              <div className="map-sun" />
              <div className="cloud c1" />
              <div className="cloud c2" />
              <div className="cloud c3" />
              <svg className="road-svg" width={metrics.w} height={metrics.h} viewBox={`0 0 ${metrics.w} ${metrics.h}`}>
                <polygon points={road.outer} fill={T.ink} />
                <polygon points={road.inner} fill={T.white} />
                {[road.start, road.finish].map((ln, i) => (
                  <g key={i} transform={`rotate(${ln.rot} ${ln.cx} ${ln.cy})`}>
                    {ln.squares.map((sq, k) => (
                      <rect key={k} x={sq.x - sq.size / 2} y={sq.y - sq.size / 2} width={sq.size} height={sq.size} fill={sq.dark ? T.ink : T.white} stroke={T.ink} strokeWidth="1.5" />
                    ))}
                  </g>
                ))}
                {road.dashes.map((d, i) => (
                  <rect key={i} x={-2.5 * d.d} y={-13 * d.d} width={5 * d.d} height={26 * d.d} rx={2.5 * d.d} fill={T.acid} transform={`translate(${d.x} ${d.y}) rotate(${d.rot})`} />
                ))}
              </svg>
              {DECALS.map((decal, i) => {
                if (decal.kind === "funbox" && metrics.w < 700) return null;
                const x = roadX(decal.t, metrics.w) + decal.side * (metrics.w < 700 ? 34 : 108);
                const y = decal.t * metrics.h;
                return (
                  <div className="decal" key={i} style={{ left: x, top: y }}>
                    <div style={{ transform: `scale(${depthAt(decal.t)})` }}>{decal.kind === "cone" ? <Cone /> : <Funbox />}</div>
                  </div>
                );
              })}
              {metrics.spots.map((spot, i) => {
                const kind = i === 0 ? "quarterpipe" : i === 1 ? "rail" : "bowl";
                const x = roadX(spot.tm, metrics.w);
                const y = spot.tm * metrics.h;
                const lit = progress > spot.tm + 0.005;
                return (
                  <div className={`spot-marker ${lit ? "lit" : ""}`} key={spot.id} style={{ left: x, top: y }}>
                    <div className="spot-scale" style={{ transform: `scale(${depthAt(spot.tm)})` }}>
                      <div className="obs-pop">
                        <div className="spot-flag"><i /><b>{SPOTS[i].number}</b><span className="landed">landed</span></div>
                        <Obstacle kind={kind} />
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="board-anchor" style={{ left: boardX, top: boardY }}>
                <div key={trick} className={`board-rotate ${tricking ? "tricking" : ""}`} style={{ transform: `rotate(${90 + boardCarve}deg) scale(${boardDepth})` }}>
                  <span className="board-shadow" />
                  <span className="board-body"><Deck size={1} /></span>
                </div>
              </div>
            </div>
          )}

          <section ref={(el) => { refs.current.background = el; }} className="scene" id="background">
            <SectionLead spot={SPOTS[0]} eyebrow="start here · the first push" />
            <div className="scene-copy"><p>I'm a behavioural scientist at <strong>algo1</strong>, an AI startup in London building hyperpersonalized shopping for grocery retail. My job is to work out why people do what they do, design the product that shifts it, then prove whether it worked.</p><p>I came in through psychology, not code. Two degrees in how people think, followed by years spent using it to build real things. The interesting problem is always human before it is technical.</p></div>
            <div className="work-list">{ROLES.map((role) => <div className="work-row" key={role.org}><span className="bolt" /><div><strong>{role.org}</strong><div className="role">{role.role}</div></div><time>{role.when}</time><p>{role.note}</p></div>)}</div>
            <div className="through-line"><strong>The through-line:</strong> every product problem is a behavior problem first.</div>
            <button className="drop-in" onClick={() => jumpTo("builds")}><ArrowDown size={16} /> next spot · what I build</button>
          </section>

          <section ref={(el) => { refs.current.builds = el; }} className="scene" id="builds">
            <SectionLead spot={SPOTS[1]} eyebrow="keep rolling · the things I ship" />
            <p className="build-intro">Most of these were built in a weekend, a few in five hours. Different domains, one instinct: find a real person with a real problem, then build the smallest thing that removes it.</p>
            <div className="build-field">{BUILDS.map((build) => <BuildDeck key={build.name} build={build} open={openBuild === build.name} onClick={() => setOpenBuild(openBuild === build.name ? null : build.name)} />)}</div>
            <button className="drop-in" onClick={() => jumpTo("outside")}><ArrowDown size={16} /> next spot · beyond the screen</button>
          </section>

          <section ref={(el) => { refs.current.outside = el; }} className="scene" id="outside">
            <SectionLead spot={SPOTS[2]} eyebrow="last spot · what pulls me forward" />
            <div className="outside-grid">
              <div className="outside-note"><p>Lately I keep ending up in hardware. I clipped my first AI device to a cap at a build sprint and have not stopped since: Raspberry Pis, 3D printers, soldering my first board. After years of pixels, working with atoms is the most fun I have had in a while.</p><p>My evenings go to neuro and AI nights. Neural interfaces, whole-brain emulation, how minds fail and change. Watching how the brain actually works keeps reshaping how I think about why people are irrational.</p><p>Where I'm heading: human and AI interaction that people actually feel safe adopting, and eventually, a company of my own.</p></div>
              <div><div className="interest-stack"><span className="interest"><Wrench size={15} /> physical AI</span><span className="interest"><Brain size={15} /> neurotech</span><span className="interest"><Camera size={15} /> visual thinking</span><span className="interest"><Target size={15} /> founder path</span></div><p className="language-line">中文 · native &nbsp; English · fluent &nbsp; 日本語 · conversational</p></div>
            </div>
            <div className="end-sign"><p className="section-kicker">session complete</p><h2>Keep in touch?</h2><p>Life is a game. Try your best, enjoy the ride. The next build is always somewhere around the corner.</p><div className="contact-row"><a href="mailto:nicolejiang2324@gmail.com"><Mail size={15} /> email me</a><a href="https://www.linkedin.com/in/nicole-jiang-567054201/" target="_blank" rel="noreferrer"><ArrowUpRight size={15} /> linkedin</a></div></div>
          </section>
        </div>

        <footer className="a6-footer"><span>nicole jiang · skatepark v3.0</span><span>london · 2026</span></footer>
      </div>

      <div className={`hud ${started ? "hud-on" : ""}`} aria-hidden="true">
        <span className="hud-dot" />
        <span>spot {SPOTS[activeIndex].number}/03 · {SPOTS[activeIndex].label}</span>
        <span className="hud-bar"><i style={{ width: `${Math.round(progress * 100)}%` }} /></span>
      </div>
    </main>
  );
}
