import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  Check,
  Clock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { EditLeadDialog } from "@/components/leads/edit-lead-dialog";
import { DeleteLeadDialog } from "@/components/leads/delete-lead-dialog";
import { LeadNotes } from "@/components/leads/lead-notes";
import { LeadFollowUps } from "@/components/leads/lead-follow-ups";

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

const pipelineStages = [
  {
    key: "NEW",
    label: "New",
  },
  {
    key: "CONTACTED",
    label: "Contacted",
  },
  {
    key: "NEGOTIATING",
    label: "Negotiating",
  },
  {
    key: "CLOSED",
    label: "Closed",
  },
] as const;

function getStatusClasses(
  status: keyof typeof statusLabels
) {
  switch (status) {
    case "NEW":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "CONTACTED":
      return "border-yellow-200 bg-yellow-50 text-yellow-700";
    case "NEGOTIATING":
      return "border-purple-200 bg-purple-50 text-purple-700";
    case "CLOSED":
      return "border-green-200 bg-green-50 text-green-700";
  }
}

function getFollowUpState(
  followUpAt: Date | null
) {
  if (!followUpAt) {
    return {
      label: "No follow-up scheduled",
      description:
        "Schedule a follow-up to keep this lead moving.",
      className: "text-muted-foreground",
      icon: Clock,
    };
  }

  const now = new Date();
  const isOverdue = followUpAt < now;

  if (isOverdue) {
    return {
      label: "Follow-up overdue",
      description: followUpAt.toLocaleString(),
      className: "text-destructive",
      icon: Clock,
    };
  }

  return {
    label: "Upcoming follow-up",
    description: followUpAt.toLocaleString(),
    className: "text-foreground",
    icon: CalendarClock,
  };
}

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

  const currentStageIndex = pipelineStages.findIndex(
    (stage) => stage.key === lead.status
  );

  const followUp = getFollowUpState(
    lead.followUpAt
  );

  const FollowUpIcon = followUp.icon;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/20 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        <Link
          href="/leads"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Leads
        </Link>

        {/* Header */}
        <div className="mt-5 rounded-xl border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {lead.name}
                </h1>

                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                    lead.status
                  )}`}
                >
                  {statusLabels[lead.status]}
                </span>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                {sourceLabels[lead.source]} lead
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
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
        </div>

        {/* Pipeline */}
        <section className="mt-4 rounded-xl border bg-card shadow-sm">
          <div className="border-b px-5 py-4 sm:px-6">
            <h2 className="font-semibold">
              Pipeline
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Current position in the sales process.
            </p>
          </div>

          <div className="overflow-x-auto px-5 py-6 sm:px-6">
            <div className="flex min-w-[520px] items-center">
              {pipelineStages.map(
                (stage, index) => {
                  const isCompleted =
                    index < currentStageIndex;

                  const isCurrent =
                    index === currentStageIndex;

                  return (
                    <div
                      key={stage.key}
                      className="flex flex-1 items-center"
                    >
                      <div className="flex min-w-0 flex-col items-center">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium ${
                            isCompleted || isCurrent
                              ? "border-foreground bg-foreground text-background"
                              : "bg-background text-muted-foreground"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            index + 1
                          )}
                        </div>

                        <span
                          className={`mt-2 text-xs font-medium ${
                            isCurrent
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {stage.label}
                        </span>
                      </div>

                      {index <
                        pipelineStages.length - 1 && (
                        <div
                          className={`mx-2 h-px flex-1 ${
                            index < currentStageIndex
                              ? "bg-foreground"
                              : "bg-border"
                          }`}
                        />
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {/* Contact */}
          <section className="rounded-xl border bg-card shadow-sm lg:col-span-2">
            <div className="border-b px-5 py-4 sm:px-6">
              <h2 className="font-semibold">
                Contact Information
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Contact details for this lead.
              </p>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
              <div className="rounded-lg border bg-muted/20 p-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />

                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Email
                  </p>
                </div>

                {lead.email ? (
                  <a
                    href={`mailto:${lead.email}`}
                    className="mt-3 block break-all text-sm font-medium hover:underline"
                  >
                    {lead.email}
                  </a>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    No email provided
                  </p>
                )}
              </div>

              <div className="rounded-lg border bg-muted/20 p-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />

                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Phone
                  </p>
                </div>

                {lead.phone ? (
                  <a
                    href={`tel:${lead.phone}`}
                    className="mt-3 block text-sm font-medium hover:underline"
                  >
                    {lead.phone}
                  </a>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    No phone number provided
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Follow-up */}
          <section className="rounded-xl border bg-card shadow-sm">
            <div className="border-b px-5 py-4 sm:px-6">
              <h2 className="font-semibold">
                Follow-up
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Next action for this lead.
              </p>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <FollowUpIcon className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="min-w-0">
                  <p
                    className={`text-sm font-medium ${followUp.className}`}
                  >
                    {followUp.label}
                  </p>

                  <p
                    className={`mt-1 text-sm ${
                      lead.followUpAt
                        ? "text-muted-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {followUp.description}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

          <LeadFollowUps
  leadId={lead.id}
  legacyFollowUpAt={lead.followUpAt?.toISOString() ?? null}
/>      
          {/* Notes */}
          <LeadNotes
            leadId={lead.id}
            legacyNote={lead.notes}
          />
        

        {/* Lead metadata */}
        <section className="mt-4 rounded-xl border bg-card shadow-sm">
          <div className="border-b px-5 py-4 sm:px-6">
            <h2 className="font-semibold">
              Lead Information
            </h2>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Source
              </p>

              <p className="mt-2 text-sm font-medium">
                {sourceLabels[lead.source]}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </p>

              <p className="mt-2 text-sm font-medium">
                {statusLabels[lead.status]}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Created
              </p>

              <p className="mt-2 text-sm font-medium">
                {lead.createdAt.toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Last updated
              </p>

              <p className="mt-2 text-sm font-medium">
                {lead.updatedAt.toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>

        {/* Created by */}
        <section className="mt-4 rounded-xl border bg-card shadow-sm">
          <div className="flex items-center gap-3 p-5 sm:p-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Created by
              </p>

              <p className="mt-1 text-sm font-medium">
                {lead.createdBy.name}
              </p>

              <p className="text-sm text-muted-foreground">
                {lead.createdBy.email}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}