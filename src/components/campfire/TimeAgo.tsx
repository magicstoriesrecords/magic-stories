"use client";

import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/time";

// Initial label is computed during render; the element carries
// suppressHydrationWarning because relative time depends on the clock and may
// differ slightly between server render and client hydration. The interval
// keeps it fresh without a synchronous setState in the effect body.
export default function TimeAgo({ iso }: { iso: string }) {
  const [label, setLabel] = useState(() => timeAgo(iso));

  useEffect(() => {
    const t = setInterval(() => setLabel(timeAgo(iso)), 60_000);
    return () => clearInterval(t);
  }, [iso]);

  return (
    <time dateTime={iso} title={new Date(iso).toLocaleString("pl-PL")} suppressHydrationWarning>
      {label}
    </time>
  );
}
