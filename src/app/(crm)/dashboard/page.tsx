import Link from "next/link";
import { prisma } from "@/lib/prisma";

const statusLabels = {
  NEW: "New",
  CONTACTED: "Contacted",
  NEGOTIATING: "Negotiating",
  CLOSED: "Closed",
};

export default async function DashboardPage() {
  const [total, newLeads, contacted, negotiating, closed, recentLeads] =
    await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.lead.count({ where: { status: "CONTACTED" } }),
      prisma.lead.count({ where: { status: "NEGOTIATING" } }),
      prisma.lead.count({ where: { status: "CLOSED" } }),
      prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
        },
      }),
    ]);

  const stats = [
    { label: "Total Leads", value: total },
    { label: "New", value: newLeads },
    { label: "Contacted", value: contacted },
    { label: "Negotiating", value: negotiating },
    { label: "Closed", value: closed },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of your leads and sales pipeline.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border bg-card p-5"
            >
              <p className="text-sm text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h2 className="font-semibold">Recent Leads</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your latest leads.
              </p>
            </div>

            <Link
              href="/leads"
              className="text-sm font-medium hover:underline"
            >
              View all
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              No leads yet.
            </div>
          ) : (
            <div className="divide-y">
              {recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/leads/${lead.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-muted/50"
                >
                  <div>
                    <p className="text-sm font-medium">{lead.name}</p>
                    {lead.email && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {lead.email}
                      </p>
                    )}
                  </div>

                  <span className="text-sm text-muted-foreground">
                    {statusLabels[lead.status]}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}