"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

// Generic "share as an Instagram Story" generator. Two layouts:
//   - news: title + short text + optional 3:2 artwork + date (set `title`)
//   - post: a Magic Library post rendered as a card (avatar, name, role pill,
//     body text, optional media, like/comment counts) + an invite + date.
// The caller passes a neutral `content` shape so the canvas stays
// format-agnostic.
export type StoryShareContent = {
  text: string; // main body (news: story/blurb; post: the post body)
  date: string; // ISO date
  fileSlug: string; // used for the downloaded filename (msr-<slug>.png)
  title?: string; // news headline → selects the news layout
  image?: string; // news artwork (3:2) OR a post's media thumbnail (16:9)
  imageRatio?: "3:2" | "16:9"; // artwork aspect (default 3:2)
  authorName?: string; // post author display name → selects the post card
  authorHandle?: string; // "@username"
  avatarUrl?: string; // post author avatar (best-effort; CORS may block it)
  roleLabel?: string; // localized role pill text (e.g. "Artist" / "Member")
  isArtist?: boolean; // pill styling (warm for artists)
  likeCount?: number;
  commentCount?: number;
  invite?: string; // footer line, e.g. "Join the Magic Library" (posts)
};

const STORY_BG = "/images/news-sky.png";
const LOGO = "/images/logo-mark.svg";

// 24×24 icon paths reused on the canvas (match the site's UI icons).
const HEART_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";
const BUBBLE_PATH =
  "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z";

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const r = Math.max(w / img.width, h / img.height);
  const dw = img.width * r;
  const dh = img.height * r;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function roundedPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Draws a 24×24 vector icon at (x, y) scaled to `size`, filled or stroked.
function drawIcon(
  ctx: CanvasRenderingContext2D,
  pathData: string,
  x: number,
  y: number,
  size: number,
  opts: { fill?: string; stroke?: string; lineWidth?: number },
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 24, size / 24);
  const p = new Path2D(pathData);
  if (opts.fill) {
    ctx.fillStyle = opts.fill;
    ctx.fill(p);
  }
  if (opts.stroke) {
    ctx.strokeStyle = opts.stroke;
    ctx.lineWidth = opts.lineWidth ?? 1.8;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke(p);
  }
  ctx.restore();
}

function fitLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxW: number,
  maxLines: number,
): string[] {
  const all = wrapLines(ctx, text, maxW);
  if (all.length <= maxLines) return all;
  const sentences = text.match(/[^.!?]+[.!?]+["”]?(\s+|$)/g) ?? [];
  let acc = "";
  for (const sen of sentences) {
    const test = (acc + sen).trim();
    if (wrapLines(ctx, test, maxW).length > maxLines) break;
    acc = test;
  }
  if (acc) return wrapLines(ctx, acc, maxW);
  const cut = all.slice(0, maxLines);
  cut[cut.length - 1] = cut[cut.length - 1].replace(/\s+\S*$/, "") + "…";
  return cut;
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const lines: string[] = [];
  for (const para of text.split(/\n+/)) {
    if (!para.trim()) continue;
    const words = para.split(/\s+/);
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
  }
  return lines;
}

function cssFontFamily(varName: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return v ? v + ", " + fallback : fallback;
}

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

// Role pill next to the author name. Returns its width.
function drawPill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  warm: boolean,
  serif: string,
): number {
  ctx.save();
  ctx.font = `600 22px ${serif}`;
  const label = text.toUpperCase();
  const padX = 18;
  const h = 40;
  const w = ctx.measureText(label).width + padX * 2;
  roundedPath(ctx, x, y, w, h, h / 2);
  ctx.fillStyle = warm ? "rgba(232,184,144,0.16)" : "rgba(243,232,216,0.10)";
  ctx.fill();
  ctx.strokeStyle = warm ? "rgba(232,184,144,0.55)" : "rgba(243,232,216,0.3)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = warm ? "rgba(244,206,170,0.96)" : "rgba(243,232,216,0.8)";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x + padX, y + h / 2 + 1);
  ctx.restore();
  return w;
}

function prettyDate(iso: string, locale: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale === "pl" ? "pl-PL" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ShareStory({ content }: { content: StoryShareContent }) {
  // Share-button labels are UI-generic; they live in the `news` namespace and
  // are reused here for posts too.
  const t = useTranslations("news");
  const locale = useLocale();
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

    const serif = cssFontFamily("--font-cinzel", "Georgia, serif");
    const sans = cssFontFamily("--font-inter", "system-ui, sans-serif");
    await document.fonts.ready;

    const isPost = !content.title;

    const [bg, logo, art, avatar] = await Promise.all([
      loadImage(STORY_BG),
      loadImage(LOGO),
      content.image ? loadImage(content.image) : Promise.resolve(null),
      content.avatarUrl ? loadImage(content.avatarUrl) : Promise.resolve(null),
    ]);

    // Background — sky art (cover) or a twilight gradient fallback.
    if (bg) {
      drawCover(ctx, bg, 0, 0, W, H);
    } else {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#1c1f52");
      g.addColorStop(1, "#100e28");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    // Readability veil.
    const veil = ctx.createLinearGradient(0, 0, 0, H);
    veil.addColorStop(0, "rgba(12,11,32,0.66)");
    veil.addColorStop(0.4, "rgba(12,11,32,0.22)");
    veil.addColorStop(0.62, "rgba(12,11,32,0.45)");
    veil.addColorStop(1, "rgba(8,7,22,0.90)");
    ctx.fillStyle = veil;
    ctx.fillRect(0, 0, W, H);

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    // ── Header: emblem + label name ──
    const logoW = isPost ? 168 : 232;
    let headerBottom: number;
    if (logo) {
      const lh = (logo.height / logo.width) * logoW;
      const ly = isPost ? 84 : 104;
      ctx.save();
      ctx.shadowColor = "rgba(8,7,24,0.55)";
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 6;
      ctx.drawImage(logo, (W - logoW) / 2, ly, logoW, lh);
      ctx.restore();
      ctx.fillStyle = "rgba(243,232,216,0.88)";
      ctx.font = `600 ${isPost ? 26 : 28}px ${serif}`;
      drawTracked(ctx, "MAGIC STORIES RECORDS", W / 2, ly + lh + (isPost ? 50 : 58), 8);
      headerBottom = ly + lh + (isPost ? 50 : 58);
    } else {
      ctx.fillStyle = "rgba(243,232,216,0.85)";
      ctx.font = `600 30px ${serif}`;
      drawTracked(ctx, "MAGIC STORIES RECORDS", W / 2, 150, 8);
      headerBottom = 185;
    }

    if (isPost) {
      drawPostCard(ctx, W, H, headerBottom, serif, sans, content, avatar, art);
    } else {
      drawNewsBody(ctx, W, H, headerBottom, serif, sans, content, art);
    }

    // ── Footer: optional invite line, then the date. ──
    if (content.invite) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "rgba(243,232,216,0.9)";
      ctx.font = `400 32px ${sans}`;
      ctx.shadowColor = "rgba(8,7,24,0.55)";
      ctx.shadowBlur = 16;
      ctx.fillText(content.invite, W / 2, H - 178);
      ctx.restore();
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "rgba(232,184,144,0.9)";
    ctx.font = `600 30px ${serif}`;
    drawTracked(ctx, prettyDate(content.date, locale).toUpperCase(), W / 2, H - 110, 5);

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
        setMsg(t("shareFailed"));
        return;
      }
      const fname = `msr-${content.fileSlug}.png`;
      const file = new File([blob], fname, { type: "image/png" });
      const shareTitle = content.title ?? content.authorName ?? "Magic Stories Records";

      const nav = navigator as Navigator & {
        canShare?: (data?: ShareData) => boolean;
      };
      if (nav.canShare && nav.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: shareTitle,
            text: `${shareTitle}, Magic Stories Records`,
          });
          setMsg("");
          return;
        } catch {
          // user cancelled or share failed → fall through to download
        }
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fname;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setMsg(t("shareDownloaded"));
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
        aria-label={t("shareAria")}
        title={t("shareTitle")}
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
        {busy ? "…" : t("share")}
      </button>
      {msg && <span className="max-w-[12rem] text-right font-sans text-[0.7rem] text-cream/50">{msg}</span>}
    </div>
  );
}

// ── News layout: optional 3:2 artwork, title, short text ──
function drawNewsBody(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  headerBottom: number,
  serif: string,
  sans: string,
  content: StoryShareContent,
  art: HTMLImageElement | null,
) {
  let textTop: number | null = null;
  if (art) {
    const pw = 880;
    const ph = content.imageRatio === "16:9" ? Math.round((pw * 9) / 16) : Math.round((pw * 2) / 3);
    const px = (W - pw) / 2;
    const py = Math.max(headerBottom + 96, 410);
    ctx.save();
    ctx.shadowColor = "rgba(4,3,16,0.6)";
    ctx.shadowBlur = 60;
    ctx.shadowOffsetY = 18;
    roundedPath(ctx, px, py, pw, ph, 28);
    ctx.fillStyle = "#171633";
    ctx.fill();
    ctx.restore();
    ctx.save();
    roundedPath(ctx, px, py, pw, ph, 28);
    ctx.clip();
    drawCover(ctx, art, px, py, pw, ph);
    ctx.restore();
    roundedPath(ctx, px, py, pw, ph, 28);
    ctx.strokeStyle = "rgba(243,232,216,0.22)";
    ctx.lineWidth = 2;
    ctx.stroke();
    textTop = py + ph + 116;
  }

  ctx.fillStyle = "#f3e8d8";
  ctx.font = art ? `400 76px ${serif}` : `400 96px ${serif}`;
  const maxTitleLines = art ? 3 : 5;
  const lines = wrapLines(ctx, content.title ?? "", W - 200).slice(0, maxTitleLines);
  const lineH = art ? 92 : 116;
  const blockH = lines.length * lineH;
  let ty = textTop ?? H / 2 - blockH / 2 + 80;
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

  ctx.fillStyle = "rgba(243,232,216,0.82)";
  ctx.font = art ? `400 31px ${sans}` : `400 35px ${sans}`;
  const textLines = fitLines(ctx, content.text, W - 240, art ? 5 : 6);
  let by = ty + (art ? 28 : 36);
  const textLineH = art ? 44 : 50;
  for (const ln of textLines) {
    ctx.fillText(ln, W / 2, by);
    by += textLineH;
  }
}

// ── Post layout: a card (avatar, name, role, body, media, like/comment) ──
function drawPostCard(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  headerBottom: number,
  serif: string,
  sans: string,
  content: StoryShareContent,
  avatar: HTMLImageElement | null,
  art: HTMLImageElement | null,
) {
  const P = 54;
  const cardW = 924;
  const cardX = (W - cardW) / 2;
  const innerW = cardW - P * 2;
  const av = 96;
  const bodyFont = `400 35px ${sans}`;
  const bodyLineH = 50;

  // Measure body (limit lines depending on whether there's media).
  ctx.font = bodyFont;
  const hasMedia = !!art;
  const bodyLines = fitLines(ctx, content.text, innerW, hasMedia ? 5 : 11);
  const textH = bodyLines.length * bodyLineH;

  const mediaW = innerW;
  const mediaH = hasMedia ? Math.round((mediaW * 9) / 16) : 0;

  const gapHeaderText = 38;
  const gapBeforeMedia = 30;
  const gapBeforeMeta = 34;
  const metaH = 40;

  let cardH = P + av + gapHeaderText + textH;
  if (hasMedia) cardH += gapBeforeMedia + mediaH;
  cardH += gapBeforeMeta + metaH + P;

  const topMin = headerBottom + 70;
  const bottomMax = H - 230;
  let cardY = topMin + (bottomMax - topMin - cardH) / 2;
  if (cardY < topMin) cardY = topMin;

  // Card background — soft glass with hairline + shadow.
  ctx.save();
  ctx.shadowColor = "rgba(4,3,16,0.55)";
  ctx.shadowBlur = 55;
  ctx.shadowOffsetY = 16;
  roundedPath(ctx, cardX, cardY, cardW, cardH, 34);
  ctx.fillStyle = "rgba(20,18,46,0.62)";
  ctx.fill();
  ctx.restore();
  roundedPath(ctx, cardX, cardY, cardW, cardH, 34);
  ctx.strokeStyle = "rgba(243,232,216,0.18)";
  ctx.lineWidth = 2;
  ctx.stroke();

  const cx = cardX + P;
  let cy = cardY + P;

  // Avatar (or initial-letter fallback).
  const initial = (content.authorName ?? content.authorHandle ?? "?")
    .replace(/^@/, "")
    .slice(0, 1)
    .toUpperCase();
  ctx.save();
  roundedPath(ctx, cx, cy, av, av, av / 2);
  ctx.clip();
  if (avatar) {
    drawCover(ctx, avatar, cx, cy, av, av);
  } else {
    ctx.fillStyle = "rgba(243,232,216,0.10)";
    ctx.fillRect(cx, cy, av, av);
    ctx.fillStyle = "rgba(243,232,216,0.85)";
    ctx.font = `400 44px ${serif}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initial, cx + av / 2, cy + av / 2 + 2);
  }
  ctx.restore();
  roundedPath(ctx, cx, cy, av, av, av / 2);
  ctx.strokeStyle = "rgba(243,232,216,0.25)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Name + role pill, handle beneath.
  const tx = cx + av + 26;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#f3e8d8";
  ctx.font = `400 42px ${serif}`;
  const name = content.authorName ?? "";
  ctx.fillText(name, tx, cy + 40);
  if (content.roleLabel) {
    const nameW = ctx.measureText(name).width;
    drawPill(ctx, tx + nameW + 20, cy + 8, content.roleLabel, !!content.isArtist, serif);
  }
  if (content.authorHandle) {
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "rgba(243,232,216,0.5)";
    ctx.font = `400 28px ${sans}`;
    ctx.fillText(content.authorHandle, tx, cy + 80);
  }

  cy += av + gapHeaderText;

  // Body text (left aligned).
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "rgba(243,232,216,0.92)";
  ctx.font = bodyFont;
  let by = cy + 36;
  for (const ln of bodyLines) {
    ctx.fillText(ln, cx, by);
    by += bodyLineH;
  }
  cy += textH;

  // Media (16:9), if linked.
  if (art) {
    cy += gapBeforeMedia;
    ctx.save();
    roundedPath(ctx, cx, cy, mediaW, mediaH, 20);
    ctx.clip();
    ctx.fillStyle = "#171633";
    ctx.fillRect(cx, cy, mediaW, mediaH);
    drawCover(ctx, art, cx, cy, mediaW, mediaH);
    ctx.restore();
    roundedPath(ctx, cx, cy, mediaW, mediaH, 20);
    ctx.strokeStyle = "rgba(243,232,216,0.18)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    cy += mediaH;
  }

  // Meta row: like + comment counts.
  cy += gapBeforeMeta;
  const iconSize = 34;
  const midY = cy + iconSize / 2;
  let mx = cx;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = `500 30px ${sans}`;

  drawIcon(ctx, HEART_PATH, mx, cy, iconSize, { fill: "rgba(232,184,144,0.9)" });
  mx += iconSize + 12;
  const likeStr = String(content.likeCount ?? 0);
  ctx.fillStyle = "rgba(243,232,216,0.78)";
  ctx.fillText(likeStr, mx, midY + 1);
  mx += ctx.measureText(likeStr).width + 46;

  drawIcon(ctx, BUBBLE_PATH, mx, cy + 1, iconSize, {
    stroke: "rgba(243,232,216,0.7)",
    lineWidth: 1.8,
  });
  mx += iconSize + 12;
  ctx.fillStyle = "rgba(243,232,216,0.78)";
  ctx.fillText(String(content.commentCount ?? 0), mx, midY + 1);
}
