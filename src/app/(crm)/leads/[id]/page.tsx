import Link from "next/link";
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

const sourceLabels = {
  WEBSITE: "Website",
  LINKEDIN: "LinkedIn",
  REFERRAL: "Referral",
  INSTAGRAM: "Instagram",
  COLD_OUTREACH: "Cold Outreach",
  OTHER: "Other",
};

const statusLabels = {
  NEW: "New",
  CONTACTED: "Contacted",
  NEGOTIATING: "Negotiating",
  CLOSED: "Closed",
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
        <Link
          href="/leads"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Leads
        </Link>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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

        <div className="mt-6 rounded-xl border bg-card">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold">Contact Information</h2>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>

              {lead.email ? (
                <a
                  href={`mailto:${lead.email}`}
                  className="mt-1 block text-sm font-medium hover:underline"
                >
                  {lead.email}
                </a>
              ) : (
                <p className="mt-1 text-sm">—</p>
              )}
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Phone</p>

              {lead.phone ? (
                <a
                  href={`tel:${lead.phone}`}
                  className="mt-1 block text-sm font-medium hover:underline"
                >
                  {lead.phone}
                </a>
              ) : (
                <p className="mt-1 text-sm">—</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border bg-card">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold">Lead Information</h2>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Source</p>
              <p className="mt-1 text-sm font-medium">
                {sourceLabels[lead.source]}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="mt-1 text-sm font-medium">
                {statusLabels[lead.status]}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="mt-1 text-sm font-medium">
                {lead.createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border bg-card p-6">
            <p className="text-sm font-semibold">Follow-up</p>

            <p className="mt-2 text-sm text-muted-foreground">
              {lead.followUpAt
                ? lead.followUpAt.toLocaleString()
                : "No follow-up scheduled"}
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <p className="text-sm font-semibold">Notes</p>

            <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
              {lead.notes || "No notes added"}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border bg-card p-6">
          <p className="text-sm font-semibold">Created by</p>

          <p className="mt-2 text-sm">{lead.createdBy.name}</p>

          <p className="mt-1 text-sm text-muted-foreground">
            {lead.createdBy.email}
          </p>
        </div>
      </div>
    </div>
  );
}