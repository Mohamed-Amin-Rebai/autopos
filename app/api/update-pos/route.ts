import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { UPDATE_POS_PROMPT } from "@/lib/prompts/update-pos";
import { generatePOS } from "@/lib/gemini";
import {
  checkRateLimit,
  rateLimitResponse,
} from "@/lib/rateLimit";


export async function POST(req: Request) {

  const user = await getOrCreateUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const rateLimit = await checkRateLimit("ai", user.id);
    if (!rateLimit.success) {
      return rateLimitResponse(rateLimit);
    }
  } catch (error) {
    console.error("Update POS rate limiter error:", error);
    return NextResponse.json(
      { error: "Rate limiting service unavailable" },
      { status: 503 }
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
    const data = await generatePOS(`
      ${UPDATE_POS_PROMPT}

      Current POS:
      ${JSON.stringify(currentData)}

      Instruction:
      "${instruction}"
    `);

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "Update POS failed",
      instruction,
      error
    );
    return NextResponse.json(
      { error: "Failed to update POS" },
      { status: 502 },
    );
  }
}