import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { UPDATE_POS_PROMPT } from "@/lib/prompts/update-pos";


export async function POST(req: Request) {

  const user = await getOrCreateUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { currentData, instruction } = body;

  if (!currentData || typeof currentData !== "object") {
    return NextResponse.json(
      { error: "Current data is required and must be an object" },
      { status: 400 }
    );
  }

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
                    ${UPDATE_POS_PROMPT}

                    Current POS:
                    ${JSON.stringify(currentData)}

                    Instruction:
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
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    if (!text) {
      return NextResponse.json(currentData);
    }

    // clean markdown
    text = text.replace(/```json|```/g, "").trim();

    try {

      const json = JSON.parse(text);
      if (
        !Array.isArray(json.categories) ||
        !Array.isArray(json.products)
      ) {
        throw new Error("Invalid structure");
      }
      return NextResponse.json(json);

    } catch {

      console.error("INVALID JSON:", text);
      return NextResponse.json(currentData);

    }

  } catch (error) {

    console.error(
      "Update POS failed",
      instruction,
      error
    );
    return NextResponse.json(currentData);

  }
}