import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
  await supabaseServer.auth.exchangeCodeForSession(request.url);

  return NextResponse.redirect(new URL("/", request.url));
}
// Esta ruta maneja el callback de OAuth y redirige al usuario a la página principal después de autenticarlo.
//Usuario recibe email con un enlace mágico de Supabase
//Hace clic en el enlace → redirige a /auth/callback con un código
//Esta ruta procesa el código:
//Intercambia el código por una sesión válida (exchangeCodeForSession)
//Crea la cookie JWT segura
//Redirige al home (/) si todo va bien