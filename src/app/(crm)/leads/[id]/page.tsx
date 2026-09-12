import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { EditLeadDialog } from "@/components/leads/edit-lead-dialog";
import { DeleteLeadDialog } from "@/components/leads/delete-lead-dialog";

type LeadDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LeadDetailsPage({
  params,
}: LeadDetailsPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: {
      id,
    },
    include: {
      createdBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!lead) {
    notFound();
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
  <div>
    <h1 className="text-2xl font-semibold tracking-tight">
      {lead.name}
    </h1>

    <p className="mt-1 text-sm text-muted-foreground">
      Lead details
    </p>
  </div>

    <div className="flex gap-2">
    <EditLeadDialog
        lead={{
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        source: lead.source,
        status: lead.status,
        notes: lead.notes,
        followUpAt: lead.followUpAt
            ? lead.followUpAt.toISOString()
            : null,
        }}
    />

    <DeleteLeadDialog
        leadId={lead.id}
        leadName={lead.name}
    />
    </div>
</div>

        <div className="mt-6 rounded-xl border bg-card p-6">
          <p>
            <strong>Email:</strong>{" "}
            {lead.email || "—"}
          </p>

          <p className="mt-2">
            <strong>Phone:</strong>{" "}
            {lead.phone || "—"}
          </p>

          <p className="mt-2">
            <strong>Source:</strong>{" "}
            {lead.source}
          </p>

          <p className="mt-2">
            <strong>Status:</strong>{" "}
            {lead.status}
          </p>

          <p className="mt-2">
            <strong>Follow-up:</strong>{" "}
            {lead.followUpAt
              ? lead.followUpAt.toLocaleString()
              : "—"}
          </p>

          <div className="mt-4">
            <strong>Notes:</strong>

            <p className="mt-1 text-sm text-muted-foreground">
              {lead.notes || "No notes"}
            </p>
          </div>

          <div className="mt-4 border-t pt-4">
            <p className="text-sm">
              <strong>Created by:</strong>{" "}
              {lead.createdBy.name}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {lead.createdBy.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}