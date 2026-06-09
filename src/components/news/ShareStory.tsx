"use client";

import { useState } from "react";
import type { News } from "@/data/news";

// Background art reused for the generated story (same as the section backdrop).
const STORY_BG = "/images/news-sky.png";
const SITE = "magic-stories-three.vercel.app";

// Loads an image; resolves null on error so we can fall back to a gradient.
function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Draws `img` to cover an w*h box (object-fit: cover), centred.
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
) {
  const r = Math.max(w / img.width, h / img.height);
  const dw = img.width * r;
  const dh = img.height * r;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

// Wraps `text` to a max width, returns the lines.
function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Draws letter-spaced uppercase text centred at (cx, y). Returns nothing.
function drawTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  spacing: number,
) {
  const widths = [...text].map((ch) => ctx.measureText(ch).width + spacing);
  const total = widths.reduce((a, b) => a + b, 0) - spacing;
  let x = cx - total / 2;
  ctx.textAlign = "left";
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], x, y);
    x += widths[i];
  }
  ctx.textAlign = "center";
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
function prettyDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function ShareStory({ item }: { item: News }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function generate(): Promise<Blob | null> {
    const W = 1080;
    const H = 1920;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Background — sky art (cover) or a twilight gradient fallback.
    const bg = await loadImage(STORY_BG);
    if (bg) {
      drawCover(ctx, bg, W, H);
    } else {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#1c1f52");
      g.addColorStop(1, "#100e28");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    // Readability veil — darker top and bottom, where the type sits.
    const veil = ctx.createLinearGradient(0, 0, 0, H);
    veil.addColorStop(0, "rgba(12,11,32,0.62)");
    veil.addColorStop(0.4, "rgba(12,11,32,0.20)");
    veil.addColorStop(0.62, "rgba(12,11,32,0.45)");
    veil.addColorStop(1, "rgba(8,7,22,0.90)");
    ctx.fillStyle = veil;
    ctx.fillRect(0, 0, W, H);

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    // Kicker — label name, letter-spaced.
    ctx.fillStyle = "rgba(243,232,216,0.85)";
    ctx.font = "600 30px Georgia, 'Times New Roman', serif";
    drawTracked(ctx, "MAGIC STORIES RECORDS", W / 2, 150, 8);

    // Warm divider.
    ctx.strokeStyle = "rgba(232,184,144,0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 60, 185);
    ctx.lineTo(W / 2 + 60, 185);
    ctx.stroke();

    // Title — large serif, wrapped, vertically centred-ish.
    ctx.fillStyle = "#f3e8d8";
    ctx.font = "400 96px Georgia, 'Times New Roman', serif";
    const lines = wrapLines(ctx, item.title, W - 200);
    const lineH = 116;
    const blockH = lines.length * lineH;
    let ty = H / 2 - blockH / 2 + 80;
    ctx.shadowColor = "rgba(8,7,24,0.65)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 4;
    for (const ln of lines) {
      ctx.fillText(ln, W / 2, ty);
      ty += lineH;
    }
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Blurb — a couple of lines under the title.
    ctx.fillStyle = "rgba(243,232,216,0.82)";
    ctx.font = "400 38px Inter, system-ui, sans-serif";
    const blurbLines = wrapLines(ctx, item.blurb, W - 240).slice(0, 4);
    let by = ty + 36;
    for (const ln of blurbLines) {
      ctx.fillText(ln, W / 2, by);
      by += 52;
    }

    // Date.
    ctx.fillStyle = "rgba(232,184,144,0.9)";
    ctx.font = "600 30px Georgia, serif";
    drawTracked(ctx, prettyDate(item.date).toUpperCase(), W / 2, H - 150, 5);

    // Footer URL.
    ctx.fillStyle = "rgba(243,232,216,0.6)";
    ctx.font = "400 28px Inter, system-ui, sans-serif";
    ctx.fillText(SITE, W / 2, H - 90);

    return await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png", 0.95),
    );
  }

  async function handleShare() {
    if (busy) return;
    setBusy(true);
    setMsg("");
    try {
      const blob = await generate();
      if (!blob) {
        setMsg("Nie udało się wygenerować grafiki.");
        return;
      }
      const file = new File([blob], `msr-${item.slug}.png`, { type: "image/png" });

      const nav = navigator as Navigator & {
        canShare?: (data?: ShareData) => boolean;
      };
      if (nav.canShare && nav.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: item.title,
            text: `${item.title} — Magic Stories Records`,
          });
          setMsg("");
          return;
        } catch {
          // user cancelled or share failed → fall through to download
        }
      }

      // Fallback: download the image so it can be posted to IG Stories manually.
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `msr-${item.slug}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setMsg("Pobrano grafikę — wrzuć ją na Instagram Stories.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleShare}
        disabled={busy}
        aria-label="Udostępnij jako grafikę do Stories"
        title="Udostępnij / pobierz grafikę do Stories"
        className="group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-cream/55 transition-colors duration-150 hover:bg-cream/5 hover:text-cream disabled:opacity-60"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="transition-transform duration-150 group-active:scale-90"
        >
          <path
            d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v13M7 8l5-5 5 5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {busy ? "…" : "Share"}
      </button>
      {msg && <span className="max-w-[12rem] text-right font-sans text-[0.7rem] text-cream/50">{msg}</span>}
    </div>
  );
}
