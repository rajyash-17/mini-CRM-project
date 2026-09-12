import Link from "next/link";

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
  status: Lead["status"];
  leads: Lead[];
};

const sourceLabels = {
  WEBSITE: "Website",
  LINKEDIN: "LinkedIn",
  REFERRAL: "Referral",
  INSTAGRAM: "Instagram",
  COLD_OUTREACH: "Cold Outreach",
  OTHER: "Other",
};

export function PipelineColumn({
  title,
  status,
  leads,
}: PipelineColumnProps) {
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
            <Link
              key={lead.id}
              href={`/leads/${lead.id}`}
              className="block"
            >
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm">
                    {lead.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    {sourceLabels[lead.source]}
                  </p>

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
            </Link>
          ))
        )}
      </div>
    </div>
  );
}