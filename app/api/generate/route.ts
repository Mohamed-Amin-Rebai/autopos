import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

export async function POST(req: Request) {
  const body = await req.json();
  const prompt = body.prompt;

  if (!prompt?.trim()) {
    return NextResponse.json(
      { error: "Prompt required" },
      { status: 400 }
    );
  }

  const dbUser = await getOrCreateUser();
  if (!dbUser) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
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
You are an AI POS system generator.

Return ONLY valid JSON.

Structure:

{
  "categories": [],  // optional
  "products": [
    {
      "id": 1,
      "name": "",
      "price": 0,
      "category": "",  // only if categories exist
      "brand": "",
      "attributes": {}
    }
  ],
  "discounts": [
    { "name": "Default", "value": 10, "active": true },
    { "name": "Black Friday", "value": 50, "active": false }
  ]
}

Rules:

GENERAL:
- Adapt to the business type
- Always generate realistic and relevant products

- Include discount system:
"discounts": [
  { "name": "Default", "value": 10, "active": true },
  { "name": "Black Friday", "value": 50, "active": false }
]

STRUCTURE MODES:

You must decide between TWO modes:

1) Categorized mode (default):
- Include "categories" as an array of strings
- Each product MUST have a "category"
- Categories must be simple strings (e.g., "Tech", "Food")

2) Flat mode (if user explicitly requests it):
- Do NOT include the "categories" field
- Do NOT include "category" inside products
- All products belong to a single unified list

Flat mode is triggered ONLY if the user clearly says:
- "no categories"
- "without categories"
- "simple POS"
- or similar instructions

DATA RULES:

- Categories must be an array of strings ONLY
  Example: ["Tech", "Accessories"]

- Products must:
  - have unique ids
  - have realistic names and prices
  - NOT include category field in flat mode

- Attributes:
  - Clothing → include size, quantity
  - Tech → include brand, specifications
  - Food → include ingredients

IMPORTANT:
- Do NOT mix modes
- If flat mode is selected → categories MUST NOT appear
- If categorized mode → categories MUST be present

User request:
${prompt}
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
    console.log("FULL GEMINI RESPONSE:", data);

    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("RAW TEXT:", text);

    // ✅ fallback if empty
    if (!text) {
      return NextResponse.json({
        categories: ["Default"],
        products: [],      
        discounts: [
          {
            name: "Default",
            value: 10,
            active: true,
          },
        ],
      });
    }

    // ✅ clean markdown
    text = text.replace(/```json|```/g, "").trim();

    try {
      const json = JSON.parse(text);

      let created;
      try {
        created = await prisma.pOS.create({
          data: {
            userId: dbUser.id,
            name: prompt.slice(0, 50),
            data: {
              current: json,
              history: [
                {
                  label: "Initial POS",
                  data: json,
                },
              ],
            },
          },
        });

        console.log("✅ POS saved to DB");
      } catch (err) {
        console.error("❌ Failed to save POS:", err);
      }
      return NextResponse.json({
        data: json,
        posId: created?.id ?? null,
      });

      
    } catch (err) {
      console.error("INVALID JSON:", text);

      return NextResponse.json({
        categories: ["General"],
        products: [],
        discounts: [
          {
            name: "Default",
            value: 10,
            active: true,
          },
        ],
      });
    }
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to generate POS",
      },
      {
        status: 500,
      }
    );
  }
}