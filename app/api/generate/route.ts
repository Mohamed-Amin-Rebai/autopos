import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { POS_PROMPT } from "@/lib/prompts/pos";

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
                    ${POS_PROMPT}

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

    // fallback if empty
    if (!text) {
      return NextResponse.json(
        { error: "Failed to generate POS" },
        { status: 500 }
      );
    }

    // clean markdown
    text = text.replace(/```json|```/g, "").trim();

    try {
      const json = JSON.parse(text);

      if (!Array.isArray(json.products)) {
        throw new Error("Invalid products structure");
      }
      if (json.categories && !Array.isArray(json.categories)) {
        throw new Error("Invalid categories structure");
      }

      let created: { id: string } | null = null;
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

        if (dbUser.role === "user") {
          await prisma.user.update({
            where: {
              id: dbUser.id,
            },
            data: {
              role: "manager",
            },
          });
        }
        console.log("✅ POS saved to DB");

      } catch (err) {

        console.error(
          "POS save failed",
          dbUser.id,
          prompt,
          err
        );

      }
      return NextResponse.json({
        data: json,
        posId: created?.id ?? null,
      });
      
    } catch {
      console.error("INVALID JSON:", text);

      return NextResponse.json(
        { error: "Invalid AI response" },
        { status: 500 }
      );
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