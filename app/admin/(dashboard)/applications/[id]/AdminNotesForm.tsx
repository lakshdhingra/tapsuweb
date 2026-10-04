"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { saveAdminNotes } from "./actions";

interface AdminNotesFormProps {
  applicationId: string;
  initialNotes: string;
}

export function AdminNotesForm({ applicationId, initialNotes }: AdminNotesFormProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);

    try {
      const result = await saveAdminNotes(applicationId, notes);
      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
      <h3 className="font-heading font-bold text-gray-900 mb-3">Admin Notes</h3>
      <textarea 
        className="w-full h-24 p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        placeholder="Add internal notes here... (Visible only to admins)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      ></textarea>
      <div className="mt-3 flex items-center justify-end space-x-2">
        {saved && <span className="text-xs text-green-600 font-medium">Saved!</span>}
        <Button size="sm" variant="secondary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Note"}
        </Button>
      </div>
    </div>
  );
}
