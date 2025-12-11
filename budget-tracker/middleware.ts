import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  
  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ["/dashboard", "/budgets"];
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Verificar si hay token en cookies
    const accessToken = req.cookies.get("sb-access-token")?.value;
    
    // Si no hay token, redirigir a login
    if (!accessToken) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Define en qué rutas aplica el middleware
export const config = {
  matcher: ["/dashboard/:path*", "/budgets/:path*"],
};
