"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateApplicationStatus } from "./actions";

interface ApplicationActionsProps {
  applicationId: string;
  currentStatus: string;
}

export function ApplicationActions({ applicationId, currentStatus }: ApplicationActionsProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (action: "APPROVED" | "REJECTED") => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await updateApplicationStatus(applicationId, action);

      if (result.success) {
        // Refresh the page to reflect new status from server
        router.refresh();
      } else {
        setError(result.error || "Action failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Only show action buttons for actionable statuses
  if (currentStatus !== "PENDING" && currentStatus !== "UNDER_REVIEW") {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex space-x-3">
        <Button 
          variant="outline" 
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 h-10 px-6"
          onClick={() => handleAction("REJECTED")}
          disabled={isProcessing}
        >
          <X size={18} className="mr-2" /> Reject
        </Button>
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white h-10 px-6 shadow-sm"
          onClick={() => handleAction("APPROVED")}
          disabled={isProcessing}
        >
          <Check size={18} className="mr-2" /> Approve Application
        </Button>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
