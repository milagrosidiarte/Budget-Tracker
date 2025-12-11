import { supabaseServer } from "@/lib/supabase-server";
import { validateAuth } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { authenticated, user, response } = await validateAuth(request);

    if (!authenticated) {
      return response;
    }

    // Get user's budgets
    const { data: budgets, error: budgetError } = await supabaseServer
      .from("budgets")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (budgetError) {
      console.error("Budget error:", budgetError);
      return NextResponse.json({ error: budgetError.message }, { status: 500 });
    }

    return NextResponse.json(budgets);
  } catch (error) {
    console.error("GET /api/budgets error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { authenticated, user, response } = await validateAuth(request);

    if (!authenticated) {
      return response;
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
        user_id: user!.id,
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
      console.error("Budget insert error:", budgetError);
      return NextResponse.json({ error: budgetError.message }, { status: 500 });
    }

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error("POST /api/budgets error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
