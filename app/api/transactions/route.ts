import { NextResponse } from "next/server";
import { supabase } from "../../../utils/supabaseClient";
import { TABLE_NAMES } from "../../../constant/tables.constant";

export async function GET() {
  const { data, error } = await supabase.from(TABLE_NAMES.transactions).select(`
      *,
      categories:categoryid (
        id,
        name
      )
    `);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { error } = await supabase.from(TABLE_NAMES.transactions).insert([
      {
        amount: body.type === "expense" ? -body.amount : body.amount,
        description: body.description,
        transactiondate: body.transactiondate,
        type: body.type,
        categoryid: body.categoryId,
        userid: body.userId,
        paymentmethod: body.paymentMethod,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
