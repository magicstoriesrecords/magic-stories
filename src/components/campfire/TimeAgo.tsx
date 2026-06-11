"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { timeAgo } from "@/lib/time";

// Initial label is computed during render; the element carries
// suppressHydrationWarning because relative time depends on the clock and may
// differ slightly between server render and client hydration. The interval
// keeps it fresh without a synchronous setState in the effect body.
export default function TimeAgo({ iso }: { iso: string }) {
  const locale = useLocale();
  // Recomputed on every render (locale/iso changes re-render anyway); the
  // interval only nudges a re-render once a minute to keep the label fresh.
  const label = timeAgo(iso, locale);
  const [, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <time
      dateTime={iso}
      title={new Date(iso).toLocaleString(locale === "en" ? "en-US" : "pl-PL")}
      suppressHydrationWarning
    >
      {label}
    </time>
  );
}
