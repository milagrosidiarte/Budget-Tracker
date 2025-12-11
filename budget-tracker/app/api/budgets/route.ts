import { supabaseServer } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    // Get current user from Authorization header
    const authHeader = await import("next/headers").then((m) =>
      m.headers().then((h) => h.get("authorization"))
    );

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // Verify token and get user
    const { data, error } = await supabaseServer.auth.getUser(token);

    if (error || !data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's budgets
    const { data: budgets, error: budgetError } = await supabaseServer
      .from("budgets")
      .select("*")
      .eq("user_id", data.user.id)
      .order("created_at", { ascending: false });

    if (budgetError) {
      return NextResponse.json({ error: budgetError.message }, { status: 500 });
    }

    return NextResponse.json(budgets);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get current user from Authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // Verify token and get user
    const { data, error } = await supabaseServer.auth.getUser(token);

    if (error || !data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.amount || !body.period) {
      return NextResponse.json(
        { error: "Missing required fields: name, amount, period" },
        { status: 400 }
      );
    }

    // Create budget
    const { data: budget, error: budgetError } = await supabaseServer
      .from("budgets")
      .insert({
        user_id: data.user.id,
        name: body.name,
        amount: body.amount,
        period: body.period,
        start_date: body.start_date || new Date().toISOString().split("T")[0],
        end_date: body.end_date || null,
        description: body.description || null,
      })
      .select()
      .single();

    if (budgetError) {
      return NextResponse.json({ error: budgetError.message }, { status: 500 });
    }

    return NextResponse.json(budget, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
