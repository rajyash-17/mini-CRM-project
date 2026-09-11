import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";

const updateLeadSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().trim().email("Please enter a valid email").optional().or(z.literal("")),
  phone: z.string().trim().optional(),
  source: z
    .enum([
      "WEBSITE",
      "LINKEDIN",
      "REFERRAL",
      "INSTAGRAM",
      "COLD_OUTREACH",
      "OTHER",
    ])
    .optional(),
  status: z
    .enum(["NEW", "CONTACTED", "NEGOTIATING", "CLOSED"])
    .optional(),
  notes: z.string().trim().optional(),
  followUpAt: z.string().datetime().optional().or(z.literal("")),
});

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const lead = await prisma.lead.findUnique({
      where: {
        id,
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

    if (!lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error("Get lead error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const body = await request.json();

    const result = updateLeadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const existingLead = await prisma.lead.findUnique({
      where: {
        id,
      },
    });

    if (!existingLead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
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

    const lead = await prisma.lead.update({
      where: {
        id,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && {
          email: email || null,
        }),
        ...(phone !== undefined && {
          phone: phone || null,
        }),
        ...(source !== undefined && { source }),
        ...(status !== undefined && { status }),
        ...(notes !== undefined && {
          notes: notes || null,
        }),
        ...(followUpAt !== undefined && {
          followUpAt: followUpAt
            ? new Date(followUpAt)
            : null,
        }),
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

    return NextResponse.json({
      message: "Lead updated successfully",
      lead,
    });
  } catch (error) {
    console.error("Update lead error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const existingLead = await prisma.lead.findUnique({
      where: {
        id,
      },
    });

    if (!existingLead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }

    await prisma.lead.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Delete lead error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}