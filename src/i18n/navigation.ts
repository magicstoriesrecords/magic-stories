import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware drop-in replacements for next/link & next/navigation.
// Always import Link/usePathname/useRouter from here inside pages/components,
// so hrefs keep the active locale prefix automatically.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
