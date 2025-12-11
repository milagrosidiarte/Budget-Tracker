import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
  await supabaseServer.auth.exchangeCodeForSession(request.url);

  return NextResponse.redirect(new URL("/", request.url));
}
//Esta ruta maneja la devolución de llamada de autenticación después de que el usuario hace clic en el enlace mágico en su correo electrónico.
//Esto finaliza la sesión y coloca la cookie con el JWT seguro.
