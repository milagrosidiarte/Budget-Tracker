import { cookies } from "next/headers";
import { supabaseServer } from "./supabase-server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Obtiene el usuario autenticado desde las cookies (http-only)
 */
export async function getAuthenticatedUser(request?: NextRequest) {
  try {
    let token: string | undefined;

    if (request) {
      // En API routes, obtener del request
      const cookieStore = request.cookies;
      token = cookieStore.get("sb-access-token")?.value;
      const allCookies = request.cookies.getAll();
      console.log(`[AUTH] Request has ${allCookies.length} cookies:`, allCookies.map(c => c.name));
      console.log("[AUTH] Token from request cookies:", token ? `✓ Found (${token.substring(0, 20)}...)` : "✗ Not found");
    } else {
      // En server components, obtener de la store global
      const cookieStore = await cookies();
      token = cookieStore.get("sb-access-token")?.value;
      console.log("[AUTH] Token from global cookies:", token ? `✓ Found (${token.substring(0, 20)}...)` : "✗ Not found");
    }

    if (!token) {
      console.log("[AUTH] ✗ No token found - Unauthorized");
      return {
        user: null,
        error: "No token found",
      };
    }

    // Verificar el token con Supabase
    console.log("[AUTH] Verifying token with Supabase...");
    const { data, error } = await supabaseServer.auth.getUser(token);

    if (error || !data.user) {
      console.log("[AUTH] ✗ Invalid token:", error?.message);
      return {
        user: null,
        error: error?.message || "Invalid token",
      };
    }

    console.log("[AUTH] ✓ User authenticated:", data.user.id);
    return {
      user: data.user,
      error: null,
    };
  } catch (error) {
    console.error("[AUTH] ✗ getAuthenticatedUser error:", error);
    return {
      user: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Middleware helper para validar autenticación en API routes
 * Retorna un objeto discriminado que TypeScript puede entender correctamente
 */
export async function validateAuth(request: NextRequest): Promise<
  | { authenticated: true; user: any; response: null }
  | { authenticated: false; user: null; response: NextResponse }
> {
  const { user, error } = await getAuthenticatedUser(request);

  if (!user || error) {
    console.log("[VALIDATE_AUTH] ✗ Authentication failed:", error);
    return {
      authenticated: false,
      user: null,
      response: NextResponse.json({ error: "Unauthorized", details: error }, { status: 401 }),
    };
  }

  console.log("[VALIDATE_AUTH] ✓ Authentication successful for user:", user.id);
  return {
    authenticated: true,
    user,
    response: null,
  };
}
