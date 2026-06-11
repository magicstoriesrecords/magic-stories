import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refreshes the Supabase auth session on every request and forwards the
// updated cookies to both the request and the response. Accepts an optional
// base response (e.g. the redirect/rewrite produced by the next-intl
// middleware) so auth cookies ride along with i18n routing.
export async function updateSession(
  request: NextRequest,
  baseResponse?: NextResponse,
) {
  let supabaseResponse = baseResponse ?? NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          // Preserve the i18n response (redirect/rewrite + its cookies) if we
          // were given one; otherwise mint a fresh pass-through response.
          if (!baseResponse) {
            supabaseResponse = NextResponse.next({ request });
          }
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: getUser() must be called to revalidate the session token.
  await supabase.auth.getUser();

  return supabaseResponse;
}
