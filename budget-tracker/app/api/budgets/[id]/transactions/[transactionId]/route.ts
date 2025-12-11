import { supabaseServer } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; transactionId: string }> }
) {
  try {
    const { id, transactionId } = await params;
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const { data, error } = await supabaseServer.auth.getUser(token);

    if (error || !data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify budget belongs to user
    const { data: budget, error: budgetError } = await supabaseServer
      .from("budgets")
      .select("id")
      .eq("id", id)
      .eq("user_id", data.user.id)
      .single();

    if (budgetError || !budget) {
      return NextResponse.json(
        { error: "Budget not found" },
        { status: 404 }
      );
    }

    const { data: transaction, error: transError } = await supabaseServer
      .from("transactions")
      .select("*")
      .eq("id", transactionId)
      .eq("budget_id", id)
      .single();

    if (transError || !transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("GET /api/budgets/[id]/transactions/[transactionId] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; transactionId: string }> }
) {
  try {
    const { id, transactionId } = await params;
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const { data, error } = await supabaseServer.auth.getUser(token);

    if (error || !data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify budget belongs to user
    const { data: budget, error: budgetError } = await supabaseServer
      .from("budgets")
      .select("id")
      .eq("id", id)
      .eq("user_id", data.user.id)
      .single();

    if (budgetError || !budget) {
      return NextResponse.json(
        { error: "Budget not found" },
        { status: 404 }
      );
    }

    // Verify transaction belongs to budget
    const { data: transaction, error: transCheckError } = await supabaseServer
      .from("transactions")
      .select("id")
      .eq("id", transactionId)
      .eq("budget_id", id)
      .single();

    if (transCheckError || !transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const { data: updated, error: updateError } = await supabaseServer
      .from("transactions")
      .update({
        ...(body.description && { description: body.description }),
        ...(body.amount !== undefined && { amount: body.amount }),
        ...(body.type && { type: body.type }),
        ...(body.category && { category: body.category }),
        ...(body.date && { date: body.date }),
        ...(body.notes !== undefined && { notes: body.notes }),
      })
      .eq("id", transactionId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/budgets/[id]/transactions/[transactionId] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; transactionId: string }> }
) {
  try {
    const { id, transactionId } = await params;
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const { data, error } = await supabaseServer.auth.getUser(token);

    if (error || !data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify budget belongs to user
    const { data: budget, error: budgetError } = await supabaseServer
      .from("budgets")
      .select("id")
      .eq("id", id)
      .eq("user_id", data.user.id)
      .single();

    if (budgetError || !budget) {
      return NextResponse.json(
        { error: "Budget not found" },
        { status: 404 }
      );
    }

    // Verify transaction belongs to budget
    const { data: transaction, error: transCheckError } = await supabaseServer
      .from("transactions")
      .select("id")
      .eq("id", transactionId)
      .eq("budget_id", id)
      .single();

    if (transCheckError || !transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    const { error: deleteError } = await supabaseServer
      .from("transactions")
      .delete()
      .eq("id", transactionId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/budgets/[id]/transactions/[transactionId] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
