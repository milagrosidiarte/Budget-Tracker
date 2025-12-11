import { supabaseServer } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
      .eq("id", params.id)
      .eq("user_id", data.user.id)
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
      .eq("budget_id", params.id)
      .order("date", { ascending: false });

    if (transError) {
      return NextResponse.json({ error: transError.message }, { status: 500 });
    }

    return NextResponse.json(transactions);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
      .eq("id", params.id)
      .eq("user_id", data.user.id)
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
        budget_id: params.id,
        user_id: data.user.id,
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
      return NextResponse.json({ error: transError.message }, { status: 500 });
    }

    return NextResponse.json(transaction, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
