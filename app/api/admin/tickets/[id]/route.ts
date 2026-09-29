import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

const VALID_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED"] as const;
type TicketStatus = (typeof VALID_STATUSES)[number];

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getOrCreateUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json(ticket);
  } catch (err) {
    console.error("Failed to load ticket:", err);
    return NextResponse.json(
      { error: "Failed to load ticket" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getOrCreateUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const status: TicketStatus | undefined = body.status;
    const resolution: string | undefined =
      typeof body.resolution === "string" ? body.resolution.trim() : undefined;

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    if (!status && resolution === undefined) {
      return NextResponse.json(
        { error: "Nothing to update" },
        { status: 400 }
      );
    }

    const existing = await prisma.supportTicket.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const updated = await prisma.supportTicket.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(resolution !== undefined ? { resolution } : {}),
      },
    });

    // Notify ticket owner on status change
    const statusChanged = status && status !== existing.status;

    if (statusChanged && status === "RESOLVED") {
      await prisma.notification.create({
        data: {
          userId: existing.userId,
          title: "Your support ticket was resolved",
          message: resolution
            ? `Resolution: ${resolution}`
            : `Your ticket "${existing.title}" has been marked as resolved.`,
          ticketId: existing.id,
        },
      });
    } else if (statusChanged) {
      await prisma.notification.create({
        data: {
          userId: existing.userId,
          title: "Your support ticket was updated",
          message: `Ticket "${existing.title}" is now ${status}.`,
          ticketId: existing.id,
        },
      });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Failed to update ticket:", err);
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}