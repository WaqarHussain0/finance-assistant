import { NextResponse } from "next/server";
import { supabase } from "../../../../utils/supabaseClient";
import { TABLE_NAMES } from "../../../../constant/tables.constant";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { budgetlimit } = await req.json();

    if (!params.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (budgetlimit === undefined) {
      return NextResponse.json(
        { error: "Budget limit is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from(TABLE_NAMES.budgetallocation)
      .update({ budgetlimit })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("PUT /budgets/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
