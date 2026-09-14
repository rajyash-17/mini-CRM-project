"use client";

import Link from "next/link";
import { CalendarClock, Mail, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Lead = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  source:
    | "WEBSITE"
    | "LINKEDIN"
    | "REFERRAL"
    | "INSTAGRAM"
    | "COLD_OUTREACH"
    | "OTHER";
  status:
    | "NEW"
    | "CONTACTED"
    | "NEGOTIATING"
    | "CLOSED";
  notes: string | null;
  followUpAt: string | null;
};

type PipelineColumnProps = {
  title: string;
  leads: Lead[];
  onLeadUpdated: (
    leadId: string,
    newStatus: Lead["status"]
  ) => void;
};

const sourceLabels = {
  WEBSITE: "Website",
  LINKEDIN: "LinkedIn",
  REFERRAL: "Referral",
  INSTAGRAM: "Instagram",
  COLD_OUTREACH: "Cold Outreach",
  OTHER: "Other",
} as const;

const statusOptions = [
  {
    value: "NEW",
    label: "New",
  },
  {
    value: "CONTACTED",
    label: "Contacted",
  },
  {
    value: "NEGOTIATING",
    label: "Negotiating",
  },
  {
    value: "CLOSED",
    label: "Closed",
  },
] as const;

function formatFollowUp(date: string) {
  return new Date(date).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function isOverdue(date: string) {
  return new Date(date).getTime() < Date.now();
}

export function PipelineColumn({
  title,
  leads,
  onLeadUpdated,
}: PipelineColumnProps) {
  async function handleStatusChange(
    leadId: string,
    newStatus: Lead["status"]
  ) {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update lead status");
      }

      onLeadUpdated(leadId, newStatus);
    } catch (error) {
      console.error("Update lead status error:", error);
    }
  }

  return (
    <div className="min-w-[290px] flex-1">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">{title}</h2>

        <Badge variant="secondary">{leads.length}</Badge>
      </div>

      <div className="min-h-[180px] space-y-3 rounded-xl bg-muted/30 p-2">
        {leads.length === 0 ? (
          <div className="flex min-h-[164px] items-center justify-center rounded-lg border border-dashed bg-background/50 p-6 text-center text-sm text-muted-foreground">
            No leads in this stage
          </div>
        ) : (
          leads.map((lead) => {
            const overdue =
              lead.followUpAt !== null &&
              isOverdue(lead.followUpAt);

            return (
              <Card
                key={lead.id}
                className="overflow-hidden transition-shadow hover:shadow-md"
              >
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/leads/${lead.id}`}
                      className="min-w-0"
                    >
                      <CardTitle className="truncate text-sm hover:underline">
                        {lead.name}
                      </CardTitle>
                    </Link>

                    <Badge
                      variant="outline"
                      className="shrink-0 text-[11px]"
                    >
                      {sourceLabels[lead.source]}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {(lead.email || lead.phone) && (
                    <div className="space-y-1.5">
                      {lead.email && (
                        <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{lead.email}</span>
                        </div>
                      )}

                      {lead.phone && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          <span>{lead.phone}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {lead.followUpAt && (
                    <div
                      className={`flex items-center gap-2 text-xs ${
                        overdue
                          ? "font-medium text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      <CalendarClock className="h-3.5 w-3.5 shrink-0" />

                      <span>
                        {overdue ? "Overdue: " : "Follow-up: "}
                        {formatFollowUp(lead.followUpAt)}
                      </span>
                    </div>
                  )}

                  <div className="border-t pt-3">
                    <label
                      htmlFor={`status-${lead.id}`}
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Move stage
                    </label>

                    <select
                      id={`status-${lead.id}`}
                      value={lead.status}
                      onChange={(event) =>
                        handleStatusChange(
                          lead.id,
                          event.target.value as Lead["status"]
                        )
                      }
                      className="border-input bg-background mt-1 h-8 w-full rounded-md border px-2 text-xs outline-none transition-colors focus:ring-2 focus:ring-ring"
                    >
                      {statusOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Link
                    href={`/leads/${lead.id}`}
                    className="block text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
                  >
                    View lead details →
                  </Link>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}