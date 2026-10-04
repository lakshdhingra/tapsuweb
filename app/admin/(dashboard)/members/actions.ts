"use server";

import { fetchApi } from "@/lib/api-client";
import { revalidatePath } from "next/cache";

export async function toggleMemberSuspension(memberId: string, currentStatus: string) {
  try {
    const res = await fetchApi(`/admin/members/${memberId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ currentStatus }),
    });

    revalidatePath("/admin/members");
    return { success: true, newStatus: res.newStatus };
  } catch (err: any) {
    console.error("Toggle suspension error:", err);
    throw new Error(err.message || "Failed to toggle member status.");
  }
}

export async function createManualMember(formData: FormData) {
  const data = {
    membershipId: formData.get("membership_id") as string,
    fullName: formData.get("full_name") as string,
    serviceCenterName: formData.get("service_center_name") as string,
    brandsWorkedWith: (formData.get("brands_worked_with") as string || "").split(",").map(s => s.trim()).filter(Boolean),
    gstNo: formData.get("gst_no") as string,
    fullAddress: formData.get("full_address") as string,
    district: formData.get("district") as string,
    city: formData.get("city") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
  };

  try {
    await fetchApi('/admin/members', {
      method: "POST",
      body: JSON.stringify(data),
    });

    revalidatePath("/admin/members");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to create member", err);
    return { success: false, error: err.message || "Failed to create member." };
  }
}

export async function updateMember(memberId: string, formData: FormData) {
  const data = {
    membershipId: formData.get("membership_id") as string,
    fullName: formData.get("full_name") as string,
    serviceCenterName: formData.get("service_center_name") as string,
    brandsWorkedWith: (formData.get("brands_worked_with") as string || "").split(",").map(s => s.trim()).filter(Boolean),
    gstNo: formData.get("gst_no") as string,
    fullAddress: formData.get("full_address") as string,
    district: formData.get("district") as string,
    city: formData.get("city") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
  };

  try {
    await fetchApi(`/admin/members/${memberId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    revalidatePath("/admin/members");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to update member", err);
    return { success: false, error: err.message || "Failed to update member." };
  }
}

