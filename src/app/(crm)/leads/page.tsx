"use client";

import { useEffect, useMemo, useState } from "react";

import { LeadsTable } from "@/components/leads/leads-table";
import { AddLeadDialog } from "@/components/leads/add-lead-dialog";
import { Input } from "@/components/ui/input";

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

const statusLabels = {
  ALL: "All Statuses",
  NEW: "New",
  CONTACTED: "Contacted",
  NEGOTIATING: "Negotiating",
  CLOSED: "Closed",
};

const sourceLabels = {
  ALL: "All Sources",
  WEBSITE: "Website",
  LINKEDIN: "LinkedIn",
  REFERRAL: "Referral",
  INSTAGRAM: "Instagram",
  COLD_OUTREACH: "Cold Outreach",
  OTHER: "Other",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sourceFilter, setSourceFilter] = useState("ALL");

  async function fetchLeads() {
    try {
      const response = await fetch("/api/leads");

      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }

      const data = await response.json();

      setLeads(data.leads);
    } catch (error) {
      console.error("Fetch leads error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadLeads() {
      try {
        const response = await fetch("/api/leads");

        if (!response.ok) {
          throw new Error("Failed to fetch leads");
        }

        const data = await response.json();

        if (!cancelled) {
          setLeads(data.leads);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Fetch leads error:", error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadLeads();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredLeads = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return leads.filter((lead) => {
      const matchesSearch =
        !normalizedSearch ||
        lead.name.toLowerCase().includes(normalizedSearch) ||
        lead.email?.toLowerCase().includes(normalizedSearch) ||
        lead.phone?.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" ||
        lead.status === statusFilter;

      const matchesSource =
        sourceFilter === "ALL" ||
        lead.source === sourceFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSource
      );
    });
  }, [leads, search, statusFilter, sourceFilter]);

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

          <AddLeadDialog onLeadCreated={fetchLeads} />
        </div>

        {/* Leads Card */}
        <div className="mt-6 rounded-xl border bg-card">
          <div className="p-6">
            <h2 className="text-base font-semibold">
              All Leads
            </h2>

            {/* Filters */}
            <div className="mt-4 flex flex-col gap-3 md:flex-row">
              <Input
                placeholder="Search by name, email or phone..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                className="md:max-w-sm"
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="border-input bg-background h-9 rounded-md border px-3 text-sm"
              >
                {Object.entries(statusLabels).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>

              <select
                value={sourceFilter}
                onChange={(event) =>
                  setSourceFilter(event.target.value)
                }
                className="border-input bg-background h-9 rounded-md border px-3 text-sm"
              >
                {Object.entries(sourceLabels).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Table */}
            <div className="mt-6">
              <LeadsTable leads={filteredLeads} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}