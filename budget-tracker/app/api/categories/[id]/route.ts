import { supabaseServer } from "@/lib/supabase-server";
import { validateAuth } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

// PATCH - actualizar una categoría
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { authenticated, user, response } = await validateAuth(request);

    if (!authenticated) {
      return response;
    }

    // Verificar que la categoría pertenezca al usuario
    const { data: category, error: checkError } = await supabaseServer
      .from("categories")
      .select("id")
      .eq("id", id)
      .eq("user_id", user!.id)
      .single();

    if (checkError || !category) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const { data: updated, error: updateError } = await supabaseServer
      .from("categories")
      .update({
        ...(body.name && { name: body.name }),
        ...(body.color !== undefined && { color: body.color }),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/categories/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - eliminar una categoría
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { authenticated, user, response } = await validateAuth(request);

    if (!authenticated) {
      return response;
    }

    // Verificar que la categoría pertenezca al usuario
    const { data: category, error: checkError } = await supabaseServer
      .from("categories")
      .select("id")
      .eq("id", id)
      .eq("user_id", user!.id)
      .single();

    if (checkError || !category) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    // Verificar que no hay transacciones usando esta categoría
    const { data: transactions } = await supabaseServer
      .from("transactions")
      .select("id")
      .eq("category", id)
      .limit(1);

    if (transactions && transactions.length > 0) {
      return NextResponse.json(
        { error: "No se puede eliminar una categoría que está siendo utilizada" },
        { status: 409 }
      );
    }

    const { error: deleteError } = await supabaseServer
      .from("categories")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/categories/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
