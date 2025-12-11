import { supabaseServer } from "@/lib/supabase-server";
import { validateAuth } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { authenticated, user, response } = await validateAuth(request);

    if (!authenticated) {
      return response;
    }

    const { data: budget, error: budgetError } = await supabaseServer
      .from("budgets")
      .select("*")
      .eq("id", id)
      .eq("user_id", user!.id)
      .single();

    if (budgetError) {
      return NextResponse.json(
        { error: "Budget not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(budget);
  } catch (error) {
    console.error("GET /api/budgets/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    // Check if budget belongs to user
    const { data: budget, error: checkError } = await supabaseServer
      .from("budgets")
      .select("id")
      .eq("id", id)
      .eq("user_id", user!.id)
      .single();

    if (checkError || !budget) {
      return NextResponse.json(
        { error: "Budget not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const { data: updated, error: updateError } = await supabaseServer
      .from("budgets")
      .update({
        ...(body.name && { name: body.name }),
        ...(body.amount && { amount: body.amount }),
        ...(body.period && { period: body.period }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.end_date !== undefined && { end_date: body.end_date }),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/budgets/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    // Check if budget belongs to user
    const { data: budget, error: checkError } = await supabaseServer
      .from("budgets")
      .select("id")
      .eq("id", id)
      .eq("user_id", user!.id)
      .single();

    if (checkError || !budget) {
      return NextResponse.json(
        { error: "Budget not found" },
        { status: 404 }
      );
    }

    const { error: deleteError } = await supabaseServer
      .from("budgets")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/budgets/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
