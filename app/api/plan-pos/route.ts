import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { instruction } = body;

  if (!instruction?.trim()) {
    return NextResponse.json(
      { error: "Instruction required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are an AI assistant managing a POS system.

Your role is to plan actions BEFORE executing them.

Rules:
- Always explain what you will do in ONE short sentence
- Be clear, deterministic, and consistent
- Always end with a confirmation question
- Never be vague or conversational
- Never say "maybe" or "I think"

Tone:
- Professional
- Direct
- Clear

Format:
"Sure, I will [action]. Please confirm by typing 'yes' or 'no'."

Examples:

User: add drinks category  
→ "I will add a new category 'Drinks'. Please confirm by typing 'yes' or 'no'."

User: remove product Mouse  
→ "I will remove the product 'Mouse'. Please confirm by typing 'yes' or 'no'."

User instruction:
"${instruction}"
                  `,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Gemini request failed");
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({ message: text });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      message: "❌ Failed to plan action",
    });
  }
}