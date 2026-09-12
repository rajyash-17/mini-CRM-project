"use client";

import { useState } from "react";

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
};

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

export function PipelineColumn({
  title,
  leads,
  onLeadUpdated,
}: PipelineColumnProps) {
    
const [updating, setUpdating] = useState(false);

async function handleStatusChange(
  leadId: string,
  newStatus: Lead["status"]
) {
    console.log("STATUS CHANGE", leadId, newStatus);
  setUpdating(true);

  try {
    console.log("PATCH START");
    const response = await fetch(
      `/api/leads/${leadId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      }
    );
    console.log("PATCH END", response.status);

    if (!response.ok) {
      throw new Error("Failed to update lead status");
    }

    onLeadUpdated(leadId, newStatus);

  } catch (error) {
    console.error(
      "Update lead status error:",
      error
    );
  } finally {
    setUpdating(false);
  }
}
  return (
    <div className="min-w-[280px] flex-1">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">
          {title}
        </h2>

        <Badge variant="secondary">
          {leads.length}
        </Badge>
      </div>

      <div className="space-y-3">
        {leads.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No leads
          </div>
        ) : (
          leads.map((lead) => (
            
              <Card 
              key={lead.id}
              className="transition-colors hover:bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm">
                    {lead.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-2 text-sm">
                    
                  <p className="text-muted-foreground">
                    {sourceLabels[lead.source]}
                  </p>
                  <div className="pt-2">
  <label
    htmlFor={`status-${lead.id}`}
    className="text-xs text-muted-foreground"
  >
    Status
  </label>

  <select
    id={`status-${lead.id}`}
    value={lead.status}
    disabled={updating}
    onChange={(event) =>
      handleStatusChange(
        lead.id,
        event.target.value as Lead["status"]
      )
    }
    className="border-input bg-background mt-1 h-8 w-full rounded-md border px-2 text-xs"
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

                  {lead.email && (
                    <p className="truncate">
                      {lead.email}
                    </p>
                  )}

                  {lead.followUpAt && (
                    <p className="text-xs text-muted-foreground">
                      Follow-up:{" "}
                      {new Date(
                        lead.followUpAt
                      ).toLocaleString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            
          ))
        )}
      </div>
    </div>
  );
}