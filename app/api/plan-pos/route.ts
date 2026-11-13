import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { PLAN_POS_PROMPT } from "@/lib/prompts/plan-pos";
import { planPOS } from "@/lib/gemini";
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
    console.error("Plan POS rate limiter error:", error);
    return NextResponse.json(
      { error: "Rate limiting service unavailable" },
      { status: 503 }
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
    const message = await planPOS(`
      ${PLAN_POS_PROMPT}

      User instruction:
      "${instruction}"
    `);

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Plan POS error:", error);
    return NextResponse.json(
      { error: "Failed to plan action" },
      { status: 502 },
    );
  }
}