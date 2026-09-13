"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type StatusData = {
  name: string;
  value: number;
};

type SourceData = {
  name: string;
  value: number;
};

type FollowUpData = {
  name: string;
  value: number;
};

type DashboardChartsProps = {
  statusData: StatusData[];
  sourceData: SourceData[];
  followUpData: FollowUpData[];
};

const statusColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

export function DashboardCharts({
  statusData,
  sourceData,
  followUpData,
}: DashboardChartsProps) {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      {/* Lead Status */}
      <div className="rounded-xl border bg-card p-4 shadow-sm sm:p-6">
        <div>
          <h2 className="font-semibold">Lead Status</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Distribution of leads across the sales pipeline.
          </p>
        </div>

        <div className="mt-6 h-[280px]">
          {statusData.every((item) => item.value === 0) ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No lead data available yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`${entry.name}-${index}`}
                      fill={statusColors[index % statusColors.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => [value, "Leads"]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--card))",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="mt-2 grid grid-cols-2 gap-3">
          {statusData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor:
                    statusColors[index % statusColors.length],
                }}
              />
              <span className="text-muted-foreground">{item.name}</span>
              <span className="ml-auto font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Sources */}
      <div className="rounded-xl border bg-card p-4 shadow-sm sm:p-6">
        <div>
          <h2 className="font-semibold">Lead Sources</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Where your leads are coming from.
          </p>
        </div>

        <div className="mt-6 h-[280px]">
          {sourceData.every((item) => item.value === 0) ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No lead data available yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sourceData}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />

                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  interval={0}
                />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />

                <Tooltip
                  formatter={(value) => [value, "Leads"]}
                  cursor={{
                    fill: "hsl(var(--muted) / 0.5)",
                  }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--card))",
                  }}
                />

                <Bar
                  dataKey="value"
                  radius={[5, 5, 0, 0]}
                  fill="hsl(var(--chart-1))"
                  maxBarSize={42}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Follow-ups */}
      <div className="rounded-xl border bg-card p-4 shadow-sm sm:p-6 lg:col-span-2">
        <div>
          <h2 className="font-semibold">Follow-up Overview</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep track of follow-ups that need your attention.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {followUpData.map((item) => (
            <div
              key={item.name}
              className="rounded-lg border bg-muted/20 p-4"
            >
              <p className="text-sm text-muted-foreground">{item.name}</p>
              <p className="mt-2 text-2xl font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}