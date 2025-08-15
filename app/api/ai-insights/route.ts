import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { budgets, transactions } = await req.json();

    const prompt = `
You are a personal finance advisor.
Here is my current monthly financial data:

Budgets:
${JSON.stringify(budgets, null, 2)}

Transactions:
${JSON.stringify(transactions, null, 2)}

Give me:
1. Warnings about overspending.
2. Suggestions to save more.
3. Categories I should watch.
4. Any unusual spending patterns.
5. A financial health score (0–100), rating (Excellent/Good/Fair/Poor), and 3 key details (each with label, status, icon name, and color).

Format response as JSON:
{
  "insights": [
    { "type": "alert" | "warning" | "tip" | "success", "title": string, "description": string, "action": string, "priority": "high" | "medium" | "low" }
  ],
  "predictions": [
    { "title": string, "current": number, "predicted": number, "description": string, "trend": "up" | "down" }
  ],
  "financialHealth": {
    "score": number,
    "rating": string,
    "details": [
      { "label": string, "status": string, "icon": string, "color": string }
    ]
  }
}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a strict JSON generator. Respond ONLY with valid JSON, matching the provided schema.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message?.content?.trim();
    const parsed = JSON.parse(content);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("AI Insights Error:", err);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
