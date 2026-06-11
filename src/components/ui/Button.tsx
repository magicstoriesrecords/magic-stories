import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

type Variant = "glass" | "ghost";
type Size = "sm" | "lg";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

const base =
  "inline-flex items-center justify-center whitespace-nowrap focus-visible:outline-none";

// Glass visuals (rim, glow, sparkle, hover) live in .liquid-glass.
const variants: Record<Variant, string> = {
  glass: "liquid-glass rounded-full",
  ghost: "font-sans text-twilight transition-colors hover:text-cream",
};

// Padding/size matched to the approved hero preview (btn-sm / btn-lg).
const sizes: Record<Size, string> = {
  sm: "px-6 py-2.5 text-sm",
  lg: "px-12 py-[1.1rem] text-[0.95rem]",
};

export default function Button({
  href,
  children,
  variant = "glass",
  size = "sm",
  className = "",
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
