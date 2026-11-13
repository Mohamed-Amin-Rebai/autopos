import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Webhook } from "svix";

type ClerkEmailAddress = {
  id?: string;
  email_address?: string;
};

type ClerkUserEvent = {
  type: "user.created" | "user.updated" | "user.deleted";
  data: {
    id: string;
    email_addresses?: ClerkEmailAddress[];
    primary_email_address_id?: string | null;
    first_name?: string | null;
    last_name?: string | null;
  };
};

function getUserProfile(data: ClerkUserEvent["data"]) {
  const email =
    data.email_addresses?.find(
      (address) => address.id === data.primary_email_address_id
    )?.email_address ?? data.email_addresses?.[0]?.email_address;
  if (!email) {
    throw new Error("Clerk webhook user has no email address");
  }

  const name = [data.first_name, data.last_name]
    .filter(Boolean)
    .join(" ") || null;

  return { email, name };
}

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("CLERK_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook is not configured" },
      { status: 500 }
    );
  }

  const payload = await req.text();
  const headers = {
    "svix-id": req.headers.get("svix-id") ?? "",
    "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
    "svix-signature": req.headers.get("svix-signature") ?? "",
  };

  let event: ClerkUserEvent;
  try {
    new Webhook(secret).verify(payload, headers);
    event = JSON.parse(payload) as ClerkUserEvent;
  } catch (error) {
    console.error("Invalid Clerk webhook signature:", error);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  if (
    event.type !== "user.created" &&
    event.type !== "user.updated" &&
    event.type !== "user.deleted"
  ) {
    return NextResponse.json({ received: true });
  }

  if (!event.data?.id) {
    return NextResponse.json(
      { error: "Invalid Clerk webhook payload" },
      { status: 400 }
    );
  }

  try {
    if (event.type === "user.deleted") {
      await prisma.user.deleteMany({
        where: { clerkId: event.data.id },
      });
    } else {
      const { email, name } = getUserProfile(event.data);
      await prisma.user.upsert({
        where: { clerkId: event.data.id },
        create: {
          clerkId: event.data.id,
          email,
          name,
        },
        update: {
          email,
          name,
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Failed to process Clerk ${event.type} webhook:`, error);
    return NextResponse.json(
      { error: "Failed to synchronize user" },
      { status: 500 }
    );
  }
}
