import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { PLAN_POS_PROMPT } from "@/lib/prompts/plan-pos";


export async function POST(req: Request) {

  const user = await getOrCreateUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { instruction } = body;

  if (!instruction?.trim()) {
    return NextResponse.json(
      { error: "Instruction required" },
      { status: 400 }
    );
  }

  if (instruction.length > 1000) {
    return NextResponse.json(
      { error: "Instruction too long" },
      { status: 400 }
    );
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "AI service unavailable" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
                    ${PLAN_POS_PROMPT}

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

  } catch (error) {

    console.error("Plan POS error:", error);
    return NextResponse.json(
      {
        error: "Failed to plan action",
      },
      {
        status: 500,
      }
    );

  }
}