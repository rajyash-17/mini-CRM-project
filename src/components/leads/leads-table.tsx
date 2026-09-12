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

export function LeadsTable({ leads }: LeadsTableProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-base">
          All Leads
        </CardTitle>
      </CardHeader>

      <CardContent>
        {leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
            <h2 className="text-sm font-medium">
              No leads to display
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Add your first lead to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-4 py-3 font-medium">
                    Name
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Contact
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Source
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Status
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Follow-up
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Notes
                  </th>
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b last:border-0"
                  >
                    <td className="px-4 py-4 font-medium">
                      {lead.name}
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
                      <Badge variant="outline">
                        {statusLabels[lead.status]}
                      </Badge>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
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
        )}
      </CardContent>
    </Card>
  );
}