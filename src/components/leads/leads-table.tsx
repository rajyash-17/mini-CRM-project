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

type LeadsTableProps = {
  leads: Lead[];
};

const statusLabels = {
  NEW: "New",
  CONTACTED: "Contacted",
  NEGOTIATING: "Negotiating",
  CLOSED: "Closed",
};

const sourceLabels = {
  WEBSITE: "Website",
  LINKEDIN: "LinkedIn",
  REFERRAL: "Referral",
  INSTAGRAM: "Instagram",
  COLD_OUTREACH: "Cold Outreach",
  OTHER: "Other",
};

function getStatusClassName(status: Lead["status"]) {
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

export function LeadsTable({ leads }: LeadsTableProps) {
  return (
    <Card className="mt-6 overflow-hidden">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-base">All Leads</CardTitle>
      </CardHeader>

      <CardContent className="px-0 sm:px-6">
        {leads.length === 0 ? (
          <div className="mx-4 flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center sm:mx-0">
            <h2 className="text-sm font-medium">
              No leads to display
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Add your first lead to get started.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30">
                    <tr className="border-b text-left">
                      <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Name
                      </th>

                      <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Contact
                      </th>

                      <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Source
                      </th>

                      <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Status
                      </th>

                      <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Follow-up
                      </th>

                      <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Notes
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {leads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-b transition-colors hover:bg-muted/30 last:border-0"
                      >
                        <td className="px-4 py-4 font-medium">
                          <Link
                            href={`/leads/${lead.id}`}
                            className="hover:underline"
                          >
                            {lead.name}
                          </Link>
                        </td>

                        <td className="px-4 py-4">
                          <div>
                            {lead.email && (
                              <p>{lead.email}</p>
                            )}

                            {lead.phone && (
                              <p className="text-muted-foreground">
                                {lead.phone}
                              </p>
                            )}

                            {!lead.email && !lead.phone && (
                              <span className="text-muted-foreground">
                                —
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          {sourceLabels[lead.source]}
                        </td>

                        <td className="px-4 py-4">
                          <Badge
                            variant="outline"
                            className={getStatusClassName(
                              lead.status
                            )}
                          >
                            {statusLabels[lead.status]}
                          </Badge>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {lead.followUpAt
                            ? new Date(
                                lead.followUpAt
                              ).toLocaleString()
                            : "—"}
                        </td>

                        <td className="max-w-xs px-4 py-4">
                          <p className="truncate text-muted-foreground">
                            {lead.notes || "—"}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile lead cards */}
            <div className="divide-y md:hidden">
              {leads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/leads/${lead.id}`}
                  className="block p-4 transition-colors hover:bg-muted/30 active:bg-muted/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {lead.name}
                      </p>

                      {lead.email && (
                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {lead.email}
                        </p>
                      )}
                    </div>

                    <Badge
                      variant="outline"
                      className={`shrink-0 ${getStatusClassName(
                        lead.status
                      )}`}
                    >
                      {statusLabels[lead.status]}
                    </Badge>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>{sourceLabels[lead.source]}</span>

                    {lead.phone && (
                      <>
                        <span>•</span>
                        <span>{lead.phone}</span>
                      </>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 text-xs text-muted-foreground">
                      {lead.followUpAt
                        ? `Follow-up: ${new Date(
                            lead.followUpAt
                          ).toLocaleString()}`
                        : "No follow-up scheduled"}
                    </div>

                    <span className="shrink-0 text-xs font-medium">
                      View →
                    </span>
                  </div>

                  {lead.notes && (
                    <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
                      {lead.notes}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}