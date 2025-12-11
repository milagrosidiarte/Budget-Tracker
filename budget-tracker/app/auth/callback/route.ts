import { NextResponse } from "next/server";
import { createServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createServer();
  await supabase.auth.exchangeCodeForSession(request.url);

  return NextResponse.redirect(new URL("/", request.url));
}
//Esta ruta maneja la devolución de llamada de autenticación después de que el usuario hace clic en el enlace mágico en su correo electrónico.
//Esto finaliza la sesión y coloca la cookie con el JWT seguro.
