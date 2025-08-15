import { NextResponse } from "next/server";
import { supabase } from "../../../utils/supabaseClient";
import { TABLE_NAMES } from "../../../constant/tables.constant";

export async function GET() {
  try {
    // 1️⃣ Fetch all budget allocations with their related category info
    const { data: budgetAllocations, error: budgetError } = await supabase.from(
      TABLE_NAMES.budgetallocation
    ).select(`
        *,
        categories:categoryid (
          id,
          name
        )
      `);

    if (budgetError) {
      return NextResponse.json({ error: budgetError.message }, { status: 500 });
    }

    // 2️⃣ For each budget allocation, calculate spentAmount from transactions
    const updatedAllocations = await Promise.all(
      budgetAllocations.map(async (allocation) => {
        const { data: transactions, error: transactionError } = await supabase
          .from(TABLE_NAMES.transactions)
          .select("amount")
          .eq("categoryid", allocation.categoryid);

        if (transactionError) {
          throw new Error(transactionError.message);
        }

        // Sum all transaction amounts for this category
        const spentAmount = transactions.reduce(
          (sum, tx) => sum + (tx.amount || 0),
          0
        );

        return {
          ...allocation,
          spentAmount, // dynamically calculated field
        };
      })
    );

    // 3️⃣ Return allocations with calculated spentAmount
    return NextResponse.json(updatedAllocations);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
