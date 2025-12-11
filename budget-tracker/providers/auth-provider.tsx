"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase-client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Inicializar cliente Supabase y restaurar sesión de localStorage
    const client = createClient();
    
    // Supabase se encargará automáticamente de restaurar la sesión
    // si está guardada en localStorage
    client.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Guardar en localStorage para persistencia
        localStorage.setItem(
          `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0]}-auth-token`,
          JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_in: session.expires_in,
            expires_at: session.expires_at,
          })
        );
      }
    });
  }, []);

  return <>{children}</>;
}
