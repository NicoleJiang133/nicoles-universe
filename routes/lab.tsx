import { useEffect, useRef, useState } from "react";
import * as THREE from "https://esm.sh/three@0.170.0";
import { ArrowDown, ArrowUpRight, Brain, Camera, Cat, Compass, Gamepad2, Mail, Plane, Target, Trophy, Users, Wrench, X } from "lucide-react";

const T = {
  paper: "#F4EDDE",
  card: "#FFFDF7",
  ink: "#141414",
  muted: "#6B6558",
  flame: "#FF3D1A",
  acid: "#D6FF3D",
  sky: "#4DA3FF",
  pink: "#FF5CA8",
};

const SPOT_META = [
  { id: "background", number: "01", label: "Quarterpipe", sub: "the drop in", title: "How I got here", icon: Brain, t: 0.28 },
  { id: "builds", number: "02", label: "Rail", sub: "the grind", title: "What I build", icon: Wrench, t: 0.505 },
  { id: "outside", number: "03", label: "Bowl", sub: "the carve", title: "Beyond the screen", icon: Compass, t: 0.73 },
] as const;

const ROLES = [
  { org: "algo1", role: "Behavioural Scientist", when: "Sep 2025 · now", what: "I own the behavioural layer of the product: work out why shoppers do what they do, design the trolley-tablet interventions that shift it, run A/B tests on real trips, and fold every result into the BeSci Engine.", taken: ["experiment design", "causal inference", "AI product judgement", "stakeholder storytelling"] },
  { org: "Applied Behaviour Change", role: "Product + BeSci Associate", when: "2024 · 2025", what: "Behavioural diagnosis, intervention design, and research for health and wellbeing products. Client work from first workshop to shipped change.", taken: ["intervention design", "research to product translation", "client-ready evidence"] },
  { org: "UCL Centre for Behaviour Change", role: "Research Assistant", when: "2024", what: "Behaviour change intervention ontologies, working with the team that writes the field's standards.", taken: ["BCTTv1 fluency", "ontology design", "academic rigour"] },
];

const BUILDS = [
  { name: "Tella", cat: "software", tag: "Tokens LDN · won", text: "A companion that calls older adults on their landline, remembers their stories, and asks about their grandkids by name. No app, no screen.", why: "Loneliness is a health risk, and most tech ignores people without smartphones. A phone call meets them where they already are." },
  { name: "Basket", cat: "software", tag: "Tokens LDN · won", text: "Watches recipe videos for comments like \"I swapped the brand\" and warns food companies weeks before the shift shows up in sales.", why: "Brands usually learn about recipe backlash from sales data months later. A few weeks of early warning changes what they can still fix." },
  { name: "Drift", cat: "software", tag: "AI Tinkerers · won", text: "Watches how you actually work for two weeks, then suggests small automations around your real habits, with a measure of what each one saves.", why: "Most automation advice is generic. Watching how someone actually works first makes the advice worth taking." },
  { name: "donna.ai", cat: "hardware", tag: "physical AI", text: "Voice plus vision on factory floors and delivery routes. Spots a delay early, calls the customer, and reroutes before anyone complains.", why: "A delay handled before the customer notices is the difference between a kept customer and a lost one." },
  { name: "EvaOS", cat: "hardware", tag: "physical AI", text: "AI that talks to you while you cook or fix things, hands free. Sees what you see and walks you through the next step.", why: "AI you can use with your hands busy is a different product category, not a smaller screen." },
  { name: "Mindful Pi", cat: "hardware", tag: "physical AI", text: "A small meditation box that reads your breathing and slows its light until you settle. No screen, and nothing leaves the device.", why: "Meditation apps live on the same device that distracts you. Offline and screenless is the point." },
];

const CATS = [
  { id: "software", label: "Software & AI" },
  { id: "hardware", label: "Hardware & Physical AI" },
] as const;

const PLAYER_ROWS = [
  ["player", "nicole jiang"],
  ["class", "behavioural scientist"],
  ["base", "london, uk"],
  ["status", "building at algo1"],
  ["wins", "3 hackathons"],
  ["motto", "enjoy the ride"],
];

const PERSON_ROWS = [
  { icon: Cat, label: "mom of two cats", note: "they run the flat" },
  { icon: Plane, label: "travel + food", note: "always plotting the next trip" },
  { icon: Users, label: "Manus Fellow", note: "still organizing community events" },
  { icon: Brain, label: "lately chewing on", note: "HRI and the trust layer: what makes people hand tasks to machines" },
];

const POLAROIDS = [
  { src: "/images/polaroid-cats.png", cap: "the cats" },
  { src: "/images/polaroid-travel.png", cap: "somewhere new" },
  { src: "/images/polaroid-food.png", cap: "a good dish" },
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

const lam = (color: string) => new THREE.MeshLambertMaterial({ color });
const bas = (color: string) => new THREE.MeshBasicMaterial({ color });

function outlined(mesh: THREE.Mesh, color = T.ink) {
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(mesh.geometry, 28),
    new THREE.LineBasicMaterial({ color })
  );
  mesh.add(edges);
  return mesh;
}

function makeRibbon(curve: THREE.CatmullRomCurve3, halfW: number, y: number, mat: THREE.Material) {
  const N = 220;
  const positions: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const p = curve.getPointAt(t);
    const tan = curve.getTangentAt(t);
    const px = -tan.z;
    const pz = tan.x;
    positions.push(p.x + px * halfW, y, p.z + pz * halfW, p.x - px * halfW, y, p.z - pz * halfW);
    if (i < N) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, mat);
}

function buildBoard() {
  const board = new THREE.Group();
  const deck = outlined(new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.09, 2.05), lam(T.ink)));
  deck.position.y = 0.02;
  board.add(deck);
  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.08, 0.4), lam(T.ink));
  nose.position.set(0, 0.09, -1.12);
  nose.rotation.x = 0.42;
  board.add(nose);
  const tail = nose.clone();
  tail.position.set(0, 0.09, 1.12);
  tail.rotation.x = -0.42;
  board.add(tail);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.045, 1.5), bas(T.acid));
  stripe.position.y = -0.045;
  board.add(stripe);
  const truckGeo = new THREE.BoxGeometry(0.42, 0.08, 0.18);
  [-0.62, 0.62].forEach((z) => {
    const truck = new THREE.Mesh(truckGeo, lam(T.muted));
    truck.position.set(0, -0.11, z);
    board.add(truck);
  });
  const wheelGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 14);
  const wheels: THREE.Group[] = [];
  [-0.24, 0.24].forEach((x) => {
    [-0.62, 0.62].forEach((z) => {
      const g = new THREE.Group();
      const w = new THREE.Mesh(wheelGeo, lam(T.card));
      w.rotation.z = Math.PI / 2;
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.09, 8), bas(T.flame));
      hub.rotation.z = Math.PI / 2;
      g.add(w, hub);
      g.position.set(x, -0.18, z);
      board.add(g);
      wheels.push(g);
    });
  });
  board.traverse((o) => { if (o instanceof THREE.Mesh) o.castShadow = true; });
  return { board, wheels };
}

function makeQuarterpipe() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.lineTo(5.1, 0);
  s.lineTo(5.1, 2.7);
  s.lineTo(3.9, 2.7);
  s.quadraticCurveTo(3.9, 0.8, 1.2, 0.12);
  s.lineTo(0, 0);
  const geo = new THREE.ExtrudeGeometry(s, { depth: 4.2, bevelEnabled: false });
  const mesh = outlined(new THREE.Mesh(geo, lam(T.flame)));
  mesh.castShadow = true;
  const coping = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 4.2, 10), bas(T.ink));
  coping.rotation.x = Math.PI / 2;
  coping.position.set(3.9, 2.72, 2.1);
  const g = new THREE.Group();
  g.add(mesh, coping);
  g.children.forEach((c) => { c.position.z -= 2.1; });
  return g;
}

function makeRail() {
  const g = new THREE.Group();
  const bar = outlined(new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.24, 0.24), lam(T.acid)));
  bar.position.y = 0.95;
  bar.castShadow = true;
  g.add(bar);
  [-2.7, 2.7].forEach((x) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.95, 0.18), lam(T.ink));
    leg.position.set(x, 0.48, 0);
    leg.castShadow = true;
    g.add(leg);
  });
  return g;
}

function makeBowl() {
  const g = new THREE.Group();
  const rim = outlined(new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.36, 12, 44), lam(T.card)));
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.42;
  rim.castShadow = true;
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(2.7, 2.45, 0.85, 44, 1, true), new THREE.MeshLambertMaterial({ color: T.card, side: THREE.DoubleSide }));
  wall.position.y = 0.02;
  const floor = new THREE.Mesh(new THREE.CircleGeometry(2.45, 40), lam(T.sky));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.38;
  g.add(rim, wall, floor);
  return g;
}

function makeCone() {
  const g = new THREE.Group();
  const c = outlined(new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.05, 12), lam(T.flame)));
  c.position.y = 0.53;
  c.castShadow = true;
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.33, 0.2, 12), bas(T.card));
  band.position.y = 0.55;
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.09, 0.95), lam(T.ink));
  base.position.y = 0.05;
  g.add(c, band, base);
  return g;
}

export default function Ride() {
  const now = useLondonTime();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [detail, setDetail] = useState<{ kind: "role" | "build"; id: string } | null>(null);
  const activeRef = useRef(0);
  const progressRef = useRef(0);
  const flipRef = useRef(0);

  const pick = (kind: "role" | "build", id: string) => {
    setDetail((d) => {
      const next = d && d.kind === kind && d.id === id ? null : { kind, id };
      if (next) flipRef.current = performance.now();
      return next;
    });
  };

  useEffect(() => { activeRef.current = active; }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDetail(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const detailRole = detail?.kind === "role" ? ROLES.find((r) => r.org === detail.id) : null;
  const detailBuild = detail?.kind === "build" ? BUILDS.find((b) => b.name === detail.id) : null;

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement.scrollHeight - window.innerHeight;
      const p = doc > 0 ? Math.min(Math.max(window.scrollY / doc, 0), 1) : 0;
      progressRef.current = p;
      setProgress(p);
      const mid = window.scrollY + window.innerHeight * 0.5;
      let idx = 0;
      SPOT_META.forEach((s, i) => {
        const el = sectionRefs.current[s.id];
        if (el && el.offsetTop <= mid) idx = i + 1;
      });
      const outro = sectionRefs.current.outro;
      if (outro && outro.offsetTop <= mid) idx = 4;
      setActive(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const skyCanvas = document.createElement("canvas");
    skyCanvas.width = 2;
    skyCanvas.height = 512;
    const g2 = skyCanvas.getContext("2d");
    if (g2) {
      const grad = g2.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, "#7CC9FF");
      grad.addColorStop(0.55, "#FFD9A8");
      grad.addColorStop(1, "#FFB98A");
      g2.fillStyle = grad;
      g2.fillRect(0, 0, 2, 512);
      const skyTex = new THREE.CanvasTexture(skyCanvas);
      skyTex.colorSpace = THREE.SRGBColorSpace;
      scene.background = skyTex;
    }
    scene.fog = new THREE.Fog(new THREE.Color("#FFD9A8"), 60, 210);

    const isMobile = window.innerWidth < 700;
    const camera = new THREE.PerspectiveCamera(isMobile ? 64 : 55, window.innerWidth / window.innerHeight, 0.1, 500);

    const hemi = new THREE.HemisphereLight(0xcfe8ff, 0xe8d2a8, 0.95);
    scene.add(hemi);
    const sunLight = new THREE.DirectionalLight(0xfff1dd, 1.4);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(2048, 2048);
    sunLight.shadow.camera.left = -24;
    sunLight.shadow.camera.right = 24;
    sunLight.shadow.camera.top = 24;
    sunLight.shadow.camera.bottom = -24;
    sunLight.shadow.camera.far = 120;
    scene.add(sunLight, sunLight.target);

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 58),
      new THREE.Vector3(-13, 0, 30),
      new THREE.Vector3(11, 0, 2),
      new THREE.Vector3(-11, 0, -28),
      new THREE.Vector3(9, 0, -58),
      new THREE.Vector3(0, 0, -94),
    ]);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), lam(T.paper));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    const grid = new THREE.GridHelper(600, 120, 0xd8c7a2, 0xe2d5b6);
    grid.position.y = 0.015;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.55;
    scene.add(grid);

    const road = makeRibbon(curve, 2.35, 0.03, lam(T.ink));
    road.receiveShadow = true;
    const roadInner = makeRibbon(curve, 1.9, 0.045, lam(T.card));
    roadInner.receiveShadow = true;
    scene.add(road, roadInner);

    const dashGeo = new THREE.PlaneGeometry(0.16, 1.15);
    for (let i = 0; i < 34; i++) {
      const t = (i + 0.5) / 34;
      const p = curve.getPointAt(t);
      const tan = curve.getTangentAt(t);
      const dash = new THREE.Mesh(dashGeo, bas(T.acid));
      dash.rotation.order = "YXZ";
      dash.rotation.y = Math.atan2(tan.x, tan.z);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(p.x, 0.06, p.z);
      scene.add(dash);
    }

    [0.004, 0.996].forEach((t0) => {
      const p = curve.getPointAt(t0);
      const tan = curve.getTangentAt(t0);
      const yaw = Math.atan2(tan.x, tan.z);
      const line = new THREE.Group();
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 6; c++) {
          const sq = new THREE.Mesh(new THREE.BoxGeometry(0.63, 0.05, 0.5), (r + c) % 2 === 0 ? lam(T.ink) : lam(T.card));
          sq.position.set((c - 2.5) * 0.64, 0.05, (r - 0.5) * 0.52);
          line.add(sq);
        }
      }
      line.rotation.y = yaw;
      line.position.copy(p);
      scene.add(line);
    });

    const perpAt = (t: number) => {
      const tan = curve.getTangentAt(t);
      return new THREE.Vector3(-tan.z, 0, tan.x);
    };
    const yawAt = (t: number) => {
      const tan = curve.getTangentAt(t);
      return Math.atan2(tan.x, tan.z);
    };

    const qpPos = curve.getPointAt(SPOT_META[0].t).addScaledVector(perpAt(SPOT_META[0].t), 7.1);
    const quarterpipe = makeQuarterpipe();
    quarterpipe.position.copy(qpPos);
    quarterpipe.rotation.y = yawAt(SPOT_META[0].t) + Math.PI / 2;
    scene.add(quarterpipe);

    const railPos = curve.getPointAt(SPOT_META[1].t).addScaledVector(perpAt(SPOT_META[1].t), -4.4);
    const rail = makeRail();
    rail.position.copy(railPos);
    rail.rotation.y = yawAt(SPOT_META[1].t);
    scene.add(rail);

    const bowlPos = curve.getPointAt(SPOT_META[2].t).addScaledVector(perpAt(SPOT_META[2].t), 7.6);
    const bowl = makeBowl();
    bowl.position.copy(bowlPos);
    scene.add(bowl);

    const coneTs = [0.12, 0.22, 0.4, 0.6, 0.83, 0.92];
    coneTs.forEach((t, i) => {
      const cone = makeCone();
      const side = i % 2 === 0 ? 1 : -1;
      cone.position.copy(curve.getPointAt(t)).addScaledVector(perpAt(t), side * (3.6 + (i % 3)));
      cone.rotation.y = i * 1.3;
      scene.add(cone);
    });

    const clouds: THREE.Group[] = [];
    for (let i = 0; i < 6; i++) {
      const cloud = new THREE.Group();
      const n = 2 + (i % 2);
      for (let k = 0; k < n; k++) {
        const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6 + k * 0.5, 0), bas(T.card));
        puff.scale.y = 0.45;
        puff.position.set(k * 1.9 - n, (k % 2) * 0.5, 0);
        cloud.add(puff);
      }
      cloud.position.set(-90 + i * 36, 15 + (i % 3) * 4, -60 - (i % 2) * 50);
      scene.add(cloud);
      clouds.push(cloud);
    }

    const rings: THREE.Mesh[] = [];
    [T.flame, T.acid, T.pink].forEach((color, i) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.26, 10, 30), lam(color));
      ring.position.set([-26, 22, -14][i], 9 + i * 3.5, [-52, -30, -78][i]);
      scene.add(ring);
      rings.push(ring);
    });

    const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(8, 40), bas(T.acid));
    sunDisc.position.set(28, 26, -170);
    scene.add(sunDisc);

    for (let i = 0; i < 14; i++) {
      const h = 4 + ((i * 37) % 11);
      const bMat = lam("#3A4664");
      const box = new THREE.Mesh(new THREE.BoxGeometry(5 + ((i * 7) % 8), h, 5), bMat);
      box.position.set(-75 + i * 13, h / 2, -148 - ((i * 5) % 12));
      scene.add(box);
    }

    const { board, wheels } = buildBoard();
    board.rotation.order = "YXZ";
    scene.add(board);

    const mouse = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    onResize();
    window.addEventListener("resize", onResize);

    let raf = 0;
    let cur = 0.02;
    let prevYaw = 0;
    let rollS = 0;
    let last = performance.now();
    let trickStart = -1;
    let lastActive = 0;
    let firstFrame = true;

    const camBack = isMobile ? 9.6 : 8.2;
    const camUp = isMobile ? 5.6 : 4.8;

    const tick = (nowMs: number) => {
      const dt = Math.min(0.05, (nowMs - last) / 1000);
      last = nowMs;
      const target = 0.02 + progressRef.current * 0.96;
      cur += (target - cur) * (1 - Math.pow(0.0001, dt));

      const pos = curve.getPointAt(cur);
      const tan = curve.getTangentAt(cur);
      const yaw = Math.atan2(tan.x, tan.z);
      const yawRate = (yaw - prevYaw) / Math.max(dt, 0.001);
      prevYaw = yaw;
      rollS += (Math.max(-0.45, Math.min(0.45, -yawRate * 0.16)) - rollS) * Math.min(1, dt * 6);

      if (activeRef.current !== lastActive) {
        if (progressRef.current > 0.01) trickStart = nowMs;
        lastActive = activeRef.current;
      }
      if (flipRef.current > 0) {
        trickStart = flipRef.current;
        flipRef.current = 0;
      }
      let hop = 0;
      let flip = 0;
      if (trickStart > 0) {
        const k = (nowMs - trickStart) / 650;
        if (k >= 1) trickStart = -1;
        else {
          hop = Math.sin(Math.PI * k) * 1.6;
          flip = k * Math.PI * 2;
        }
      }

      board.position.set(pos.x, 0.34 + hop, pos.z);
      board.rotation.set(0, yaw, rollS + flip);
      const speed = Math.abs(target - cur) > 0.001 ? 9 : 2.5;
      wheels.forEach((w) => { w.rotation.x += dt * speed; });

      const camPos = pos.clone().addScaledVector(tan, -camBack);
      camPos.y = camUp;
      if (firstFrame) {
        camera.position.copy(camPos);
        firstFrame = false;
        setReady(true);
      } else {
        camera.position.lerp(camPos, 1 - Math.pow(0.0005, dt));
      }
      const look = pos.clone().addScaledVector(tan, 7);
      look.y = 1.15 + mouse.y * -0.9;
      look.x += mouse.x * 1.6;
      camera.lookAt(look);

      sunLight.position.set(pos.x + 16, 24, pos.z + 10);
      sunLight.target.position.copy(pos);

      clouds.forEach((c, i) => {
        c.position.x += dt * (0.7 + i * 0.14);
        if (c.position.x > 120) c.position.x = -120;
      });
      rings.forEach((r, i) => {
        r.rotation.x += dt * (0.25 + i * 0.12);
        r.rotation.y += dt * 0.18;
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  const jumpTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const hudLabel = active === 0
    ? "start line · the skatepark"
    : active === 4
      ? "finish line · session complete"
      : `spot ${SPOT_META[active - 1].number}/03 · ${SPOT_META[active - 1].label}`;

  return (
    <main className="pk-page">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pkFadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
        @keyframes pkPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,61,26,.35); } 50% { box-shadow: 0 0 0 9px rgba(255,61,26,0); } }
        @keyframes pkHint { 0%,100% { transform: translateY(0); } 50% { transform: translateY(7px); } }
        .pk-page { min-height: 100vh; color: ${T.ink}; font-family: ui-sans-serif, Inter, system-ui, -apple-system, sans-serif; background: ${T.paper}; }
        .pk-page * { box-sizing: border-box; }
        .pk-canvas { position: fixed; inset: 0; width: 100%; height: 100%; display: block; z-index: 0; opacity: 0; transition: opacity .9s ease; }
        .pk-canvas.ready { opacity: 1; }
        .pk-topbar { position: fixed; top: 0; left: 0; right: 0; z-index: 20; display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; pointer-events: none; }
        .pk-brand { display: inline-flex; align-items: center; gap: 9px; border: 3px solid ${T.ink}; border-radius: 999px; background: ${T.card}; box-shadow: 4px 4px 0 ${T.ink}; padding: 8px 15px; font: 800 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .12em; text-transform: uppercase; }
        .pk-brand i { width: 8px; height: 8px; border-radius: 50%; background: ${T.flame}; animation: pkPulse 1.8s ease infinite; }
        .pk-time { border: 3px solid ${T.ink}; border-radius: 999px; background: ${T.ink}; color: ${T.acid}; box-shadow: 4px 4px 0 rgba(20,20,20,.35); padding: 8px 15px; font: 800 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .1em; text-transform: uppercase; }
        .pk-hud { position: fixed; left: 18px; bottom: 18px; z-index: 20; display: flex; align-items: center; gap: 11px; padding: 10px 14px; border: 3px solid ${T.ink}; border-radius: 999px; background: ${T.card}; box-shadow: 4px 4px 0 ${T.ink}; font: 800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .1em; text-transform: uppercase; pointer-events: none; }
        .pk-hud .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.flame}; animation: pkPulse 1.8s ease infinite; }
        .pk-hud-bar { width: 104px; height: 8px; border: 2px solid ${T.ink}; border-radius: 999px; overflow: hidden; background: ${T.paper}; }
        .pk-hud-bar i { display: block; height: 100%; background: ${T.acid}; }
        .pk-content { position: relative; z-index: 5; pointer-events: none; }
        .pk-sec { position: relative; display: flex; align-items: center; min-height: 118vh; padding: 12vh 5vw; }
        .pk-sec-inner { width: 100%; max-width: 1180px; margin: 0 auto; display: flex; justify-content: flex-end; }
        .pk-card { pointer-events: auto; width: 100%; max-width: 430px; max-height: 86vh; overflow-y: auto; scrollbar-width: thin; border: 3px solid ${T.ink}; border-radius: 22px; background: rgba(255,253,247,.96); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); box-shadow: 8px 8px 0 ${T.ink}; padding: 26px 24px 22px; opacity: 0; transform: translateY(26px) scale(.985); transition: opacity .45s ease, transform .45s ease, visibility .45s; visibility: hidden; }
        .pk-card.on { opacity: 1; transform: none; visibility: visible; }
        .pk-kicker { font: 800 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .18em; text-transform: uppercase; color: ${T.flame}; }
        .pk-card-head { display: flex; align-items: center; gap: 13px; margin: 10px 0 16px; }
        .pk-num { display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; flex: none; border: 3px solid ${T.ink}; border-radius: 50%; background: ${T.acid}; box-shadow: 3px 3px 0 ${T.ink}; font: 800 14px ui-monospace, SFMono-Regular, Menlo, monospace; }
        .pk-card-head h2 { margin: 0; font: 900 clamp(24px, 3.4vw, 34px)/1.02 ui-sans-serif, Inter, sans-serif; letter-spacing: -.03em; text-transform: uppercase; }
        .pk-card-head .sub { margin: 2px 0 0; font: 800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .14em; text-transform: uppercase; color: ${T.muted}; }
        .pk-card-head svg { margin-left: auto; }
        .pk-card p { margin: 0 0 12px; font: 14.5px/1.6 ui-sans-serif, Inter, sans-serif; color: #26221b; }
        .pk-card p strong { color: ${T.ink}; }
        .pk-minihead { margin: 17px 0 8px; border-top: 3px solid ${T.ink}; padding-top: 10px; font: 800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .14em; text-transform: uppercase; color: ${T.flame}; }
        .pk-day { display: grid; gap: 8px; margin: 0; padding: 0 0 0 16px; font: 13px/1.46 ui-sans-serif, Inter, sans-serif; color: #26221b; }
        .pk-day li::marker { color: ${T.flame}; }
        .pk-day b { font-weight: 900; }
        .pk-hone { display: flex; flex-wrap: wrap; gap: 7px; }
        .pk-hone span { border: 2px solid ${T.ink}; border-radius: 999px; padding: 6px 9px; background: ${T.acid}; box-shadow: 2px 2px 0 ${T.ink}; font: 800 8px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .06em; text-transform: uppercase; }
        .pk-hone span:nth-child(2n) { background: ${T.card}; }
        .pk-roles { margin-top: 16px; border-top: 3px solid ${T.ink}; }
        .pk-role { display: flex; justify-content: space-between; align-items: center; gap: 12px; width: 100%; padding: 10px 9px; border: 2px solid transparent; border-bottom: 2px dashed rgba(20,20,20,.22); border-radius: 10px; background: none; font: inherit; color: inherit; text-align: left; cursor: pointer; transition: background .15s, border-color .15s; }
        .pk-role:hover { background: rgba(214,255,61,.3); }
        .pk-role.sel { background: ${T.acid}; border-color: ${T.ink}; box-shadow: 3px 3px 0 ${T.ink}; }
        .pk-role b { font: 800 14px ui-sans-serif, Inter, sans-serif; }
        .pk-role .r { display: block; font: 800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .08em; text-transform: uppercase; color: ${T.flame}; }
        .pk-role-r { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; flex: none; }
        .pk-role time { font: 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .06em; text-transform: uppercase; color: ${T.muted}; white-space: nowrap; }
        .pk-role-cue { font: 800 8px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .1em; text-transform: uppercase; color: ${T.flame}; }
        .pk-through { margin-top: 14px; padding: 11px 0 11px 14px; border-left: 6px solid ${T.flame}; font: 700 13.5px/1.5 ui-sans-serif, Inter, sans-serif; }
        .pk-builds { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 4px; }
        .pk-build { position: relative; display: flex; flex-direction: column; border: 3px solid ${T.ink}; border-radius: 15px; background: ${T.card}; box-shadow: 4px 4px 0 ${T.ink}; padding: 12px 12px 10px; text-align: left; cursor: pointer; transition: transform .15s, box-shadow .15s; overflow: hidden; }
        .pk-build::before { content: ""; position: absolute; left: 0; top: 0; right: 0; height: 7px; background: ${T.flame}; }
        .pk-build:nth-child(3n+2)::before { background: ${T.acid}; }
        .pk-build:nth-child(3n)::before { background: ${T.ink}; }
        .pk-build:hover, .pk-build.open { transform: translateY(-3px); box-shadow: 6px 6px 0 ${T.ink}; }
        .pk-build .tag { display: inline-flex; align-items: center; gap: 4px; margin-top: 6px; font: 800 8px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .09em; text-transform: uppercase; color: ${T.muted}; }
        .pk-build .tag svg { color: ${T.flame}; flex: none; }
        .pk-build strong { display: block; margin-top: 6px; font: 800 16px/1.2 ui-sans-serif, Inter, sans-serif; letter-spacing: -.01em; }
        .pk-build .txt { display: none; margin-top: 7px; font: 12.5px/1.45 ui-sans-serif, Inter, sans-serif; color: #26221b; }
        .pk-build .txt.why { padding-top: 6px; border-top: 2px dashed rgba(20,20,20,.22); font-size: 12px; color: ${T.muted}; }
        .pk-build.open .txt { display: block; }
        .pk-build .cue { display: block; margin-top: auto; padding-top: 8px; font: 800 8px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .1em; text-transform: uppercase; color: ${T.flame}; }
        .pk-builds-note { margin: 0 0 14px; font: 14.5px/1.6 ui-sans-serif, Inter, sans-serif; color: #26221b; }
        .pk-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
        .pk-chip { display: inline-flex; align-items: center; gap: 7px; border: 3px solid ${T.ink}; border-radius: 999px; padding: 7px 11px; background: ${T.card}; box-shadow: 3px 3px 0 ${T.ink}; font: 800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .07em; text-transform: uppercase; }
        .pk-chip:nth-child(2) { background: ${T.acid}; }
        .pk-chip:nth-child(3) { background: ${T.flame}; color: ${T.card}; }
        .pk-langs { margin-top: 16px; font: 800 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .07em; text-transform: uppercase; color: ${T.muted}; }
        .pk-sec-tall { align-items: flex-start; }
        .pk-outside-col { padding-top: 8vh; }
        .pk-people { margin-top: 15px; display: grid; gap: 9px; }
        .pk-person { display: flex; gap: 10px; align-items: flex-start; }
        .pk-person-ic { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; flex: none; border: 2px solid ${T.ink}; border-radius: 8px; background: ${T.acid}; box-shadow: 2px 2px 0 ${T.ink}; }
        .pk-person:nth-child(2n) .pk-person-ic { background: ${T.flame}; color: ${T.card}; }
        .pk-person b { display: block; font: 800 13px ui-sans-serif, Inter, sans-serif; }
        .pk-person span:not(.pk-person-ic) { display: block; font: 12px/1.4 ui-sans-serif, Inter, sans-serif; color: ${T.muted}; }
        .pk-polars { display: flex; gap: 10px; margin-top: 16px; }
        .pk-polar { flex: 1; margin: 0; background: #fff; border: 3px solid ${T.ink}; border-radius: 10px; padding: 5px 5px 6px; box-shadow: 4px 4px 0 ${T.ink}; }
        .pk-polar img { display: block; width: 100%; aspect-ratio: 4/5; object-fit: cover; border-radius: 6px; border: 2px solid rgba(20,20,20,.12); }
        .pk-polar figcaption { margin-top: 5px; text-align: center; font: 800 8px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .08em; text-transform: uppercase; color: ${T.muted}; }
        .pk-stick { max-width: 400px; align-self: flex-start; }
        .pk-num-flame { background: ${T.flame}; color: ${T.card}; }
        .pk-note { width: 100%; resize: vertical; min-height: 88px; border: 3px solid ${T.ink}; border-radius: 14px; background: #fff; box-shadow: 3px 3px 0 ${T.ink}; padding: 11px 12px; font: 14px/1.5 ui-sans-serif, Inter, sans-serif; color: ${T.ink}; outline: none; }
        .pk-note:focus { border-color: ${T.flame}; }
        .pk-stick-row { display: flex; gap: 9px; margin-top: 10px; }
        .pk-from { flex: 1; min-width: 0; border: 3px solid ${T.ink}; border-radius: 999px; background: #fff; box-shadow: 3px 3px 0 ${T.ink}; padding: 0 14px; font: 12px ui-sans-serif, Inter, sans-serif; color: ${T.ink}; outline: none; }
        .pk-from:focus { border-color: ${T.flame}; }
        .pk-stick-send { padding: 11px 16px; flex: none; }
        .pk-stick-send:disabled { opacity: .45; cursor: default; transform: none; box-shadow: 5px 5px 0 ${T.flame}; }
        .pk-stick-done p { margin: 4px 0 14px; }
        .pk-stick-err { margin-top: 10px; font: 700 12px ui-sans-serif, Inter, sans-serif; color: ${T.flame}; }
        @keyframes pkFly { 0% { transform: translate(0,0) rotate(-8deg) scale(1); opacity: 0; } 10% { opacity: 1; } 55% { transform: translate(34vw,-34vh) rotate(4deg) scale(.9); } 100% { transform: translate(70vw,-76vh) rotate(9deg) scale(.6); opacity: 0; } }
        .pk-plane { position: fixed; left: 50%; bottom: 32vh; z-index: 40; pointer-events: none; color: ${T.ink}; }
        .pk-plane svg { filter: drop-shadow(3px 3px 0 rgba(20,20,20,.3)); }
        .pk-plane.fly { animation: pkFly 1.5s cubic-bezier(.42,.1,.4,1) forwards; }
        .pk-hero { min-height: 100vh; display: flex; align-items: center; padding: 100px 5vw 12vh; }
        .pk-hero-grid { width: 100%; max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: 1.2fr .8fr; gap: 44px; align-items: center; }
        .pk-hero-copy { animation: pkFadeUp .7s ease both .15s; }
        .pk-pill { display: inline-flex; align-items: center; gap: 9px; border: 3px solid ${T.ink}; border-radius: 999px; background: ${T.card}; padding: 8px 14px; box-shadow: 4px 4px 0 ${T.ink}; font: 800 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .08em; text-transform: uppercase; }
        .pk-pill i { width: 7px; height: 7px; border-radius: 50%; background: ${T.flame}; animation: pkPulse 1.8s ease infinite; }
        .pk-pill em { font-style: normal; font-weight: 600; letter-spacing: 0; text-transform: none; }
        .pk-hero h1 { margin: 20px 0 0; font: 900 clamp(52px, 8.5vw, 100px)/.9 ui-sans-serif, Inter, system-ui, sans-serif; letter-spacing: -.04em; text-transform: uppercase; }
        .pk-hero h1 .mark { background: linear-gradient(180deg, transparent 60%, ${T.acid} 60%); padding: 0 4px; }
        .pk-role-line { margin: 14px 0 0; font: 800 16px/1.4 ui-sans-serif, Inter, sans-serif; color: ${T.ink}; text-transform: uppercase; letter-spacing: .02em; }
        .pk-role-line b { color: ${T.flame}; }
        .pk-summary { max-width: 500px; margin: 16px 0 0; font: 16px/1.6 ui-sans-serif, Inter, sans-serif; color: #26221b; }
        .pk-cta-row { display: flex; gap: 12px; margin-top: 28px; flex-wrap: wrap; }
        .pk-btn { display: inline-flex; align-items: center; gap: 9px; border: 3px solid ${T.ink}; border-radius: 999px; padding: 12px 19px; background: ${T.ink}; color: ${T.paper}; box-shadow: 5px 5px 0 ${T.flame}; font: 800 11px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; transition: transform .15s, box-shadow .15s; text-decoration: none; pointer-events: auto; }
        .pk-btn:hover { transform: translate(-2px,-2px); box-shadow: 7px 7px 0 ${T.flame}; }
        .pk-btn-ghost { background: ${T.card}; color: ${T.ink}; box-shadow: 5px 5px 0 ${T.ink}; }
        .pk-btn-ghost:hover { box-shadow: 7px 7px 0 ${T.ink}; }
        .pk-stamps { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 24px; }
        .pk-stamps span { border: 2px solid ${T.ink}; border-radius: 999px; padding: 6px 10px; background: ${T.card}; box-shadow: 2px 2px 0 ${T.ink}; font: 800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .08em; text-transform: uppercase; }
        .pk-stamps span:nth-child(2) { background: ${T.acid}; }
        .pk-stamps span:nth-child(3) { background: ${T.flame}; color: ${T.card}; }
        .pk-stamps span:nth-child(4) { background: ${T.ink}; color: ${T.paper}; }
        .pk-player { pointer-events: auto; justify-self: center; width: 100%; max-width: 320px; border: 4px solid ${T.ink}; border-radius: 24px; background: ${T.card}; box-shadow: 10px 10px 0 ${T.flame}; transform: rotate(1.5deg); animation: pkFadeUp .7s ease both .3s; }
        .pk-player-head { display: flex; align-items: center; gap: 8px; background: ${T.ink}; color: ${T.paper}; padding: 9px 14px; border-radius: 18px 18px 0 0; font: 800 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .14em; text-transform: uppercase; }
        .pk-player-head em { margin-left: auto; font-style: normal; color: ${T.acid}; }
        .pk-player-body { padding: 14px 14px 13px; }
        .pk-photo { position: relative; border: 3px solid ${T.ink}; border-radius: 16px; overflow: hidden; background: ${T.ink}; }
        .pk-photo img { display: block; width: 100%; aspect-ratio: 4/5; object-fit: cover; filter: grayscale(.08) contrast(1.05); }
        .pk-photo .tag { position: absolute; left: 12px; bottom: 12px; border: 3px solid ${T.ink}; border-radius: 999px; background: ${T.acid}; padding: 5px 11px; font: 800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .1em; text-transform: uppercase; box-shadow: 3px 3px 0 ${T.ink}; }
        .pk-rows { margin-top: 13px; display: grid; gap: 7px; }
        .pk-rows .pr { display: flex; justify-content: space-between; gap: 12px; font: 800 10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .08em; text-transform: uppercase; }
        .pk-rows .pr b { color: ${T.muted}; font-weight: 800; }
        .pk-rows .pr span { text-align: right; }
        .pk-hint { position: absolute; left: 50%; bottom: 26px; transform: translateX(-50%); display: inline-flex; align-items: center; gap: 9px; border: 3px solid ${T.ink}; border-radius: 999px; background: ${T.card}; box-shadow: 4px 4px 0 ${T.ink}; padding: 9px 15px; font: 800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .12em; text-transform: uppercase; animation: pkHint 1.6s ease-in-out infinite; transition: opacity .4s ease; }
        .pk-hint.gone { opacity: 0; pointer-events: none; }
        .pk-outro { min-height: 92vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 12vh 5vw; }
        .pk-outro-card { pointer-events: auto; max-width: 560px; border: 3px solid ${T.ink}; border-radius: 24px; background: rgba(255,253,247,.92); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); box-shadow: 9px 9px 0 ${T.ink}; padding: 40px 34px 32px; opacity: 0; transform: translateY(26px); transition: opacity .5s ease, transform .5s ease, visibility .5s; visibility: hidden; }
        .pk-outro-card.on { opacity: 1; transform: none; visibility: visible; }
        .pk-outro-card h2 { margin: 8px 0 12px; font: 900 clamp(26px, 4vw, 40px)/1.04 ui-sans-serif, Inter, sans-serif; letter-spacing: -.03em; text-transform: uppercase; }
        .pk-outro-card h2 .mark { background: linear-gradient(180deg, transparent 60%, ${T.acid} 60%); padding: 0 4px; }
        .pk-outro-card p { margin: 0 auto; max-width: 400px; font: 15px/1.55 ui-sans-serif, Inter, sans-serif; color: ${T.muted}; }
        .pk-contact { display: flex; justify-content: center; gap: 12px; margin-top: 24px; flex-wrap: wrap; }
        .pk-footer-line { margin-top: 26px; font: 800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .14em; text-transform: uppercase; color: ${T.muted}; }
        .pk-shelf { margin-top: 12px; }
        .pk-shelf-head { display: inline-block; margin: 2px 0 9px; padding: 4px 10px; border: 2px solid ${T.ink}; border-radius: 999px; background: ${T.ink}; color: ${T.acid}; box-shadow: 2px 2px 0 rgba(20,20,20,.3); font: 800 9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .14em; text-transform: uppercase; }
        .pk-detail { position: fixed; left: 22px; top: 50%; transform: translateY(-50%); z-index: 25; width: min(400px, 44vw); pointer-events: none; }
        .pk-detail-card { pointer-events: auto; position: relative; max-height: 78vh; overflow-y: auto; scrollbar-width: thin; border: 3px solid ${T.ink}; border-radius: 20px; background: rgba(255,253,247,.97); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); box-shadow: 8px 8px 0 ${T.ink}; padding: 22px 20px 15px; animation: pkDetailIn .28s ease both; }
        @keyframes pkDetailIn { from { opacity: 0; transform: translateX(-18px); } to { opacity: 1; transform: none; } }
        .pk-detail-x { position: absolute; top: 11px; right: 11px; display: flex; align-items: center; justify-content: center; width: 29px; height: 29px; border: 2px solid ${T.ink}; border-radius: 50%; background: ${T.acid}; box-shadow: 2px 2px 0 ${T.ink}; cursor: pointer; }
        .pk-detail-x:hover { background: ${T.flame}; color: ${T.card}; }
        .pk-detail-title { margin: 8px 0 3px; padding-right: 30px; font: 900 26px/1.04 ui-sans-serif, Inter, sans-serif; letter-spacing: -.02em; text-transform: uppercase; }
        .pk-detail-sub { margin: 0 0 10px; font: 800 9.5px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .1em; text-transform: uppercase; color: ${T.flame}; }
        .pk-detail-body { margin: 0 0 6px; font: 13.5px/1.55 ui-sans-serif, Inter, sans-serif; color: #26221b; }
        .pk-detail-foot { margin-top: 14px; font: 800 8px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .12em; text-transform: uppercase; color: ${T.muted}; }
        @media (max-width: 760px) {
          .pk-hero-grid { grid-template-columns: 1fr; gap: 30px; }
          .pk-player { order: -1; max-width: 250px; justify-self: start; transform: rotate(1.5deg) scale(.96); transform-origin: left top; }
          .pk-sec { padding: 10vh 18px; justify-content: center; }
          .pk-sec-inner { justify-content: center; }
          .pk-card { max-width: 100%; }
          .pk-builds { grid-template-columns: 1fr 1fr; }
          .pk-time { display: none; }
          .pk-hud { left: 10px; bottom: 10px; padding: 8px 11px; gap: 8px; }
          .pk-hud-bar { width: 56px; }
          .pk-detail { left: 12px; right: 12px; bottom: 14px; top: auto; width: auto; transform: none; }
          .pk-detail-card { max-height: 46vh; animation: pkDetailInM .28s ease both; }
          @keyframes pkDetailInM { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        }
      `}} />

      <canvas ref={canvasRef} className={`pk-canvas ${ready ? "ready" : ""}`} aria-hidden="true" />

      <div className="pk-topbar">
        <span className="pk-brand"><i />nicole jiang · player one</span>
        <span className="pk-time">{now} · london</span>
      </div>

      <div className="pk-hud" aria-hidden="true">
        <span className="dot" />
        <span>{hudLabel}</span>
        <span className="pk-hud-bar"><i style={{ width: `${Math.round(progress * 100)}%` }} /></span>
      </div>

      <div className="pk-content">
        <section className="pk-hero">
          <div className="pk-hero-grid">
            <div className="pk-hero-copy">
              <div className="pk-pill"><i /><b>right now</b><em>· building the BeSci Engine at algo1</em></div>
              <h1>Nicole <span className="mark">Jiang.</span></h1>
              <p className="pk-role-line">Behavioural scientist <b>·</b> AI product builder <b>·</b> London</p>
              <p className="pk-summary">I work where human behavior meets what we build: diagnose why people act as they do, find the pattern, then shape it so it feels good to use.</p>
              <div className="pk-cta-row">
                <button className="pk-btn" onClick={() => jumpTo("background")}>start the ride <ArrowDown size={16} /></button>
                <a className="pk-btn pk-btn-ghost" href="https://www.linkedin.com/in/nicole-jiang-567054201/" target="_blank" rel="noreferrer">linkedin <ArrowUpRight size={15} /></a>
              </div>
              <div className="pk-stamps"><span>behaviour</span><span>product</span><span>AI</span><span>hardware</span></div>
            </div>
            <div className="pk-player">
              <div className="pk-player-head"><Gamepad2 size={13} /> player card <em>NJ-01</em></div>
              <div className="pk-player-body">
                <div className="pk-photo">
                  <img src="/images/nicole-portrait.png" alt="Nicole Jiang" />
                  <span className="tag">nicole · london</span>
                </div>
                <div className="pk-rows">
                  {PLAYER_ROWS.map(([k, v]) => <div className="pr" key={k}><b>{k}</b><span>{v}</span></div>)}
                </div>
              </div>
            </div>
          </div>
          <div className={`pk-hint ${active === 0 ? "" : "gone"}`}><ArrowDown size={14} /> scroll to ride</div>
        </section>

        <section ref={(el) => { sectionRefs.current.background = el; }} className="pk-sec" id="background">
          <div className="pk-sec-inner">
            <div className={`pk-card ${active === 1 ? "on" : ""}`}>
              <div className="pk-kicker">spot 01 · quarterpipe · {SPOT_META[0].sub}</div>
              <div className="pk-card-head">
                <span className="pk-num">01</span>
                <div><p className="sub">{SPOT_META[0].label}</p><h2>{SPOT_META[0].title}</h2></div>
                <Brain size={26} strokeWidth={2} />
              </div>
              <p>I'm a behavioural scientist at <strong>algo1</strong>, an AI startup in London building hyperpersonalized shopping for grocery retail. I work out why shoppers act as they do, then design and test what shifts it.</p>
              <p>I came in through psychology, not code. The interesting problem is always human before it is technical.</p>
              <div className="pk-roles">
                {ROLES.map((r) => {
                  const sel = detail?.kind === "role" && detail.id === r.org;
                  return (
                    <button className={`pk-role ${sel ? "sel" : ""}`} key={r.org} onClick={() => pick("role", r.org)}>
                      <div><b>{r.org}</b><span className="r">{r.role}</span></div>
                      <span className="pk-role-r"><time>{r.when}</time><span className="pk-role-cue">{sel ? "close" : "detail"}</span></span>
                    </button>
                  );
                })}
              </div>
              <div className="pk-minihead">day to day at algo1</div>
              <ul className="pk-day">
                <li><b>Diagnose.</b> Shopper interviews, journey mapping, reading session data for the why behind the buy.</li>
                <li><b>Design.</b> Interventions for the trolley tablet, timed to where you are in the store.</li>
                <li><b>Test.</b> A/B experiments on real trips. Every result becomes a reusable card in the BeSci Engine.</li>
              </ul>
              <div className="pk-minihead">currently honing</div>
              <div className="pk-hone">
                <span>cs fundamentals</span>
                <span>reading AI-written code</span>
                <span>figma + ux craft</span>
                <span>experiment design</span>
              </div>
              <div className="pk-through"><strong>The through-line:</strong> every product problem is a behavior problem first.</div>
            </div>
          </div>
        </section>

        <section ref={(el) => { sectionRefs.current.builds = el; }} className="pk-sec" id="builds">
          <div className="pk-sec-inner">
            <div className={`pk-card ${active === 2 ? "on" : ""}`}>
              <div className="pk-kicker">spot 02 · rail · {SPOT_META[1].sub}</div>
              <div className="pk-card-head">
                <span className="pk-num">02</span>
                <div><p className="sub">{SPOT_META[1].label}</p><h2>{SPOT_META[1].title}</h2></div>
                <Wrench size={26} strokeWidth={2} />
              </div>
              <p className="pk-builds-note">Weekend builds and hackathon sprints. Three of these won. Tap one and the detail bay opens on the left.</p>
              {CATS.map((c) => (
                <div className="pk-shelf" key={c.id}>
                  <div className="pk-shelf-head">{c.label}</div>
                  <div className="pk-builds">
                    {BUILDS.filter((b) => b.cat === c.id).map((b) => {
                      const sel = detail?.kind === "build" && detail.id === b.name;
                      return (
                        <button key={b.name} className={`pk-build ${sel ? "open" : ""}`} onClick={() => pick("build", b.name)}>
                          <span className="tag">{b.tag.includes("won") && <Trophy size={10} />} {b.tag}</span>
                          <strong>{b.name}</strong>
                          <span className="cue">{sel ? "close" : "read"}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section ref={(el) => { sectionRefs.current.outside = el; }} className="pk-sec" id="outside">
          <div className="pk-sec-inner pk-outside-col">
            <div className={`pk-card ${active === 3 ? "on" : ""}`}>
              <div className="pk-kicker">spot 03 · bowl · {SPOT_META[2].sub}</div>
              <div className="pk-card-head">
                <span className="pk-num">03</span>
                <div><p className="sub">{SPOT_META[2].label}</p><h2>{SPOT_META[2].title}</h2></div>
                <Compass size={26} strokeWidth={2} />
              </div>
              <p>Lately: hardware. Raspberry Pis, 3D printers, a first soldered board. After years of pixels, atoms are fun.</p>
              <p>Heading toward human and AI interaction people feel safe adopting. Eventually, a company of my own.</p>
              <div className="pk-people">
                {PERSON_ROWS.map((r) => (
                  <div className="pk-person" key={r.label}>
                    <span className="pk-person-ic"><r.icon size={14} /></span>
                    <div><b>{r.label}</b><span>{r.note}</span></div>
                  </div>
                ))}
              </div>
              <div className="pk-polars">
                {POLAROIDS.map((p, i) => (
                  <figure className="pk-polar" key={p.src} style={{ transform: `rotate(${[-2.2, 1.6, -1.2][i]}deg)` }}>
                    <img src={p.src} alt={p.cap} loading="lazy" />
                    <figcaption>{p.cap}</figcaption>
                  </figure>
                ))}
              </div>
              <p className="pk-langs">中文 · native &nbsp; English · fluent &nbsp; 日本語 · conversational</p>
            </div>
          </div>
        </section>

        <section ref={(el) => { sectionRefs.current.outro = el; }} className="pk-outro">
          <div className={`pk-outro-card ${active === 4 ? "on" : ""}`}>
            <div className="pk-kicker">finish line · session complete</div>
            <h2>Life is a game. Try your best, <span className="mark">enjoy the ride.</span></h2>
            <p>The next build is always somewhere around the corner.</p>
            <div className="pk-contact">
              <a className="pk-btn" href="mailto:nicolejiang2324@gmail.com"><Mail size={15} /> email me</a>
              <a className="pk-btn pk-btn-ghost" href="https://www.linkedin.com/in/nicole-jiang-567054201/" target="_blank" rel="noreferrer"><ArrowUpRight size={15} /> linkedin</a>
            </div>
            <div className="pk-footer-line">nicole jiang · the ride v4.0 · london · 2026</div>
          </div>
        </section>
      </div>
      {(detailRole || detailBuild) && (
        <aside className="pk-detail" aria-label="Details">
          <div className="pk-detail-card" key={`${detail?.kind}-${detail?.id}`}>
            <button className="pk-detail-x" onClick={() => setDetail(null)} aria-label="Close details"><X size={14} /></button>
            {detailRole && (
              <>
                <div className="pk-kicker">work · experience</div>
                <h3 className="pk-detail-title">{detailRole.org}</h3>
                <p className="pk-detail-sub">{detailRole.role} · {detailRole.when}</p>
                <p className="pk-detail-body">{detailRole.what}</p>
                <div className="pk-minihead">what I took with me</div>
                <div className="pk-hone">{detailRole.taken.map((s) => <span key={s}>{s}</span>)}</div>
              </>
            )}
            {detailBuild && (
              <>
                <div className="pk-kicker">{CATS.find((c) => c.id === detailBuild.cat)?.label}</div>
                <h3 className="pk-detail-title">{detailBuild.name}</h3>
                <p className="pk-detail-sub">{detailBuild.tag}</p>
                <p className="pk-detail-body">{detailBuild.text}</p>
                <div className="pk-minihead">why it matters</div>
                <p className="pk-detail-body">{detailBuild.why}</p>
              </>
            )}
            <div className="pk-detail-foot">esc to close</div>
          </div>
        </aside>
      )}
    </main>
  );
}
