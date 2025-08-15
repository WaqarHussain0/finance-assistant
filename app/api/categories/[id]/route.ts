import { NextResponse } from "next/server";
import { supabase } from "../../../../utils/supabaseClient";
import { TABLE_NAMES } from "../../../../constant/tables.constant";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name } = await req.json();

    if (!params.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (name === undefined) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from(TABLE_NAMES.categories)
      .update({ name })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("PUT /categories/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from(TABLE_NAMES.categories)
      .delete()
      .eq("id", params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /categories/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
