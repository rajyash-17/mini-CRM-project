import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
    followUpId: string;
  }>;
};

const updateFollowUpSchema = z.object({
  completed: z.boolean(),
});

export async function PATCH(
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

    const { id: leadId, followUpId } = await params;

    const followUp = await prisma.followUp.findFirst({
      where: {
        id: followUpId,
        leadId,
      },
    });

    if (!followUp) {
      return NextResponse.json(
        { error: "Follow-up not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const result = updateFollowUpSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error:
            result.error.issues[0]?.message ||
            "Invalid follow-up update",
        },
        { status: 400 }
      );
    }

    const updatedFollowUp = await prisma.followUp.update({
      where: {
        id: followUpId,
      },
      data: {
        completedAt: result.data.completed
          ? new Date()
          : null,
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

    return NextResponse.json({
      followUp: updatedFollowUp,
    });
  } catch (error) {
    console.error("Update lead follow-up error:", error);

    return NextResponse.json(
      { error: "Failed to update follow-up" },
      { status: 500 }
    );
  }
}