import { NextResponse } from "next/server";
import { supabase } from "../../../utils/supabaseClient";
import { TABLE_NAMES } from "../../../constant/tables.constant";

// GET all categories
export async function GET() {
  const { data, error } = await supabase
    .from(TABLE_NAMES.categories)
    .select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST new category
export async function POST(req: Request) {
  try {
    const { name, userId } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Category name is required and must be a string." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from(TABLE_NAMES.categories)
      .insert([{ name, userId }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
