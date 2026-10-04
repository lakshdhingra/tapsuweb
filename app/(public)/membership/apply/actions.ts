"use server";

import { fetchApi } from "@/lib/api-client";
import { createServiceClient } from "@/lib/supabase/service";

const BUCKET_NAME = "application-documents";

async function ensureBucketExists(supabase: ReturnType<typeof createServiceClient>) {
  // Try to create the bucket — silently ignore if it already exists
  await supabase.storage.createBucket(BUCKET_NAME, {
    public: false,
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
  });
}

/**
 * Sanitizes a file name for use as a Supabase Storage path.
 * Replaces spaces and characters that are problematic in object storage paths.
 */
function sanitizeName(fileName: string): string {
  // Preserve the extension, sanitize the base name
  const lastDot = fileName.lastIndexOf(".");
  const ext = lastDot !== -1 ? fileName.slice(lastDot) : "";
  const base = lastDot !== -1 ? fileName.slice(0, lastDot) : fileName;
  // Replace spaces and any non-alphanumeric/dash/underscore/dot chars with underscores
  const safeBase = base.replace(/[^a-zA-Z0-9_\-]/g, "_");
  return `${safeBase}${ext}`;
}

export async function getUploadUrls(folderName: string, fileNames: string[]) {
  if (!fileNames || fileNames.length === 0) {
    return [];
  }

  const supabase = createServiceClient();
  await ensureBucketExists(supabase);

  const urls: { originalName: string; storedName: string; path: string; signedUrl: string; token: string }[] = [];
  
  for (const fileName of fileNames) {
    const storedName = sanitizeName(fileName);
    const path = `${folderName}/${storedName}`;
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUploadUrl(path);
      
    if (error || !data) {
      console.error(`Failed to create signed URL for ${fileName} (stored as ${storedName}):`, error);
      throw new Error(`Failed to initialize upload for ${fileName}`);
    }
    
    urls.push({
      originalName: fileName,
      storedName,
      path: data.path,
      signedUrl: data.signedUrl,
      token: data.token,
    });
  }
  
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
