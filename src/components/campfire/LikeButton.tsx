"use client";

import { useState } from "react";

export default function LikeButton({
  liked,
  count,
  disabled,
  onClick,
}: {
  liked: boolean;
  count: number;
  disabled?: boolean;
  onClick: () => void;
}) {
  const [pop, setPop] = useState(false);

  function handle() {
    if (!liked) {
      setPop(true);
      window.setTimeout(() => setPop(false), 380);
    }
    onClick();
  }

  return (
    <button
      type="button"
      onClick={handle}
      disabled={disabled}
      aria-pressed={liked}
      aria-label={liked ? "Cofnij polubienie" : "Polub"}
      title={disabled ? "Zaloguj się, aby reagować" : liked ? "Cofnij polubienie" : "Polub"}
      className={`group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-150 disabled:cursor-default disabled:opacity-60 ${
        liked
          ? "text-rose-300 hover:bg-rose-300/10"
          : "text-cream/55 hover:bg-cream/5 hover:text-rose-200"
      }`}
    >
      <span className={pop ? "animate-heart-pop" : ""}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={liked ? "currentColor" : "none"}
          aria-hidden="true"
          className="transition-transform duration-150 group-active:scale-90"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {count > 0 && <span className="tabular-nums">{count}</span>}
    </button>
  );
}
