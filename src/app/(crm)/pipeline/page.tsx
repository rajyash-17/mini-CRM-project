import { prisma } from "@/lib/prisma";
import { PipelineBoard } from "@/components/pipeline/pipeline-board";


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

        <PipelineBoard leads={serializedLeads} />
      </div>
    </div>
  );
}