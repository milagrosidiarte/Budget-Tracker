import { createClient } from "./supabase-client";
import { cookies } from "next/headers";

export async function getAuthToken(): Promise<string> {
  try {
    // Intentar obtener el token desde cookies (lado servidor)
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;

    if (token) {
      return token;
    }

    // Fallback: obtener de la sesión del cliente
    const supabaseClient = createClient();
    const {
      data: { session },
      error,
    } = await supabaseClient.auth.getSession();

    if (error) {
      console.error("Error getting session:", error);
      throw new Error(`Authentication error: ${error.message}`);
    }

    if (!session?.access_token) {
      throw new Error("No authenticated session. Please log in first.");
    }

    return session.access_token;
  } catch (error) {
    console.error("getAuthToken error:", error);
    throw error;
  }
}

export async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
