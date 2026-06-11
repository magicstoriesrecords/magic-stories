import { type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

// Renamed from middleware.ts -> proxy.ts for Next.js 16 (the "middleware"
// file convention is deprecated). Two jobs, composed in order:
//  1. next-intl locale routing (redirect /pl prefix, set NEXT_LOCALE cookie)
//  2. Supabase session refresh (auth cookies attached to the i18n response)
// Note: proxy always runs on the Node.js runtime.
const handleI18nRouting = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // OAuth callback and other /auth routes are locale-less route handlers —
  // skip i18n routing there, but still refresh the session.
  if (pathname.startsWith("/auth")) {
    return await updateSession(request);
  }

  const intlResponse = handleI18nRouting(request);
  return await updateSession(request, intlResponse);
}

export const config = {
  matcher: [
    // Run on every path except static assets and image files.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico)$).*)",
  ],
};
