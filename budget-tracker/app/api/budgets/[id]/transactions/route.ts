import { supabaseServer } from "@/lib/supabase-server";
import { validateAuth } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { authenticated, user, response } = await validateAuth(request);

    if (!authenticated) {
      return response;
    }

    // Verify budget belongs to user
    const { data: budget, error: budgetError } = await supabaseServer
      .from("budgets")
      .select("id")
      .eq("id", id)
      .eq("user_id", user!.id)
      .single();

    if (budgetError || !budget) {
      return NextResponse.json(
        { error: "Budget not found" },
        { status: 404 }
      );
    }

    // Get transactions for this budget
    const { data: transactions, error: transError } = await supabaseServer
      .from("transactions")
      .select("*")
      .eq("budget_id", id)
      .order("date", { ascending: false });

    if (transError) {
      console.error("Supabase transactions select error:", transError);
      return NextResponse.json({ error: transError.message }, { status: 500 });
    }

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("GET /api/budgets/[id]/transactions error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { authenticated, user, response } = await validateAuth(request);

    if (!authenticated) {
      return response;
    }

    // Verify budget belongs to user
    const { data: budget, error: budgetError } = await supabaseServer
      .from("budgets")
      .select("id")
      .eq("id", id)
      .eq("user_id", user!.id)
      .single();

    if (budgetError || !budget) {
      return NextResponse.json(
        { error: "Budget not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    if (!body.description || body.amount === undefined || !body.date) {
      return NextResponse.json(
        { error: "Missing required fields: description, amount, date" },
        { status: 400 }
      );
    }

    const { data: transaction, error: transError } = await supabaseServer
      .from("transactions")
      .insert({
        budget_id: id,
        user_id: user!.id,
        description: body.description,
        amount: body.amount,
        type: body.type || "expense",
        category: body.category || "other",
        date: body.date,
        notes: body.notes || null,
      })
      .select()
      .single();

    if (transError) {
      console.error("Supabase transaction insert error:", transError);
      return NextResponse.json({ error: transError.message }, { status: 500 });
    }

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("POST /api/budgets/[id]/transactions error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}
