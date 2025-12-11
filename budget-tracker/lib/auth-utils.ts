import { createClient } from "./supabase-client";

export async function getAuthToken(): Promise<string> {
  try {
    const supabaseClient = createClient();
    const {
      data: { session },
      error,
    } = await supabaseClient.auth.getSession();

    if (error) {
      console.error("Error getting session:", error);
      throw new Error(`No se pudo obtener la sesión: ${error.message}`);
    }

    if (!session) {
      console.error("No session found in storage or auth");
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
