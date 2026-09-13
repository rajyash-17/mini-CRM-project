"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Note = {
  id: string;
  content: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
  };
};

type LeadNotesProps = {
  leadId: string;
  legacyNote?: string | null;
};

export function LeadNotes({
  leadId,
  legacyNote,
}: LeadNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadNotes() {
      try {
        const response = await fetch(`/api/leads/${leadId}/notes`);

        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }

        const data = await response.json();

        if (!cancelled) {
          setNotes(data.notes as Note[]);
          setLoading(false);
        }
      } catch (error) {
        console.error("Fetch notes error:", error);

        if (!cancelled) {
          setNotes([]);
          setLoading(false);
        }
      }
    }

    loadNotes();

    return () => {
      cancelled = true;
    };
  }, [leadId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setError("Note cannot be empty.");
      return;
    }

    if (trimmedContent.length > 5000) {
      setError("Note cannot exceed 5000 characters.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/leads/${leadId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: trimmedContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add note.");
        return;
      }

      setNotes((currentNotes) => [data.note, ...currentNotes]);
      setContent("");
    } catch (error) {
      console.error("Create note error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function formatDate(value: string) {
    return new Date(value).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }
  function handleContentChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setContent(event.target.value);

    if (error) {
      setError("");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Notes</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
  value={content}
  onChange={handleContentChange}
  placeholder="Add a note about this lead, conversation, requirement, or next step..."
  className="min-h-28 resize-y"
  disabled={saving}
/>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {content.length}/5000 characters
            </p>

            <Button
              type="submit"
              disabled={saving || !content.trim()}
              className="w-full sm:w-auto"
            >
              {saving ? "Adding note..." : "Add Note"}
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
            <div className="h-20 animate-pulse rounded-lg bg-muted" />
            <div className="h-20 animate-pulse rounded-lg bg-muted" />
          </div>
        ) : notes.length === 0 && !legacyNote ? (
          <div className="rounded-lg border border-dashed px-4 py-8 text-center">
            <p className="text-sm font-medium">No notes yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add the first note to keep track of conversations and next steps.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {legacyNote &&  (
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium">
                    Existing lead note
                  </p>

                  <span className="text-xs text-muted-foreground">
                    Previous note
                  </span>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {legacyNote}
                </p>
              </div>
            )}

            {notes.map((note) => (
              <article
                key={note.id}
                className="rounded-lg border p-4"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium">
                    {note.createdBy.name}
                  </p>

                  <time
                    dateTime={note.createdAt}
                    className="text-xs text-muted-foreground"
                  >
                    {formatDate(note.createdAt)}
                  </time>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
                  {note.content}
                </p>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}