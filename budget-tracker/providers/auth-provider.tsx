"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase-client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Inicializar cliente Supabase y restaurar sesión de localStorage
    const client = createClient();
    
    // Solo escuchar cambios de autenticación sin hacer queries
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Guardar en localStorage para persistencia
        const tokenKey = `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0]}-auth-token`;
        localStorage.setItem(
          tokenKey,
          JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_in: session.expires_in,
            expires_at: session.expires_at,
          })
        );
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
