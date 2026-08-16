import { Suspense, lazy, useState } from "react";

/**
 * Local stand-in for Zo Space's routing. Each entry is one live route, loaded lazily
 * so a broken route cannot take the others down with it.
 */
const ROUTES = [
  { path: "/", label: "home", file: "home.tsx", load: lazy(() => import("../routes/home")) },
  { path: "/lab", label: "lab", file: "lab.tsx", load: lazy(() => import("../routes/lab")) },
  { path: "/work", label: "work", file: "work.tsx", load: lazy(() => import("../routes/work")) },
  { path: "/about", label: "about", file: "about.tsx", load: lazy(() => import("../routes/about")) },
  { path: "/contact", label: "contact", file: "contact.tsx", load: lazy(() => import("../routes/contact")) },
  { path: "/play", label: "play", file: "play.tsx", load: lazy(() => import("../routes/play")) },
];

export function Preview() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const match = ROUTES.find((route) => route.path === path);

  return (
    <>
      <Suspense fallback={null}>{match ? <match.load /> : <RouteIndex path={path} />}</Suspense>
      <Switcher current={path} />
    </>
  );
}

function RouteIndex({ path }: { path: string }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F4EDDE", color: "#141414", padding: "12vh 6vw", fontFamily: "ui-monospace, Menlo, monospace" }}>
      <p style={{ letterSpacing: ".14em", textTransform: "uppercase", fontSize: 11, color: "#6B6558" }}>local preview</p>
      <h1 style={{ font: "900 clamp(30px, 6vw, 54px)/1 ui-sans-serif, Inter, sans-serif", letterSpacing: "-.03em", textTransform: "uppercase" }}>
        {path === "/" ? "No route mounted" : `Nothing at ${path}`}
      </h1>
      <p style={{ maxWidth: 560, fontSize: 14, lineHeight: 1.6, color: "#6B6558" }}>
        This shell only mirrors the routes kept in <code>routes/</code>. Pick one:
      </p>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8, maxWidth: 420 }}>
        {ROUTES.map((route) => (
          <li key={route.path}>
            <a href={route.path} style={{ display: "flex", justifyContent: "space-between", border: "3px solid #141414", borderRadius: 12, background: "#FFFDF7", boxShadow: "4px 4px 0 #141414", padding: "12px 14px", color: "#141414", textDecoration: "none", fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase" }}>
              <b>{route.path}</b>
              <span style={{ color: "#6B6558" }}>{route.file}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Preview-only chrome. Collapsed by default so it never sits on top of a design. */
function Switcher({ current }: { current: string }) {
  const [open, setOpen] = useState(false);
  const chip = {
    border: "2px solid #141414",
    borderRadius: 999,
    background: "#FFFDF7",
    padding: "6px 11px",
    font: "700 10px ui-monospace, Menlo, monospace",
    letterSpacing: ".1em",
    textTransform: "uppercase" as const,
    color: "#141414",
    textDecoration: "none",
    cursor: "pointer",
  };

  return (
    <div style={{ position: "fixed", right: 12, bottom: 12, zIndex: 2147483647, display: "flex", alignItems: "center", gap: 6 }}>
      {open &&
        ROUTES.map((route) => (
          <a key={route.path} href={route.path} style={{ ...chip, background: route.path === current ? "#D6FF3D" : "#FFFDF7" }}>
            {route.label}
          </a>
        ))}
      <button type="button" onClick={() => setOpen((value) => !value)} style={{ ...chip, background: "#141414", color: "#D6FF3D" }} aria-expanded={open}>
        {open ? "close" : "routes"}
      </button>
    </div>
  );
}
