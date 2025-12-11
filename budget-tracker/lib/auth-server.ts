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
    } else {
      // En server components, obtener de la store global
      const cookieStore = await cookies();
      token = cookieStore.get("sb-access-token")?.value;
    }

    if (!token) {
      return {
        user: null,
        error: "No token found",
      };
    }

    // Verificar el token con Supabase
    const { data, error } = await supabaseServer.auth.getUser(token);

    if (error || !data.user) {
      return {
        user: null,
        error: error?.message || "Invalid token",
      };
    }

    return {
      user: data.user,
      error: null,
    };
  } catch (error) {
    console.error("getAuthenticatedUser error:", error);
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
    return {
      authenticated: false,
      user: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return {
    authenticated: true,
    user,
    response: null,
  };
}
