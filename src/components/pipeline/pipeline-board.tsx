"use client";

import { useState } from "react";

import { PipelineColumn } from "@/components/pipeline/pipeline-column";

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
  status: "NEW" | "CONTACTED" | "NEGOTIATING" | "CLOSED";
  notes: string | null;
  followUpAt: string | null;
};

const columns = [
  {
    title: "New",
    status: "NEW" as const,
  },
  {
    title: "Contacted",
    status: "CONTACTED" as const,
  },
  {
    title: "Negotiating",
    status: "NEGOTIATING" as const,
  },
  {
    title: "Closed",
    status: "CLOSED" as const,
  },
];

type PipelineBoardProps = {
  leads: Lead[];
};

export function PipelineBoard({
  leads: initialLeads,
}: PipelineBoardProps) {
  const [leads, setLeads] = useState(initialLeads);

  function handleLeadUpdated(
    leadId: string,
    newStatus: Lead["status"]
  ) {
    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              status: newStatus,
            }
          : lead
      )
    );
  }

  return (
    <div className="mt-6 overflow-x-auto pb-4">
      <div className="flex min-w-[1210px] gap-4">
        {columns.map((column) => {
          const columnLeads = leads.filter(
            (lead) => lead.status === column.status
          );

          return (
            <PipelineColumn
              key={column.status}
              title={column.title}
              leads={columnLeads}
              onLeadUpdated={handleLeadUpdated}
            />
          );
        })}
      </div>
    </div>
  );
}