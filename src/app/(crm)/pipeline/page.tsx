import { prisma } from "@/lib/prisma";
import { PipelineColumn } from "@/components/pipeline/pipeline-column";

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

export default async function PipelinePage() {
  const leads = await prisma.lead.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      source: true,
      status: true,
      notes: true,
      followUpAt: true,
    },
  });

  const serializedLeads = leads.map((lead) => ({
    ...lead,
    followUpAt: lead.followUpAt
      ? lead.followUpAt.toISOString()
      : null,
  }));

  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Pipeline
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Track leads through each stage of the sales process.
          </p>
        </div>

        <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => {
            const columnLeads = serializedLeads.filter(
              (lead) => lead.status === column.status
            );

            return (
              <PipelineColumn
                key={column.status}
                title={column.title}
                status={column.status}
                leads={columnLeads}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}