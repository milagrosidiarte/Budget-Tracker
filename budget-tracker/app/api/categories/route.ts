import { supabaseServer } from "@/lib/supabase-server";
import { validateAuth } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

// GET - obtener todas las categorías del usuario
export async function GET(request: NextRequest) {
  try {
    const { authenticated, user, response } = await validateAuth(request);

    if (!authenticated) {
      return response;
    }

    console.log(`[CATEGORIES] Fetching categories for user ${user!.id}`);

    const { data: categories, error } = await supabaseServer
      .from("categories")
      .select("*")
      .eq("user_id", user!.id)
      .order("name", { ascending: true });

    if (error) {
      console.error("[CATEGORIES] Fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`[CATEGORIES] ✓ Found ${categories?.length || 0} categories`);

    return NextResponse.json(categories || []);
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - crear una nueva categoría
export async function POST(request: NextRequest) {
  try {
    const { authenticated, user, response } = await validateAuth(request);

    if (!authenticated) {
      return response;
    }

    const body = await request.json();
    const { name, color } = body;
    
    console.log(`[CATEGORIES] Creating category: ${name} (color: ${color})`);
    console.log(`[CATEGORIES] User ID: ${user!.id}`);
    console.log(`[CATEGORIES] User object:`, JSON.stringify(user));

    if (!name) {
      return NextResponse.json(
        { error: "El nombre de la categoría es requerido" },
        { status: 400 }
      );
    }

    // Verificar que la categoría no exista ya
    const { data: existing, error: existingError } = await supabaseServer
      .from("categories")
      .select("id")
      .eq("user_id", user!.id)
      .eq("name", name)
      .single();

    if (existingError && existingError.code !== "PGRST116") {
      console.error("[CATEGORIES] Error checking existing:", existingError);
      return NextResponse.json({ error: existingError.message }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json(
        { error: "Ya existe una categoría con ese nombre" },
        { status: 409 }
      );
    }

    console.log(`[CATEGORIES] Inserting with user_id: ${user!.id}`);
    
    const { data: category, error } = await supabaseServer
      .from("categories")
      .insert({
        user_id: user!.id,
        name,
        color: color || "#3B82F6", // Color azul por defecto
      })
      .select()
      .single();

    if (error) {
      console.error("[CATEGORIES] Insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    console.log(`[CATEGORIES] ✓ Category created: ${category.id}`);

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
