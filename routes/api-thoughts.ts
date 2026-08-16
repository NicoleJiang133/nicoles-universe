import { appendFile } from "node:fs/promises";
import type { Context } from "hono";

const FILE = process.env.THOUGHTS_FILE ?? "/home/workspace/nicoles-universe/thoughts.jsonl";

const rate = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function limited(ip: string): boolean {
  const now = Date.now();
  for (const [key, times] of rate) {
    const live = times.filter((t) => now - t < WINDOW_MS);
    if (live.length) rate.set(key, live);
    else rate.delete(key);
  }
  const hits = rate.get(ip) ?? [];
  if (hits.length >= MAX_PER_WINDOW) return true;
  hits.push(now);
  rate.set(ip, hits);
  return false;
}

/** x-forwarded-for is a list; the client is the first entry. */
function clientIp(c: Context): string {
  const header = c.req.header("x-forwarded-for");
  return header?.split(",")[0].trim() || "anon";
}

async function notifyNicole(text: string, from: string) {
  const key = process.env.ZO_API_KEY;
  if (!key) return;
  try {
    await fetch("https://api.zo.computer/zo/ask", {
      method: "POST",
      headers: {
        authorization: key,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        model_name: "vercel:moonshotai/kimi-k3",
        input: `Someone left a thought on Nicole's personal website sticker wall.\nFrom: ${from || "anonymous"}\nThought: ${text}\n\nSend Nicole one short email with subject "New thought on your sticker wall" containing the thought and sender verbatim, plus one warm closing line. Use send_email_to_user. Then stop.`,
      }),
    });
  } catch {
    // notification is best-effort; the thought is already stored
  }
}

export default async (c: Context) => {
  if (c.req.method !== "POST") return c.json({ ok: false, error: "method" }, 405);

  if (limited(clientIp(c))) return c.json({ ok: false, error: "slow down" }, 429);

  let body: { text?: unknown; from?: unknown };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ ok: false, error: "bad json" }, 400);
  }

  const text = String(body.text ?? "").trim().slice(0, 500);
  const from = String(body.from ?? "").trim().slice(0, 80);
  if (!text) return c.json({ ok: false, error: "empty" }, 400);

  const row = JSON.stringify({ ts: new Date().toISOString(), from, text }) + "\n";
  try {
    // A single append, so two thoughts landing together cannot overwrite each other.
    await appendFile(FILE, row, "utf8");
  } catch {
    return c.json({ ok: false, error: "store failed" }, 500);
  }

  void notifyNicole(text, from);
  return c.json({ ok: true });
};
