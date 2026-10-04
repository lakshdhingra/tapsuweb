import * as z from "zod";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];

export const membershipApplicationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9+\-\s()]{10,20}$/, "Invalid phone number"),
  
  serviceCenterName: z.string().min(2, "Service Center Name is required").max(150),
  designation: z.string().min(2, "Designation is required").max(100),
  yearsExperience: z.coerce.number().min(0, "Must be a positive number").max(100),
  
  district: z.string().min(1, "District is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  fullAddress: z.string().min(10, "Complete full address is required"),
  
  brandsWorkedWith: z.string().min(2, "Brands are required (comma-separated)"),
  gstNo: z.string().length(15, "GST number must be exactly 15 characters").regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST Number format"),
  
  reasonForJoining: z.string().optional(),
  additionalInfo: z.string().optional(),
  
  // Documents: In a real app, this would validate File objects on the client, 
  // but for Server Actions we typically send file keys or handle multipart data.
  // For RHF, we can validate the FileList on the client.
  documents: z.unknown()
    .refine((files: unknown) => Array.isArray(files) && files.length > 0, "At least one document is required")
    .refine(
      (files: unknown) => Array.isArray(files) && files.every((file: { size: number }) => file.size <= MAX_FILE_SIZE),
      `Max file size is 5MB.`
    )
    .refine(
      (files: unknown) => Array.isArray(files) && files.every((file: { type: string }) => ACCEPTED_FILE_TYPES.includes(file.type)),
      "Only .jpg, .jpeg, .png and .pdf formats are supported."
    ),
});

export type MembershipApplicationFormValues = z.infer<typeof membershipApplicationSchema>;
