"use server";

import { fetchApi } from "@/lib/api-client";

/**
 * Updates the status of a membership application.
 * For APPROVED status, calls the approve_membership_application RPC
 * which also creates the member record automatically.
 */
export async function updateApplicationStatus(
  applicationId: string,
  newStatus: "UNDER_REVIEW" | "APPROVED" | "REJECTED",
  adminNotes?: string
) {
  try {
    if (newStatus === "APPROVED") {
      const data = await fetchApi(`/admin/applications/${applicationId}/approve`, {
        method: "POST",
      });

      if (adminNotes) {
        await fetchApi(`/admin/applications/${applicationId}/notes`, {
          method: "PATCH",
          body: JSON.stringify({ notes: adminNotes }),
        });
      }

      return { success: true, data };
    }

    await fetchApi(`/admin/applications/${applicationId}/status`, {
      method: "PATCH",
      body: JSON.stringify({
        status: newStatus,
        adminNotes: adminNotes || undefined,
      }),
    });

    return { success: true };
  } catch (err: any) {
    console.error("Status update error:", err);
    return { success: false, error: err.message || "Failed to update application status." };
  }
}

/**
 * Saves admin notes for an application without changing its status.
 */
export async function saveAdminNotes(applicationId: string, notes: string) {
  try {
    await fetchApi(`/admin/applications/${applicationId}/notes`, {
      method: "PATCH",
      body: JSON.stringify({ notes }),
    });
    return { success: true };
  } catch (err: any) {
    console.error("Save notes error:", err);
    return { success: false, error: err.message || "Failed to save notes." };
  }
}
