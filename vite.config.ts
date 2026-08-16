import { readdirSync } from "node:fs";
import { extname } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";

const assetsDir = fileURLToPath(new URL("./assets", import.meta.url));

/**
 * The live routes load images from `/images/<name>.<ext>`, which Zo Space serves
 * from its own uploads. Locally, resolve those against `assets/` (whose files carry
 * an upload hash) and fall back to a labelled placeholder so layout still previews.
 */
function zoImages(): Plugin {
  return {
    name: "zo-images",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url ?? "").split("?")[0];
        const match = /^\/images\/(.+)$/.exec(path);
        if (!match) return next();

        const requested = match[1];
        const stem = requested.slice(0, requested.length - extname(requested).length);
        const local = readdirSync(assetsDir).find((file) => file.startsWith(`${stem}-`) || file === requested);

        if (local) {
          req.url = `/@fs${assetsDir}/${local}`;
          return next();
        }

        res.setHeader("Content-Type", "image/svg+xml");
        res.end(placeholderSvg(stem));
      });
    },
  };
}

function placeholderSvg(label: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
  <rect width="400" height="500" fill="#EAE2CE"/>
  <rect x="8" y="8" width="384" height="484" fill="none" stroke="#141414" stroke-width="4" stroke-dasharray="14 10"/>
  <text x="200" y="240" text-anchor="middle" font-family="monospace" font-size="20" fill="#141414">${label}</text>
  <text x="200" y="272" text-anchor="middle" font-family="monospace" font-size="14" fill="#6B6558">served by Zo, not in repo</text>
</svg>`;
}

export default defineConfig({
  plugins: [react(), tailwindcss(), zoImages()],
  resolve: {
    alias: [
      // The routes pin three from esm.sh so Zo can load it without a bundler.
      // Point that specifier at the local package for preview and type-checking.
      { find: /^https:\/\/esm\.sh\/three@[\d.]+$/, replacement: "three" },
    ],
  },
});
