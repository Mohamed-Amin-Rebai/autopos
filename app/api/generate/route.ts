import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { POS_PROMPT } from "@/lib/prompts/pos";
import { generatePOS } from "@/lib/gemini";
import type { Prisma } from "@prisma/client";
import {
  checkRateLimit,
  rateLimitResponse,
} from "@/lib/rateLimit";

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
    const rateLimit = await checkRateLimit("ai", dbUser.id);
    if (!rateLimit.success) {
      return rateLimitResponse(rateLimit);
    }
  } catch (error) {
    console.error("Generate rate limiter error:", error);
    return NextResponse.json(
      { error: "Rate limiting service unavailable" },
      { status: 503 }
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
      ${POS_PROMPT}

      User request:
      ${prompt}
    `);

    const created = await prisma.pOS.create({
      data: {
        userId: dbUser.id,
        name: prompt.slice(0, 50),
        data: {
          current: data,
          history: [
            {
              label: "Initial POS",
              data,
              createdAt: new Date().toISOString(),
            },
          ],
        } as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({
      data,
      posId: created.id,
    });
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to generate or save POS",
      },
      {
        status: 502,
      }
    );
  }
}