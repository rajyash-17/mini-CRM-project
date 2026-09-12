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
      followUpAt: lead.followUpAt
        ? new Date(lead.followUpAt)
            .toISOString()
            .slice(0, 16)
        : "",
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
        followUpAt: lead.followUpAt
          ? new Date(lead.followUpAt)
              .toISOString()
              .slice(0, 16)
          : "",
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

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>

          <DialogDescription>
            Update this lead&apos;s information.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label
              htmlFor="edit-name"
              className="text-sm font-medium"
            >
              Name
            </label>

            <Input
              id="edit-name"
              {...register("name")}
            />

            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

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
              {...register("email")}
            />

            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="edit-phone"
              className="text-sm font-medium"
            >
              Phone
            </label>

            <Input
              id="edit-phone"
              {...register("phone")}
            />
          </div>

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
              className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
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
              className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
            >
              <option value="NEW">New</option>
              <option value="CONTACTED">
                Contacted
              </option>
              <option value="NEGOTIATING">
                Negotiating
              </option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="edit-followUpAt"
              className="text-sm font-medium"
            >
              Follow-up
            </label>

            <Input
              id="edit-followUpAt"
              type="datetime-local"
              {...register("followUpAt")}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="edit-notes"
              className="text-sm font-medium"
            >
              Notes
            </label>

            <textarea
              id="edit-notes"
              {...register("notes")}
              className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-20 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
            />
          </div>

          {serverError && (
            <p className="text-sm text-destructive">
              {serverError}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
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