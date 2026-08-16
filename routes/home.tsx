import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Brain, Camera, Compass, Mail, Target, Wrench } from "lucide-react";

const T = {
  paper: "#F1ECE0",
  ink: "#0E0E0E",
  muted: "#6B6558",
  flame: "#FF3D1A",
  acid: "#D6FF3D",
  white: "#FFFDF7",
};

const SPOTS = [
  { id: "background", number: "01", label: "Quarterpipe", title: "How I got here", icon: Brain },
  { id: "builds", number: "02", label: "Rail", title: "What I build", icon: Wrench },
  { id: "outside", number: "03", label: "Bowl", title: "What pulls me forward", icon: Compass },
] as const;

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

function useRideProgress(ids: readonly string[]) {
  const refs = useRef<Record<string, HTMLElement | null>>({});
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState("");
  const [progress, setProgress] = useState(0);

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

  return { refs, trackRef, active, progress };
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

function SectionLead({ spot, eyebrow }: { spot: typeof SPOTS[number]; eyebrow: string }) {
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

function BuildDeck({ build, open, onClick }: { build: typeof BUILDS[number]; open: boolean; onClick: () => void }) {
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

export default function Home() {
  const now = useLondonTime();
  const { refs, trackRef, active, progress } = useRideProgress(SPOTS.map((spot) => spot.id));
  const [openBuild, setOpenBuild] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const activeIndex = Math.max(SPOTS.findIndex((spot) => spot.id === active), 0);

  useEffect(() => {
    const startRide = () => setStarted(true);
    window.addEventListener("scroll", startRide, { passive: true, once: true });
    return () => window.removeEventListener("scroll", startRide);
  }, []);

  const jumpTo = (id: string) => {
    refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
    setStarted(true);
  };

  return (
    <main className="a6-page">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes a6Fade { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes a6Bob { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-8px) rotate(3deg); } }
        @keyframes a6Spin { 0% { transform: rotate(0); } 100% { transform: rotate(360deg); } }
        @keyframes a6Pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,61,26,.3); } 50% { box-shadow: 0 0 0 9px rgba(255,61,26,0); } }
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
        .a6-nav .nav-links a { color:inherit; text-decoration:none; }
        .a6-nav .nav-links a:hover { color:${T.flame}; }
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
        .hero-note { margin-top:22px; font:800 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.14em; text-transform:uppercase; color:${T.muted}; }
        .hero-stamps { display:flex; flex-wrap:wrap; gap:8px; margin-top:15px; }
        .hero-stamps span { border:2px solid ${T.ink}; border-radius:999px; padding:6px 9px; background:${T.white}; box-shadow:2px 2px 0 ${T.ink}; font:800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.08em; text-transform:uppercase; }
        .hero-stamps span:nth-child(2) { background:${T.acid}; }
        .hero-stamps span:nth-child(3) { background:${T.flame}; color:${T.white}; }
        .journey-map { display:flex; align-items:center; gap:8px; margin-top:14px; }
        .journey-map-label { margin-right:3px; font:800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.12em; text-transform:uppercase; color:${T.muted}; }
        .journey-map i { display:block; width:9px; height:9px; border:2px solid ${T.ink}; border-radius:50%; background:${T.flame}; }
        .journey-map i:nth-of-type(2) { background:${T.acid}; }
        .journey-map i:nth-of-type(3) { background:${T.white}; }
        .journey-map b { width:22px; height:2px; background:${T.ink}; opacity:.45; }
        .lead-visual { display:flex; align-items:center; gap:12px; margin-left:auto; }
        .lead-visual .section-icon { margin-left:0; }
        .hero-portrait { position:relative; display:flex; justify-content:center; }
        .portrait-frame { position:relative; width:100%; max-width:300px; border:4px solid ${T.ink}; border-radius:26px; overflow:hidden; box-shadow:9px 9px 0 ${T.flame}; transform:rotate(2deg); background:${T.ink}; }
        .portrait-frame::after { content:"portfolio / 2026"; position:absolute; right:-42px; top:50%; transform:rotate(90deg); color:${T.white}; font:800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.16em; text-transform:uppercase; }
        .portrait-frame img { display:block; width:100%; aspect-ratio:4/5; object-fit:cover; filter:grayscale(.08) contrast(1.05); }
        .portrait-tag { position:absolute; left:14px; bottom:14px; display:inline-flex; align-items:center; border:3px solid ${T.ink}; border-radius:999px; background:${T.acid}; padding:6px 12px; font:800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.1em; text-transform:uppercase; color:${T.ink}; box-shadow:3px 3px 0 ${T.ink}; }
        .hero-route-note { position:absolute; left:-42px; bottom:16px; width:122px; padding:10px 11px; border:3px solid ${T.ink}; background:${T.white}; box-shadow:4px 4px 0 ${T.ink}; transform:rotate(-6deg); font:800 9px/1.35 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.05em; text-transform:uppercase; }
        .hero-route-note b { display:block; margin-bottom:6px; color:${T.flame}; }
        .hero-route-note span { display:block; color:${T.muted}; }
        .grip-divider { height:12px; margin:0 0 46px; border-top:3px solid ${T.ink}; border-bottom:3px solid ${T.ink}; background:repeating-linear-gradient(90deg, ${T.ink} 0 7px, transparent 7px 14px); opacity:.9; }
        .journey-intro { display:grid; grid-template-columns:auto 1fr; gap:10px 28px; align-items:end; padding-bottom:34px; }
        .journey-intro h2 { margin:9px 0 0; font:900 clamp(28px,4.5vw,44px)/1.02 ui-sans-serif, Inter, sans-serif; letter-spacing:-.03em; text-transform:uppercase; }
        .journey-intro p { margin:0; max-width:420px; font:15px/1.55 ui-sans-serif, Inter, sans-serif; color:#232019; }
        .journey-intro .journey-map { grid-column:1 / -1; }
        .deck-mark svg { display:block; animation:a6Bob 3.6s ease-in-out infinite; }
        .deck-spin { animation:a6Spin .9s cubic-bezier(.4,.1,.3,1) both; }
        .portrait-deck { position:absolute; right:-18px; bottom:-14px; z-index:2; pointer-events:none; }
        .journey-track { position:relative; padding-left:64px; }
        .journey-track::before { content:""; position:absolute; left:22px; top:6px; bottom:6px; width:4px; background:${T.ink}; opacity:.16; border-radius:2px; }
        .ride-board { position:absolute; left:-4px; z-index:2; width:64px; transform:translateY(-50%); transition:top .08s linear; pointer-events:none; }
        .ride-board .deck-mark { width:64px !important; height:35px !important; }
        .track-current { position:absolute; left:66px; top:0; display:inline-flex; align-items:center; padding:6px 12px; margin-top:-3px; border:2px solid ${T.ink}; border-radius:999px; background:${T.white}; box-shadow:2px 2px 0 ${T.ink}; font:800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.1em; text-transform:uppercase; color:${T.ink}; }
        .scene { position:relative; min-height:600px; padding:50px 0 84px; scroll-margin-top:100px; overflow:visible; }
        .scene + .scene { border-top:3px solid ${T.ink}; }
        .section-lead { margin-bottom:30px; }
        .section-kicker { font:800 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.18em; text-transform:uppercase; color:${T.flame}; }
        .section-title-row { display:flex; align-items:center; gap:15px; margin-top:9px; }
        .section-number { display:flex; align-items:center; justify-content:center; width:44px; height:44px; flex:none; border:3px solid ${T.ink}; border-radius:50%; background:${T.acid}; box-shadow:3px 3px 0 ${T.ink}; font:800 14px ui-monospace, SFMono-Regular, Menlo, monospace; }
        .section-label { margin:0 0 2px; font:800 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.14em; text-transform:uppercase; color:${T.muted}; }
        .section-title-row h2 { margin:0; font:900 clamp(28px,4.5vw,44px)/1.02 ui-sans-serif, Inter, sans-serif; letter-spacing:-.03em; text-transform:uppercase; }
        .section-icon { margin-left:auto; color:${T.ink}; }
        .scene > * { position:relative; z-index:1; }
        .scene-copy { max-width:660px; font:16px/1.65 ui-sans-serif, Inter, sans-serif; color:#232019; }
        .scene-copy strong { color:${T.ink}; }
        .work-list { margin-top:38px; border-top:3px solid ${T.ink}; }
        .work-row { display:grid; grid-template-columns:22px 1.1fr .7fr 1.8fr; gap:16px; padding:16px 0; border-bottom:2px solid rgba(14,14,14,.16); align-items:start; }
        .work-row .bolt { width:14px; height:14px; margin-top:6px; border-radius:50%; border:3px solid ${T.ink}; background:${T.paper}; }
        .work-row strong { font:800 18px ui-sans-serif, Inter, sans-serif; }
        .work-row .role { font:800 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.08em; text-transform:uppercase; color:${T.flame}; }
        .work-row time { font:10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.08em; text-transform:uppercase; color:${T.muted}; }
        .work-row p { margin:0; font:14px/1.5 ui-sans-serif, Inter, sans-serif; color:#232019; }
        .through-line { margin-top:32px; padding:15px 0 15px 18px; border-left:6px solid ${T.flame}; font:600 16px/1.5 ui-sans-serif, Inter, sans-serif; color:${T.ink}; }
        .build-intro { max-width:600px; margin-bottom:26px; font:16px/1.6 ui-sans-serif, Inter, sans-serif; color:#232019; }
        .build-field { display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:18px; }
        .build-deck { position:relative; min-height:172px; padding:19px 17px 15px; border:3px solid ${T.ink}; border-radius:20px; background:${T.white}; box-shadow:5px 5px 0 ${T.ink}; text-align:left; cursor:pointer; transition:transform .15s, box-shadow .15s; overflow:hidden; }
        .build-deck-strip { position:absolute; left:0; top:0; right:0; height:9px; background:${T.flame}; }
        .build-deck:nth-child(3n+2) .build-deck-strip { background:${T.acid}; }
        .build-deck:nth-child(3n) .build-deck-strip { background:${T.ink}; }
        .build-deck:hover, .build-deck-open { transform:translateY(-4px); box-shadow:8px 8px 0 ${T.ink}; }
        .build-deck-top { display:flex; justify-content:space-between; gap:12px; margin-top:6px; font:800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.09em; text-transform:uppercase; color:${T.muted}; }
        .build-deck strong { display:block; margin-top:20px; font:800 24px ui-sans-serif, Inter, sans-serif; letter-spacing:-.01em; }
        .build-deck-text { display:block; margin-top:8px; font:14px/1.45 ui-sans-serif, Inter, sans-serif; color:#232019; }
        .build-deck-action { display:block; margin-top:14px; font:800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.12em; text-transform:uppercase; color:${T.flame}; }
        .outside-grid { display:grid; grid-template-columns:1.05fr .95fr; gap:34px; align-items:start; }
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
        .end-sign p { margin:0 auto; max-width:400px; font:15px/1.5 ui-sans-serif, Inter, sans-serif; color:${T.muted}; }
        .contact-row { display:flex; justify-content:center; gap:12px; margin-top:22px; }
        .contact-row a { display:inline-flex; align-items:center; gap:8px; border:3px solid ${T.ink}; border-radius:999px; padding:11px 17px; text-decoration:none; box-shadow:3px 3px 0 ${T.ink}; font:800 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.09em; text-transform:uppercase; }
        .contact-row a:first-child { background:${T.flame}; color:${T.white}; }
        .contact-row a:last-child { background:${T.ink}; color:${T.paper}; }
        .a6-footer { padding:22px 0 36px; border-top:3px solid ${T.ink}; display:flex; justify-content:space-between; align-items:center; font:800 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.1em; text-transform:uppercase; color:${T.muted}; }
        @media (max-width:760px) {
          .a6-shell { padding:0 18px; }
          .hero-grid { grid-template-columns:1fr; gap:32px; }
          .hero-portrait { order:-1; }
          .portrait-frame { max-width:220px; }
          .journey-track { padding-left:52px; }
          .journey-track::before { left:18px; }
          .ride-board { left:-24px; transform:translateY(-30%) scale(.7); }
          .track-current { margin-left:-36px; }
          .build-field { grid-template-columns:1fr; }
          .outside-grid { grid-template-columns:1fr; gap:26px; }
          .work-row { grid-template-columns:16px 1fr; gap:8px; }
          .work-row time { order:3; }
          .work-row p { order:4; }
          .a6-nav .nav-links { gap:10px; }
          .a6-nav .nav-links a:nth-child(2) { display:none; }
          .a6-nav .nav-links a:nth-child(3) { display:none; }
          .hero-route-note { left:0; bottom:0; }
          .journey-intro { grid-template-columns:1fr; align-items:start; gap:14px; }
          .portrait-deck { right:-6px; bottom:-10px; transform:scale(.8); }
        }
        @media (prefers-reduced-motion: reduce) {
          .a6-page *, .a6-page *::before, .a6-page *::after { animation:none !important; transition:none !important; }
          .ride-board { transition:none !important; }
        }
      `}} />

      <div className="a6-shell">
        <nav className="a6-nav">
          <a href="/" className="nav-brand"><i />nicole jiang</a>
          <span>the skatepark · one ride</span>
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
                <button className="drop-in" onClick={() => jumpTo("background")}><ArrowDown size={16} /> see the work</button>
                <a className="drop-in drop-in-ghost" href="https://www.linkedin.com/in/nicole-jiang-567054201/" target="_blank" rel="noreferrer">linkedin <ArrowUpRight size={15} /></a>
              </div>
              <p className="hero-note">3 hackathon wins · 6 builds shipped · always rolling</p>
              <div className="hero-stamps"><span>behaviour</span><span>product</span><span>AI</span><span>hardware</span></div>
            </div>
            <div className="hero-portrait">
              <div className="portrait-frame">
                <img src="/images/nicole-portrait.png" alt="Nicole Jiang" />
                <span className="portrait-tag">nicole · london</span>
              </div>
              <div className="hero-route-note"><b>ride log / 01</b><span>smart ideas</span><span>shipped fast</span><span>with feeling</span></div>
              <div className="portrait-deck"><Deck size={1.05} spin={started} /></div>
            </div>
          </div>
        </section>

        <div className="grip-divider" />

        <section className="journey-intro">
          <div>
            <p className="section-kicker">the ride</p>
            <h2>Three spots. One line.</h2>
          </div>
          <p>Scroll to move the board. Each spot gives you a different view of the person behind the work.</p>
          <div className="journey-map" aria-label="Three skatepark spots"><span className="journey-map-label">park map</span><i /><b /><i /><b /><i /></div>
        </section>

        <div className="journey-track" ref={trackRef}>
          <div className="ride-board" style={{ top: `${Math.max(3, progress * 100)}%` }}><Deck spin={started} /></div>
          <div className="track-current"><span>{SPOTS[activeIndex].number} · {SPOTS[activeIndex].label}</span></div>

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
            <div className="end-sign"><p className="section-kicker">session complete</p><h2>Keep in touch?</h2><p>The next build is always somewhere around the corner.</p><div className="contact-row"><a href="mailto:nicolejiang2324@gmail.com"><Mail size={15} /> email me</a><a href="https://www.linkedin.com/in/nicole-jiang-567054201/" target="_blank" rel="noreferrer"><ArrowUpRight size={15} /> linkedin</a></div></div>
          </section>
        </div>

        <footer className="a6-footer"><span>nicole jiang · skatepark v2.0</span><span>london · 2026</span></footer>
      </div>
    </main>
  );
}
