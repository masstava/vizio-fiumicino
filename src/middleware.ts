import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Costruisce la response e aggiorna i cookie di sessione Supabase
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANTE: nessuna logica tra createServerClient e getUser()
  // per evitare problemi di refresh del token.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protegge /gestione e tutto ciò che c'è sotto, tranne /gestione/login
  if (
    pathname.startsWith("/gestione") &&
    !pathname.startsWith("/gestione/login")
  ) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/gestione/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  // Rimanda al pannello chi è già autenticato e torna al login
  if (pathname.startsWith("/gestione/login") && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/gestione";
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/gestione", "/gestione/:path*"],
};
