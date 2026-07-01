import { NextResponse } from "next/server";

export async function POST(req: Request) {

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
You are an AI POS system editor.

Your task is to MODIFY the given JSON strictly according to the user instruction.

CRITICAL RULES:
- You MUST apply the requested change
- If a product is mentioned, you MUST find it by name and modify it
- Do NOT ignore the instruction

- Always return FULL JSON
- Keep structure EXACT
- Do NOT remove fields
- Do not wrap JSON in explanations
- Do not add comments
- Do not add markdown


- Categories, products must remain valid arrays
- Product ids must stay unique

- If modifying price:
  → update the "price" field of the matching product


When matching product names:
- Comparison must be case-insensitive
- Ignore slight variations in capitalization


If an exact match is not found:
- Try to match the closest product name
- Do NOT ignore the instruction

DISCOUNT RULES:

- Discounts are stored as an array "discounts"
- Each discount has:
  { "name", "value", "active" }

- Only ONE discount can be active at a time

- If user says:
  "activate black friday discount"
  → set that one active=true and others false

- If user says:
  "disable discount"
  → set all active=false

- If user says:
  "change default discount to 20%"
  → update the value

- NEVER remove the discounts array

⚠️ VERY IMPORTANT:
- You MUST actually modify the data
- Do not return unchanged JSON

Current POS:
${JSON.stringify(currentData)}

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
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    if (!text) {
      return NextResponse.json(currentData);
    }

    // ✅ clean markdown
    text = text.replace(/```json|```/g, "").trim();

    try {

      const json = JSON.parse(text);
      if (!json.products || !Array.isArray(json.products)) {
        throw new Error("Invalid structure");
      }
      return NextResponse.json(json);

    } catch {

      console.error("INVALID JSON:", text);
      return NextResponse.json(currentData);

    }

  } catch (error) {

    console.error("API ERROR:", error);
    return NextResponse.json(currentData);
    
  }
}