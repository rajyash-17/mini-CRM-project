import Link from "next/link";
import {
  ArrowRight,
  CircleCheck,
  CircleDot,
  Handshake,
  Users,
} from "lucide-react";

import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { prisma } from "@/lib/prisma";

const statusLabels = {
  NEW: "New",
  CONTACTED: "Contacted",
  NEGOTIATING: "Negotiating",
  CLOSED: "Closed",
} as const;

const sourceLabels = {
  WEBSITE: "Website",
  LINKEDIN: "LinkedIn",
  REFERRAL: "Referral",
  INSTAGRAM: "Instagram",
  COLD_OUTREACH: "Cold Outreach",
  OTHER: "Other",
} as const;

export default async function DashboardPage() {
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const [
    total,
    newLeads,
    contacted,
    negotiating,
    closed,
    recentLeads,
    statusCounts,
    sourceCounts,
    overdueFollowUps,
    todayFollowUps,
    upcomingFollowUps,
  ] = await Promise.all([
    prisma.lead.count(),

    prisma.lead.count({
      where: { status: "NEW" },
    }),

    prisma.lead.count({
      where: { status: "CONTACTED" },
    }),

    prisma.lead.count({
      where: { status: "NEGOTIATING" },
    }),

    prisma.lead.count({
      where: { status: "CLOSED" },
    }),

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

    prisma.lead.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    }),

    prisma.lead.groupBy({
      by: ["source"],
      _count: {
        _all: true,
      },
    }),

    prisma.followUp.count({
      where: {
        completedAt: null,
        dueAt: {
          lt: now,
        },
      },
    }),

    prisma.followUp.count({
      where: {
        completedAt: null,
        dueAt: {
          gte: startOfToday,
          lt: startOfTomorrow,
        },
      },
    }),

    prisma.followUp.count({
      where: {
        completedAt: null,
        dueAt: {
          gte: startOfTomorrow,
        },
      },
    }),
  ]);

  const statusData = (
    Object.keys(statusLabels) as Array<keyof typeof statusLabels>
  ).map((status) => ({
    name: statusLabels[status],
    value:
      statusCounts.find((item) => item.status === status)?._count._all ?? 0,
  }));

  const sourceData = (
    Object.keys(sourceLabels) as Array<keyof typeof sourceLabels>
  ).map((source) => ({
    name: sourceLabels[source],
    value:
      sourceCounts.find((item) => item.source === source)?._count._all ?? 0,
  }));

  const followUpData = [
    {
      name: "Overdue",
      value: overdueFollowUps,
    },
    {
      name: "Today",
      value: todayFollowUps,
    },
    {
      name: "Upcoming",
      value: upcomingFollowUps,
    },
  ];

  const stats = [
    {
      label: "Total Leads",
      value: total,
      icon: Users,
      description: "All leads",
    },
    {
      label: "New",
      value: newLeads,
      icon: CircleDot,
      description: "Awaiting contact",
    },
    {
      label: "Contacted",
      value: contacted,
      icon: Users,
      description: "In conversation",
    },
    {
      label: "Negotiating",
      value: negotiating,
      icon: Handshake,
      description: "Potential deals",
    },
    {
      label: "Closed",
      value: closed,
      icon: CircleCheck,
      description: "Completed deals",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/20 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Overview
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Keep track of your leads and sales pipeline.
            </p>
          </div>

          <Link
            href="/leads"
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-muted sm:w-auto"
          >
            View all leads
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-xl border bg-card p-4 shadow-sm sm:p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>

                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>

                <p className="mt-3 text-2xl font-semibold tracking-tight sm:mt-4 sm:text-3xl">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Analytics */}
        <DashboardCharts
          statusData={statusData}
          sourceData={sourceData}
          followUpData={followUpData}
        />

        {/* Recent Leads */}
        <div className="mt-6 rounded-xl border bg-card shadow-sm sm:mt-8">
          <div className="flex items-center justify-between gap-4 border-b px-4 py-4 sm:px-6 sm:py-5">
            <div>
              <h2 className="font-semibold">Recent Leads</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                The latest leads added to your CRM.
              </p>
            </div>

            <Link
              href="/leads"
              className="hidden items-center gap-1 text-sm font-medium hover:underline sm:flex"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Users className="mx-auto h-8 w-8 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">No leads yet</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Add your first lead to get started.
              </p>

              <Link
                href="/leads"
                className="mt-4 inline-flex text-sm font-medium hover:underline"
              >
                Go to Leads
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/leads/${lead.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-4 transition-colors hover:bg-muted/40 sm:gap-4 sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {lead.name}
                    </p>

                    {lead.email && (
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {lead.email}
                      </p>
                    )}
                  </div>

                  <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium sm:px-3">
                    {statusLabels[lead.status]}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
          <Link
            href="/leads"
            className="group rounded-xl border bg-card p-5 shadow-sm transition-colors hover:bg-muted/40 sm:p-6"
          >
            <p className="font-semibold">Manage Leads</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Add, edit, search, and manage your leads.
            </p>

            <div className="mt-4 flex items-center gap-1 text-sm font-medium">
              Open Leads
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/pipeline"
            className="group rounded-xl border bg-card p-6 shadow-sm transition-colors hover:bg-muted/40"
          >
            <p className="font-semibold">Sales Pipeline</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Track leads through each stage of the sales process.
            </p>

            <div className="mt-4 flex items-center gap-1 text-sm font-medium">
              Open Pipeline
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}