"use server";

import { fetchApi } from "@/lib/api-client";

export async function getUploadUrls(files: { name: string; type: string }[]) {
  if (!files || files.length === 0) {
    return [];
  }

  const urls = await Promise.all(
    files.map(async (file) => {
      const res = await fetchApi('/membership/upload-url', {
        method: 'POST',
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
        }),
      });
      return {
        originalName: file.name,
        key: res.key,
        signedUrl: res.signedUrl,
      };
    })
  );

  return urls;
}

export async function submitMembershipApplication(formData: FormData) {
  // Extract and validate fields from FormData
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const serviceCenterName = formData.get("serviceCenterName") as string;
  const designation = formData.get("designation") as string;
  const yearsExperience = parseInt(formData.get("yearsExperience") as string, 10);
  const brandsWorkedWithStr = formData.get("brandsWorkedWith") as string;
  const brandsWorkedWith = brandsWorkedWithStr ? brandsWorkedWithStr.split(",").map(s => s.trim()).filter(Boolean) : [];
  const gstNo = formData.get("gstNo") as string;
  const district = formData.get("district") as string;
  const city = formData.get("city") as string;
  const address = formData.get("address") as string;
  const fullAddress = formData.get("fullAddress") as string;
  const reasonForJoining = (formData.get("reasonForJoining") as string) || undefined;
  const additionalInfo = (formData.get("additionalInfo") as string) || undefined;

  const documentsStr = formData.get("documents") as string;
  let documents: any[] = [];
  if (documentsStr) {
    try {
      documents = JSON.parse(documentsStr);
    } catch {}
  }

  // Basic server-side validation
  if (!fullName || !email || !phone || !serviceCenterName || !designation || !brandsWorkedWith.length || !gstNo || !district || !city || !address || !fullAddress) {
    return { success: false, error: "All required fields must be filled." };
  }

  if (isNaN(yearsExperience) || yearsExperience < 0) {
    return { success: false, error: "Years of experience must be a valid positive number." };
  }

  try {
    const res = await fetchApi('/membership/apply', {
      method: 'POST',
      body: JSON.stringify({
        fullName,
        email,
        phone,
        serviceCenterName,
        designation,
        yearsExperience,
        brandsWorkedWith,
        gstNo,
        district,
        city,
        address,
        fullAddress,
        reasonForJoining,
        additionalInfo,
        documents,
      }),
    });

    return {
      success: true,
      applicationNumber: res.applicationNumber,
    };
  } catch (err: any) {
    console.error("Membership application submission error:", err);
    return { success: false, error: err.message || "Failed to submit application. Please try again." };
  }
}

