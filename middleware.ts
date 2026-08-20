import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Rotte pubbliche e dashboard hanno due esigenze diverse:
//   /gestione*  → controllo sessione Supabase (invariato)
//   tutto il resto → instradamento per lingua, senza chiamate di rete
// Il controllo di sessione resta confinato a /gestione: farlo girare
// anche sulle pagine pubbliche aggiungerebbe una chiamata a Supabase
// per ogni visita, senza servire a nulla.
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/gestione")) {
    return gestioneAuth(request);
  }
  return instradaLingua(request);
}

// L'italiano vive sull'URL radice: "/" viene riscritto internamente
// su "/it" perché l'albero delle rotte è app/(public)/[locale]/, ma
// l'URL mostrato resta senza prefisso. L'inglese passa così com'è.
function instradaLingua(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.next();
  }

  // "/it/..." non deve esistere come URL pubblico: sarebbe un
  // doppione dell'italiano già servito su "/", con il rischio di
  // contenuti duplicati per i motori di ricerca.
  if (pathname === "/it" || pathname.startsWith("/it/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/it" ? "/" : pathname.slice(3);
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/it" : `/it${pathname}`;
  return NextResponse.rewrite(url);
}

async function gestioneAuth(request: NextRequest) {
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
  // Tutto tranne le risorse interne di Next, le API e i file con
  // estensione (icone, immagini social, asset del marchio): quelli
  // non vanno né riscritti per lingua né passati dal controllo auth.
  matcher: ["/((?!_next/static|_next/image|api/|.*\\.).*)"],
};
