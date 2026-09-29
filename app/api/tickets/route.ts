import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { classifyTicket, deriveJevFields } from "@/lib/jev";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { Prisma } from "@prisma/client";


export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const title = body.title?.trim();
    const message = body.message?.trim();

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 }
      );
    }

    let derived: { department?: string; urgency?: boolean; frustration?: number } = {};
    let meta: Prisma.InputJsonValue | undefined = undefined;


    try {
      const aiResult = await classifyTicket(message);
      derived = deriveJevFields(aiResult);
      meta = aiResult as Prisma.InputJsonValue;
    } catch (err) {
      console.error("JEV failed", err);
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: user.id,
        title,
        message,
        ...derived,
        meta,
        status: "OPEN",
      },
    });

    // Notify all admins
    const admins = await prisma.user.findMany({
      where: { role: "admin" },
      select: { id: true },
    });

    if (admins.length > 0) {
      await prisma.notification.createMany({
        data: admins.map((admin) => ({
          userId: admin.id,
          title: "New Support Ticket",
          message: `${title} requires review`,
          ticketId: ticket.id,
        })),
      });
    }

    return NextResponse.json(ticket);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tickets = await prisma.supportTicket.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tickets);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}