import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = loginSchema.parse(body);

    // Crear cliente Supabase (público)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 1. Intentar login con Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

    if (authError) {
      return NextResponse.json(
        { success: false, message: authError.message },
        { status: 400 }
      );
    }

    const user = authData.user;
    const session = authData.session;

    if (!user || !session) {
      return NextResponse.json(
        { success: false, message: "No se pudo obtener usuario o sesión" },
        { status: 400 }
      );
    }

    // 2. Verificar que el email está confirmado
    if (!user.email_confirmed_at) {
      return NextResponse.json(
        { success: false, message: "Por favor confirma tu email antes de iniciar sesión" },
        { status: 400 }
      );
    }

    // 3. Guardar tokens en cookies HTTP-only para persistencia de sesión
    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || "",
      },
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_in: session.expires_in,
        expires_at: session.expires_at,
      },
    });

    const secure = process.env.NODE_ENV === "production";
    const sameSite = process.env.NODE_ENV === "production" ? "strict" : "lax";
    console.log(`[LOGIN] Setting cookies (secure: ${secure}, sameSite: ${sameSite}) for user: ${user.email}`);

    res.cookies.set("sb-access-token", session.access_token, {
      httpOnly: true,
      path: "/",
      secure: secure,
      sameSite: sameSite as any,
      maxAge: 60 * 60 * 24 * 30, // 30 días
    });

    res.cookies.set("sb-refresh-token", session.refresh_token, {
      httpOnly: true,
      path: "/",
      secure: secure,
      sameSite: sameSite as any,
      maxAge: 60 * 60 * 24 * 30, // 30 días
    });

    console.log("[LOGIN] ✓ Cookies set successfully");
    return res;
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al iniciar sesión";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 400 }
    );
  }
}
