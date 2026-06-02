// Procedural "magic-hour" backdrop for artists without a portrait yet.
// Deterministic (seeded by slug) so each card is distinct but stable across
// server/client renders — no hydration mismatch, no randomness on reload.

function hash(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (h >>> 0) || 1;
}

function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function MagicBackdrop({ seed }: { seed: string }) {
  const h = hash(seed);
  const uid = h.toString(36);
  const r = makeRng(h);

  // Large soft moon / lantern glow, placed in the upper half.
  const moonX = 70 + r() * 260;
  const moonY = 70 + r() * 120;
  const moonR = 60 + r() * 55;

  // Starfield.
  const stars = Array.from({ length: 54 }, () => ({
    x: r() * 400,
    y: r() * 360,
    rad: 0.4 + r() * 1.7,
    o: 0.2 + r() * 0.6,
  }));

  // Floating glowing orbs (lanterns / bokeh) — the signature MSR mood.
  const warm = ["#e8b890", "#f3e8d8", "#c89878"];
  const orbs = Array.from({ length: 4 + Math.floor(r() * 3) }, () => ({
    x: 30 + r() * 340,
    y: 130 + r() * 280,
    rad: 7 + r() * 17,
    o: 0.35 + r() * 0.4,
    c: warm[Math.floor(r() * warm.length)],
  }));

  // Two skyline spires anchored to the horizon for a touch of structure.
  const spireA = 90 + r() * 90;
  const spireB = 240 + r() * 90;

  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <radialGradient id={`sky-${uid}`} cx="50%" cy="32%" r="85%">
          <stop offset="0%" stopColor="#2c2a64" />
          <stop offset="45%" stopColor="#24205a" />
          <stop offset="100%" stopColor="#161536" />
        </radialGradient>
        <linearGradient id={`horizon-${uid}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#c89878" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#8a6f93" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#8a6f93" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`moon-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f6ecdc" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#e8b890" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#e8b890" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`orb-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="40%" stopColor="currentColor" stopOpacity="0.7" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="400" height="500" fill={`url(#sky-${uid})`} />

      {/* Moon / lantern glow */}
      <circle cx={moonX} cy={moonY} r={moonR} fill={`url(#moon-${uid})`} />

      {/* Stars */}
      {stars.map((s, i) => (
        <circle
          key={`s${i}`}
          cx={s.x.toFixed(1)}
          cy={s.y.toFixed(1)}
          r={s.rad.toFixed(2)}
          fill="#f3e8d8"
          opacity={s.o.toFixed(2)}
        />
      ))}

      {/* Warm horizon glow */}
      <rect y="320" width="400" height="180" fill={`url(#horizon-${uid})`} />

      {/* Skyline silhouette */}
      <path
        d={`M0,500 L0,430 L${spireA - 18},430 L${spireA},388 L${spireA + 18},430 L${spireB - 22},430 L${spireB},395 L${spireB + 22},430 L400,430 L400,500 Z`}
        fill="#100f2c"
        opacity="0.82"
      />

      {/* Floating glowing orbs */}
      {orbs.map((o, i) => (
        <circle
          key={`o${i}`}
          cx={o.x.toFixed(1)}
          cy={o.y.toFixed(1)}
          r={o.rad.toFixed(1)}
          fill={`url(#orb-${uid})`}
          color={o.c}
          opacity={o.o.toFixed(2)}
        />
      ))}
    </svg>
  );
}
