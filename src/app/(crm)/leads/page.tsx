import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AddLeadDialog } from "@/components/leads/add-lead-dialog";

export default function LeadsPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Leads
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage and track your leads.
            </p>
          </div>

          <AddLeadDialog />
        </div>

        {/* Leads Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">
              All Leads
            </CardTitle>
          </CardHeader>

          <CardContent>
            {/* Filters */}
            <div className="flex flex-col gap-3 md:flex-row">
              <Input
                placeholder="Search leads..."
                className="md:max-w-sm"
              />

              <Button variant="outline">
                Status
              </Button>

              <Button variant="outline">
                Source
              </Button>
            </div>

            {/* Empty State */}
            <div className="mt-10 flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
              <h2 className="text-sm font-medium">
                No leads to display
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Add your first lead to get started.
              </p>

              <Button className="mt-4">
                + Add Lead
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}