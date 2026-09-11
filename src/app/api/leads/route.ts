import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";

const createLeadSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email").optional().or(z.literal("")),
  phone: z.string().trim().optional(),
  source: z.enum([
    "WEBSITE",
    "LINKEDIN",
    "REFERRAL",
    "INSTAGRAM",
    "COLD_OUTREACH",
    "OTHER",
  ]),
  status: z
    .enum(["NEW", "CONTACTED", "NEGOTIATING", "CLOSED"])
    .default("NEW"),
  notes: z.string().trim().optional(),
  followUpAt: z.string().datetime().optional().or(z.literal("")),
});

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ leads });
  } catch (error) {
    console.error("Get leads error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const result = createLeadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      phone,
      source,
      status,
      notes,
      followUpAt,
    } = result.data;

    const lead = await prisma.lead.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        source,
        status,
        notes: notes || null,
        followUpAt: followUpAt
          ? new Date(followUpAt)
          : null,
        createdById: user.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Lead created successfully",
        lead,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create lead error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}