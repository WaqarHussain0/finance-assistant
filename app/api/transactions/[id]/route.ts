import { NextResponse } from "next/server";
import { supabase } from "../../../../utils/supabaseClient";
import { TABLE_NAMES } from "../../../../constant/tables.constant";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from(TABLE_NAMES.transactions)
      .delete()
      .eq("id", params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /transactions/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
