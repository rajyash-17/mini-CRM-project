"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FollowUp = {
  id: string;
  dueAt: string;
  completedAt: string | null;
  note: string | null;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
  };
};

type LeadFollowUpsProps = {
  leadId: string;
  legacyFollowUpAt?: string | null;
};

function getFollowUpState(followUp: FollowUp) {
  if (followUp.completedAt) {
    return "completed";
  }

  const now = new Date();
  const dueAt = new Date(followUp.dueAt);

  if (dueAt < now) {
    return "overdue";
  }

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  if (dueAt >= todayStart && dueAt < tomorrowStart) {
    return "today";
  }

  return "upcoming";
}

function formatDate(value: string) {
  return new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}


export function LeadFollowUps({
  leadId,
  legacyFollowUpAt,
}: LeadFollowUpsProps) {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [dueAt, setDueAt] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadFollowUps() {
      try {
        const response = await fetch(
          `/api/leads/${leadId}/follow-ups`
        );

        if (!response.ok) {
  const errorText = await response.text();

  console.error(
    "Follow-ups API error:",
    response.status,
    errorText
  );

  throw new Error("Failed to fetch follow-ups");
}

        const data = await response.json();

        if (!cancelled) {
          setFollowUps(data.followUps as FollowUp[]);
          setLoading(false);
        }
      } catch (error) {
        console.error("Fetch follow-ups error:", error);

        if (!cancelled) {
          setFollowUps([]);
          setLoading(false);
          setError("Failed to load follow-ups.");
        }
      }
    }

    loadFollowUps();

    return () => {
      cancelled = true;
    };
  }, [leadId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!dueAt) {
      setError("Please choose a follow-up date and time.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `/api/leads/${leadId}/follow-ups`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dueAt: new Date(dueAt).toISOString(),
            note: note.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to schedule follow-up.");
        return;
      }

      setFollowUps((current) =>
        [...current, data.followUp].sort(
          (a, b) =>
            new Date(a.dueAt).getTime() -
            new Date(b.dueAt).getTime()
        )
      );

      setDueAt("");
      setNote("");
    } catch (error) {
      console.error("Create follow-up error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleCompleted(followUp: FollowUp) {
    setUpdatingId(followUp.id);
    setError("");

    try {
      const response = await fetch(
        `/api/leads/${leadId}/follow-ups/${followUp.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completed: !followUp.completedAt,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update follow-up.");
        return;
      }

      setFollowUps((current) =>
        current.map((item) =>
          item.id === followUp.id
            ? data.followUp
            : item
        )
      );
    } catch (error) {
      console.error("Update follow-up error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  const groupedFollowUps = {
    overdue: followUps.filter(
      (item) => getFollowUpState(item) === "overdue"
    ),
    today: followUps.filter(
      (item) => getFollowUpState(item) === "today"
    ),
    upcoming: followUps.filter(
      (item) => getFollowUpState(item) === "upcoming"
    ),
    completed: followUps.filter(
      (item) => getFollowUpState(item) === "completed"
    ),
  };

  function renderFollowUp(followUp: FollowUp) {
    const state = getFollowUpState(followUp);
    const isCompleted = state === "completed";
    const isUpdating = updatingId === followUp.id;

    return (
      <div
        key={followUp.id}
        className="rounded-lg border p-4"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p
                className={`text-sm font-medium ${
                  isCompleted
                    ? "text-muted-foreground line-through"
                    : ""
                }`}
              >
                {formatDate(followUp.dueAt)}
              </p>

              {state === "overdue" && (
                <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                  Overdue
                </span>
              )}

              {state === "today" && (
                <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:text-yellow-400">
                  Today
                </span>
              )}

              {state === "completed" && (
                <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                  Completed
                </span>
              )}
            </div>

            {followUp.note && (
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {followUp.note}
              </p>
            )}

            <p className="mt-3 text-xs text-muted-foreground">
              Created by {followUp.createdBy.name}
            </p>

            {followUp.completedAt && (
              <p className="mt-1 text-xs text-muted-foreground">
                Completed {formatDate(followUp.completedAt)}
              </p>
            )}
          </div>

          <Button
            type="button"
            size="sm"
            variant={isCompleted ? "outline" : "default"}
            onClick={() => toggleCompleted(followUp)}
            disabled={isUpdating}
            className="w-full shrink-0 sm:w-auto"
          >
            {isUpdating
              ? "Updating..."
              : isCompleted
                ? "Mark pending"
                : "Mark completed"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Follow-ups</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="followUpDueAt"
                className="text-sm font-medium"
              >
                Follow-up date & time
              </label>

              <Input
                id="followUpDueAt"
                type="datetime-local"
                value={dueAt}
                onChange={(event) => {
                  setDueAt(event.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                disabled={saving}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="followUpNote"
                className="text-sm font-medium"
              >
                Follow-up note
              </label>

              <Textarea
                id="followUpNote"
                value={note}
                onChange={(event) => {
                  setNote(event.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                placeholder="What should be discussed or followed up on?"
                className="min-h-24 resize-y"
                disabled={saving}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Schedule the next action for this lead.
            </p>

            <Button
              type="submit"
              disabled={saving || !dueAt}
              className="w-full sm:w-auto"
            >
              {saving
                ? "Scheduling..."
                : "Schedule Follow-up"}
            </Button>
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}
        </form>

        <div className="border-t" />

        {loading ? (
          <div className="space-y-4">
            <div className="h-24 animate-pulse rounded-lg bg-muted" />
            <div className="h-24 animate-pulse rounded-lg bg-muted" />
          </div>
        ) : (
          <div className="space-y-6">
            {groupedFollowUps.overdue.length > 0 && (
              <section className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold">
                    Overdue
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Follow-ups that still need attention.
                  </p>
                </div>

                {groupedFollowUps.overdue.map(renderFollowUp)}
              </section>
            )}

            {groupedFollowUps.today.length > 0 && (
              <section className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold">
                    Today
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Follow-ups scheduled for today.
                  </p>
                </div>

                {groupedFollowUps.today.map(renderFollowUp)}
              </section>
            )}

            {groupedFollowUps.upcoming.length > 0 && (
              <section className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold">
                    Upcoming
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Future follow-ups.
                  </p>
                </div>

                {groupedFollowUps.upcoming.map(renderFollowUp)}
              </section>
            )}

            {groupedFollowUps.completed.length > 0 && (
              <section className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold">
                    Completed
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Previously completed follow-ups.
                  </p>
                </div>

                {groupedFollowUps.completed.map(renderFollowUp)}
              </section>
            )}

            {followUps.length === 0 && !legacyFollowUpAt && (
              <div className="rounded-lg border border-dashed px-4 py-8 text-center">
                <p className="text-sm font-medium">
                  No follow-ups scheduled
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
  Schedule the next action so this lead doesn&apos;t get
  forgotten.
</p>
              </div>
            )}

            {legacyFollowUpAt &&  (
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-medium">
                  Existing follow-up
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(legacyFollowUpAt)}
                </p>

                <p className="mt-3 text-xs text-muted-foreground">
                  This follow-up was created using the original lead
                  scheduling field.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}