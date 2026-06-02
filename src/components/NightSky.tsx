// Full-bleed "magic-hour" night sky behind the Authors spreads.
// Static, deterministic starfield (no hydration mismatch).

function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function NightSky() {
  const r = makeRng(20260601);
  const stars = Array.from({ length: 150 }, () => ({
    x: r() * 1440,
    y: r() * 900,
    rad: 0.3 + r() * 1.6,
    o: 0.12 + r() * 0.6,
  }));

  return (
    <div className="absolute inset-0 -z-0 overflow-hidden" aria-hidden>
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          <radialGradient id="ns-sky" cx="50%" cy="18%" r="95%">
            <stop offset="0%" stopColor="#2a2660" />
            <stop offset="45%" stopColor="#201d4c" />
            <stop offset="100%" stopColor="#141230" />
          </radialGradient>
          <radialGradient id="ns-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f3e8d8" stopOpacity="0.5" />
            <stop offset="40%" stopColor="#e8b890" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#e8b890" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ns-glow2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#b9a6e0" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#b9a6e0" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ns-cloud" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7d6aa6" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#9a82b8" stopOpacity="0.5" />
          </linearGradient>
          <filter id="ns-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="42" />
          </filter>
        </defs>

        <rect width="1440" height="900" fill="url(#ns-sky)" />

        {/* Soft ambient glows */}
        <circle cx="500" cy="170" r="320" fill="url(#ns-glow)" />
        <circle cx="1180" cy="380" r="360" fill="url(#ns-glow2)" />

        {/* Cloud bands */}
        <g filter="url(#ns-blur)" opacity="0.7">
          <ellipse cx="360" cy="840" rx="520" ry="120" fill="url(#ns-cloud)" />
          <ellipse cx="1120" cy="880" rx="560" ry="140" fill="url(#ns-cloud)" />
          <ellipse cx="760" cy="760" rx="420" ry="90" fill="#8a74ad" opacity="0.35" />
        </g>

        {/* Stars */}
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={s.x.toFixed(1)}
            cy={s.y.toFixed(1)}
            r={s.rad.toFixed(2)}
            fill="#f3e8d8"
            opacity={s.o.toFixed(2)}
          />
        ))}
      </svg>
    </div>
  );
}
