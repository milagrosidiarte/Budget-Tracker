import { createClient } from "./supabase-client";

export async function getAuthToken(): Promise<string> {
  const supabaseClient = createClient();
  const {
    data: { session },
    error,
  } = await supabaseClient.auth.getSession();

  if (error || !session) {
    throw new Error("No authenticated session");
  }

  return session.access_token;
}

export async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
