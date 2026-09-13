"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .optional()
    .or(z.literal("")),

  phone: z.string().trim().optional(),

  source: z.enum([
    "WEBSITE",
    "LINKEDIN",
    "REFERRAL",
    "INSTAGRAM",
    "COLD_OUTREACH",
    "OTHER",
  ]),

  status: z.enum([
    "NEW",
    "CONTACTED",
    "NEGOTIATING",
    "CLOSED",
  ]),

  followUpAt: z.string().optional(),

  notes: z.string().trim().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

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

type EditLeadDialogProps = {
  lead: Lead;
  onLeadUpdated?: () => void;
};

function getDateTimeValue(value: string | null) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 16);
}

export function EditLeadDialog({
  lead,
  onLeadUpdated,
}: EditLeadDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),

    defaultValues: {
      name: lead.name,
      email: lead.email ?? "",
      phone: lead.phone ?? "",
      source: lead.source,
      status: lead.status,
      followUpAt: getDateTimeValue(lead.followUpAt),
      notes: lead.notes ?? "",
    },
  });

  async function onSubmit(data: LeadFormData) {
    setServerError("");

    try {
      const response = await fetch(
        `/api/leads/${lead.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            followUpAt: data.followUpAt
              ? new Date(
                  data.followUpAt
                ).toISOString()
              : "",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setServerError(
          result.error || "Failed to update lead"
        );
        return;
      }

      setOpen(false);
      onLeadUpdated?.();
      router.refresh();
    } catch {
      setServerError(
        "Something went wrong. Please try again."
      );
    }
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);

    if (value) {
      reset({
        name: lead.name,
        email: lead.email ?? "",
        phone: lead.phone ?? "",
        source: lead.source,
        status: lead.status,
        followUpAt: getDateTimeValue(
          lead.followUpAt
        ),
        notes: lead.notes ?? "",
      });
    } else {
      setServerError("");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger
        render={
          <Button variant="outline">
            Edit Lead
          </Button>
        }
      />

      <DialogContent className="flex max-h-[90dvh] flex-col overflow-hidden p-0 sm:max-w-2xl">
        {/* Header */}
        <DialogHeader className="shrink-0 border-b px-6 py-5">
          <DialogTitle className="text-xl">
            Edit Lead
          </DialogTitle>

          <DialogDescription>
            Update the lead&apos;s contact information,
            status, follow-up, and notes.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* Scrollable form content */}
          <div className="min-h-0 flex-1 space-y-7 overflow-y-auto px-6 py-5">
            {/* Contact Information */}
            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold">
                  Contact Information
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Basic information used to contact this lead.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Name */}
                <div className="space-y-2 sm:col-span-2">
                  <label
                    htmlFor="edit-name"
                    className="text-sm font-medium"
                  >
                    Name{" "}
                    <span className="text-destructive">
                      *
                    </span>
                  </label>

                  <Input
                    id="edit-name"
                    placeholder="e.g. Rahul Sharma"
                    {...register("name")}
                  />

                  {errors.name && (
                    <p className="text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="edit-email"
                    className="text-sm font-medium"
                  >
                    Email
                  </label>

                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="name@company.com"
                    {...register("email")}
                  />

                  {errors.email && (
                    <p className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label
                    htmlFor="edit-phone"
                    className="text-sm font-medium"
                  >
                    Phone
                  </label>

                  <Input
                    id="edit-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    {...register("phone")}
                  />
                </div>
              </div>
            </section>

            <div className="border-t" />

            {/* Lead Details */}
            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold">
                  Lead Details
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Track where this lead came from and its
                  current stage.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Source */}
                <div className="space-y-2">
                  <label
                    htmlFor="edit-source"
                    className="text-sm font-medium"
                  >
                    Source
                  </label>

                  <select
                    id="edit-source"
                    {...register("source")}
                    className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <option value="WEBSITE">
                      Website
                    </option>

                    <option value="LINKEDIN">
                      LinkedIn
                    </option>

                    <option value="REFERRAL">
                      Referral
                    </option>

                    <option value="INSTAGRAM">
                      Instagram
                    </option>

                    <option value="COLD_OUTREACH">
                      Cold Outreach
                    </option>

                    <option value="OTHER">
                      Other
                    </option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label
                    htmlFor="edit-status"
                    className="text-sm font-medium"
                  >
                    Status
                  </label>

                  <select
                    id="edit-status"
                    {...register("status")}
                    className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <option value="NEW">
                      New
                    </option>

                    <option value="CONTACTED">
                      Contacted
                    </option>

                    <option value="NEGOTIATING">
                      Negotiating
                    </option>

                    <option value="CLOSED">
                      Closed
                    </option>
                  </select>
                </div>
              </div>
            </section>

            <div className="border-t" />

            {/* Follow-up */}
            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold">
                  Follow-up
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Schedule the next time you want to contact
                  this lead.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="edit-followUpAt"
                  className="text-sm font-medium"
                >
                  Follow-up date & time
                </label>

                <Input
                  id="edit-followUpAt"
                  type="datetime-local"
                  {...register("followUpAt")}
                />
              </div>
            </section>

            <div className="border-t" />

            {/* Notes */}
            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold">
                  Notes
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Add useful context about this lead or the
                  conversation so far.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="edit-notes"
                  className="text-sm font-medium"
                >
                  Lead notes
                </label>

                <textarea
                  id="edit-notes"
                  placeholder="Add notes about conversations, requirements, next steps..."
                  {...register("notes")}
                  className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-32 w-full resize-y rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
                />
              </div>
            </section>

            {/* Server Error */}
            {serverError && (
              <div className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2">
                <p className="text-sm text-destructive">
                  {serverError}
                </p>
              </div>
            )}
          </div>

          {/* Fixed Actions */}
          <div className="flex shrink-0 flex-col-reverse gap-2 border-t bg-background px-6 py-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}