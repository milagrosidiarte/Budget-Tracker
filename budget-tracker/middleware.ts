import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  let accessToken = req.cookies.get("sb-access-token")?.value;
  const refreshToken = req.cookies.get("sb-refresh-token")?.value;

  // Si no hay access token pero hay refresh token, intentar refrescar
  if (!accessToken && refreshToken) {
    try {
      const { data, error } = await supabaseServer.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (!error && data.session && data.user) {
        accessToken = data.session.access_token;

        // Crear respuesta con las nuevas cookies
        const res = NextResponse.next();
        res.cookies.set("sb-access-token", data.session.access_token, {
          httpOnly: true,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30, // 30 días
        });

        if (data.session.refresh_token) {
          res.cookies.set("sb-refresh-token", data.session.refresh_token, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30, // 30 días
          });
        }

        // Continuar con el acceso permitido
        return res;
      }
    } catch (error) {
      console.error("Error refrescando token:", error);
    }
  }

  // Si no hay token → redirigir al login
  if (!accessToken) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Intentar obtener el usuario desde Supabase
  const { data: { user }, error } = await supabaseServer.auth.getUser(accessToken);

  if (error || !user) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Si todo está bien, permitir acceso
  return NextResponse.next();
}

// Define en qué rutas aplica el middleware
export const config = {
  matcher: ["/dashboard/:path*"],
};
