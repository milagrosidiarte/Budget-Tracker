import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json();

    // Validaciones básicas
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Email, password y fullName son requeridos" },
        { status: 400 }
      );
    }

    // Crear cliente Supabase para el registro público
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 1. Crear usuario en Supabase Auth usando signUp (público)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError) {
      console.error("Supabase auth error:", authError);
      
      // Error de webhook/autenticación
      if (authError.message?.toLowerCase().includes("hook requires authorization token")) {
        return NextResponse.json(
          { 
            error: "Error de configuración en el servidor. Por favor intenta más tarde.",
            details: "Webhook authentication issue"
          },
          { status: 500 }
        );
      }
      
      if (authError.message?.toLowerCase().includes("rate limit")) {
        return NextResponse.json(
          { error: "Demasiados intentos. Por favor intenta más tarde." },
          { status: 429 }
        );
      }
      if (authError.message?.toLowerCase().includes("already registered")) {
        return NextResponse.json(
          { error: "El email ya está registrado" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: authError.message || "Error al registrarse" },
        { status: 400 }
      );
    }

    const userId = authData.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "No se pudo obtener el ID del usuario" },
        { status: 400 }
      );
    }

    // 2. Crear perfil del usuario (opcional - comentado si tabla no existe)
    try {
      // Solo intentar crear perfil si es necesario
      // Por ahora comentado para evitar errores de autorización
      /*
      const { error: profileError } = await supabaseServer
        .from("profiles")
        .insert([
          {
            id: userId,
            email: email,
            full_name: fullName,
          },
        ]);

      if (profileError) {
        console.log("Error creating profile:", profileError);
        // No fallar si no existe la tabla profiles
      }
      */
    } catch (err) {
      console.log("Profile creation optional error:", err);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Usuario creado. Verifica tu email para confirmar la cuenta",
        user: { id: userId, email: authData.user?.email },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error en POST /api/register:", err);
    const errorMessage = err instanceof Error ? err.message : "Error al crear el usuario";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
