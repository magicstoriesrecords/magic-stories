"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  strength?: number; // px of travel across the viewport; keep small + subtle
};

// Subtle vertical parallax tied to scroll position.
// Active only on desktop (>=768px) and when motion is allowed — on phones the
// movement made cut-out portraits shift/misalign while scrolling, so it's off.
// Only does work while the element is on screen (IntersectionObserver-gated).
export default function Parallax({
  children,
  className = "",
  strength = 24,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const desktop = window.matchMedia("(min-width: 768px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let inView = false;
    let io: IntersectionObserver | null = null;
    let on = false;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress =
        (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, progress));
      el.style.transform = `translate3d(0, ${(-clamped * strength).toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (inView && !raf) raf = requestAnimationFrame(update);
    };

    const enable = () => {
      if (on) return;
      on = true;
      io = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          el.style.willChange = inView ? "transform" : "auto";
          if (inView) update();
        },
        { rootMargin: "120px 0px" },
      );
      io.observe(el);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
    };

    const disable = () => {
      if (!on) return;
      on = false;
      io?.disconnect();
      io = null;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      // reset so the portrait sits exactly where layout puts it
      el.style.transform = "";
      el.style.willChange = "auto";
    };

    const evaluate = () => {
      if (desktop.matches && !reduce.matches) enable();
      else disable();
    };

    evaluate();
    desktop.addEventListener("change", evaluate);
    reduce.addEventListener("change", evaluate);
    return () => {
      desktop.removeEventListener("change", evaluate);
      reduce.removeEventListener("change", evaluate);
      disable();
    };
  }, [strength]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
