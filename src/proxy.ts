import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Renamed from middleware.ts -> proxy.ts for Next.js 16 (the "middleware"
// file convention is deprecated). Behaviour is unchanged: refresh the Supabase
// auth session on each request. Note: proxy always runs on the Node.js runtime.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Run on every path except static assets and image files.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico)$).*)",
  ],
};
