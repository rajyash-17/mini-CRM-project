"use client";

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

type AddLeadDialogProps = {
  onLeadCreated?: () => void;
};

export function AddLeadDialog({
  onLeadCreated,
}: AddLeadDialogProps) {
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
      name: "",
      email: "",
      phone: "",
      source: "WEBSITE",
      status: "NEW",
      followUpAt: "",
      notes: "",
    },
  });

  async function onSubmit(data: LeadFormData) {
    setServerError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...data,

          followUpAt: data.followUpAt
            ? new Date(data.followUpAt).toISOString()
            : "",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(
          result.error || "Failed to create lead"
        );
        return;
      }

      reset();
      setOpen(false);

      onLeadCreated?.();
    } catch {
      setServerError(
        "Something went wrong. Please try again."
      );
    }
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);

    if (!value) {
      reset();
      setServerError("");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger render={<Button />}>
        + Add Lead
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Lead</DialogTitle>

          <DialogDescription>
            Add a new lead to your CRM.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Name */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium"
            >
              Name
            </label>

            <Input
              id="name"
              placeholder="John Doe"
              {...register("name")}
            />

            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium"
            >
              Email
            </label>

            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register("email")}
            />

            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="text-sm font-medium"
            >
              Phone
            </label>

            <Input
              id="phone"
              placeholder="+91 9876543210"
              {...register("phone")}
            />
          </div>

          {/* Source */}
          <div className="space-y-2">
            <label
              htmlFor="source"
              className="text-sm font-medium"
            >
              Source
            </label>

            <select
              id="source"
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

          {/* Status */}
          <div className="space-y-2">
            <label
              htmlFor="status"
              className="text-sm font-medium"
            >
              Status
            </label>

            <select
              id="status"
              {...register("status")}
              className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
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

          {/* Follow-up */}
          <div className="space-y-2">
            <label
              htmlFor="followUpAt"
              className="text-sm font-medium"
            >
              Follow-up
            </label>

            <Input
              id="followUpAt"
              type="datetime-local"
              {...register("followUpAt")}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label
              htmlFor="notes"
              className="text-sm font-medium"
            >
              Notes
            </label>

            <textarea
              id="notes"
              placeholder="Add notes about this lead..."
              {...register("notes")}
              className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-20 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
            />
          </div>

          {/* Server error */}
          {serverError && (
            <p className="text-sm text-destructive">
              {serverError}
            </p>
          )}

          {/* Actions */}
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
                ? "Creating..."
                : "Create Lead"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}