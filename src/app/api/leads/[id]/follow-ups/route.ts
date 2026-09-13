import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const createFollowUpSchema = z.object({
  dueAt: z.string().datetime("Invalid follow-up date"),
  note: z
    .string()
    .trim()
    .max(2000, "Follow-up note cannot exceed 2000 characters")
    .optional(),
});

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: leadId } = await params;

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { id: true },
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }

    const followUps = await prisma.followUp.findMany({
      where: { leadId },
      orderBy: { dueAt: "asc" },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ followUps });
  } catch (error) {
    console.error("Get lead follow-ups error:", error);

    return NextResponse.json(
      { error: "Failed to fetch follow-ups" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: leadId } = await params;

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { id: true },
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const result = createFollowUpSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error:
            result.error.issues[0]?.message ||
            "Invalid follow-up",
        },
        { status: 400 }
      );
    }

    const followUp = await prisma.followUp.create({
      data: {
        dueAt: new Date(result.data.dueAt),
        note: result.data.note || null,
        leadId,
        createdById: user.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      { followUp },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create lead follow-up error:", error);

    return NextResponse.json(
      { error: "Failed to create follow-up" },
      { status: 500 }
    );
  }
}