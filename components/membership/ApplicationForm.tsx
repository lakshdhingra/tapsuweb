"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { membershipApplicationSchema, MembershipApplicationFormValues } from "@/lib/validations/membership";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, ChevronRight, ChevronLeft, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { submitMembershipApplication, getUploadUrls } from "@/app/(public)/membership/apply/actions";
import { createClient } from "@/lib/supabase/client";

const STEPS = [
  { id: "01", name: "Personal", fields: ["fullName", "email", "phone"] },
  { id: "02", name: "Professional", fields: ["serviceCenterName", "designation", "yearsExperience", "brandsWorkedWith", "gstNo"] },
  { id: "03", name: "Location", fields: ["district", "city", "address", "fullAddress"] },
  { id: "04", name: "Documents", fields: ["documents"] },
  { id: "05", name: "Review", fields: [] },
];

export function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<MembershipApplicationFormValues>({
    // @ts-ignore
    resolver: zodResolver(membershipApplicationSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      serviceCenterName: "",
      designation: "",
      yearsExperience: 0,
      brandsWorkedWith: "",
      gstNo: "",
      district: "",
      city: "",
      address: "",
      fullAddress: "",
      reasonForJoining: "",
      additionalInfo: "",
    }
  });

  const processNextStep = async () => {
    const fields = STEPS[currentStep].fields;
    // Validate current step fields
    const isValid = await form.trigger(fields as any);
    
    if (currentStep === 3) {
       // Validate files
       if (uploadedFiles.length === 0) {
         form.setError("documents", { type: "manual", message: "At least one document is required" });
         return;
       }
       form.clearErrors("documents");
    }

    if (isValid || (currentStep === 3 && uploadedFiles.length > 0)) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const processPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Upload files to Supabase directly from the client using signed URLs
      let tempFolderName = "";
      const uploadedFileNames: string[] = [];

      if (uploadedFiles.length > 0) {
        tempFolderName = crypto.randomUUID();
        const fileNames = uploadedFiles.map(f => f.name);
        
        // 1. Get signed URLs from the server
        const signedUrls = await getUploadUrls(tempFolderName, fileNames);
        
        // 2. Upload directly to Supabase storage
        const supabase = createClient();
        
        const uploadPromises = uploadedFiles.map(async (file) => {
          // Match by originalName; upload using the sanitized path/token
          const urlInfo = signedUrls.find(u => u.originalName === file.name);
          if (urlInfo) {
            const { error } = await supabase.storage
              .from("application-documents")
              .uploadToSignedUrl(urlInfo.path, urlInfo.token, file);
              
            if (!error) {
              // Track the storedName so the server moves the correct file
              uploadedFileNames.push(urlInfo.storedName);
            } else {
              console.error("Failed to upload file to signed URL", error);
            }
          }
        });
        
        await Promise.all(uploadPromises);
      }

      // Create FormData to send to Server Action
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "documents" && value != null) {
          formData.append(key, (value as any).toString());
        }
      });
      
      if (tempFolderName && uploadedFileNames.length > 0) {
        formData.append("tempFolderName", tempFolderName);
        formData.append("uploadedFiles", JSON.stringify(uploadedFileNames));
      }

      const result = await submitMembershipApplication(formData);
      
      if (result.success) {
        setApplicationNumber(result.applicationNumber!);
        setIsSuccess(true);
      } else {
        setSubmitError(result.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      form.setValue("documents", [...uploadedFiles, ...newFiles]);
      form.clearErrors("documents");
    }
  };

  const removeFile = (index: number) => {
    const updated = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updated);
    form.setValue("documents", updated);
  };

  if (isSuccess) {
    return (
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-border text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 animate-in zoom-in duration-500">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Application Received</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Thank you for applying to join TASPU. Your application is now under review. We will notify you of the outcome via email.
        </p>
        <div className="bg-[#FAF8F3] p-6 rounded-xl border border-[#E9E6E0] mb-8 inline-block text-left w-full max-w-sm">
          <div className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-1">
            Reference Number
          </div>
          <div className="font-heading text-2xl font-bold text-primary">
            {applicationNumber}
          </div>
        </div>
        <div>
          <Button asChild>
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
      {/* Progress Header */}
      <div className="bg-[#FAF8F3] border-b border-[#E9E6E0] p-6 md:p-8">
        <nav aria-label="Progress">
          <ol role="list" className="flex flex-wrap md:flex-nowrap items-center gap-y-4">
            {STEPS.map((step, index) => {
              const isActive = currentStep === index;
              const isPast = currentStep > index;
              
              return (
                <li key={step.name} className={cn("relative flex items-center pr-8 md:pr-0", index !== STEPS.length - 1 ? "md:flex-1" : "")}>
                  <div className="flex items-center">
                    <span className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                      isActive ? "bg-primary text-white" :
                      isPast ? "bg-[#D4AF37] text-white" :
                      "bg-gray-200 text-gray-500"
                    )}>
                      {isPast ? <CheckCircle2 size={16} /> : step.id}
                    </span>
                    <span className={cn(
                      "ml-3 text-sm font-semibold",
                      isActive ? "text-primary" :
                      isPast ? "text-foreground" :
                      "text-muted-foreground"
                    )}>
                      {step.name}
                    </span>
                  </div>
                  {/* Divider Line */}
                  {index !== STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-4 left-0 -ml-px w-full h-0.5" style={{ paddingLeft: 'calc(100% - 2rem)', marginLeft: '2rem' }}>
                      <div className={cn("h-0.5 w-full", isPast ? "bg-[#D4AF37]" : "bg-gray-200")} />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      <div className="p-6 md:p-12">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* STEP 1: Personal */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-8">
                <h2 className="font-heading text-2xl font-bold">Personal Information</h2>
                <p className="text-muted-foreground">Tell us about yourself.</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input {...form.register("fullName")} placeholder="e.g. Rahul Sharma" className="h-12 focus-visible:ring-primary" />
                  {form.formState.errors.fullName && <p className="text-red-500 text-sm mt-1">{form.formState.errors.fullName.message}</p>}
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <Input {...form.register("email")} type="email" placeholder="rahul@example.com" className="h-12 focus-visible:ring-primary" />
                    {form.formState.errors.email && <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input {...form.register("phone")} placeholder="+91 98765 43210" className="h-12 focus-visible:ring-primary" />
                    {form.formState.errors.phone && <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Professional */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-8">
                <h2 className="font-heading text-2xl font-bold">Professional Background</h2>
                <p className="text-muted-foreground">Details about your service centre.</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Service Centre Name</label>
                  <Input {...form.register("serviceCenterName")} placeholder="TechCare Services" className="h-12 focus-visible:ring-primary" />
                  {form.formState.errors.serviceCenterName && <p className="text-red-500 text-sm mt-1">{form.formState.errors.serviceCenterName.message}</p>}
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Designation / Role</label>
                    <Input {...form.register("designation")} placeholder="Proprietor / Owner" className="h-12 focus-visible:ring-primary" />
                    {form.formState.errors.designation && <p className="text-red-500 text-sm mt-1">{form.formState.errors.designation.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Years of Experience</label>
                    <Input {...form.register("yearsExperience")} type="number" placeholder="5" className="h-12 focus-visible:ring-primary" />
                    {form.formState.errors.yearsExperience && <p className="text-red-500 text-sm mt-1">{form.formState.errors.yearsExperience.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Brands Working With</label>
                  <Input {...form.register("brandsWorkedWith")} placeholder="Samsung, LG, Sony (comma-separated)" className="h-12 focus-visible:ring-primary" />
                  {form.formState.errors.brandsWorkedWith && <p className="text-red-500 text-sm mt-1">{form.formState.errors.brandsWorkedWith.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">GST Number</label>
                  <Input {...form.register("gstNo")} placeholder="22AAAAA0000A1Z5" className="h-12 focus-visible:ring-primary uppercase" />
                  {form.formState.errors.gstNo && <p className="text-red-500 text-sm mt-1">{form.formState.errors.gstNo.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Location */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-8">
                <h2 className="font-heading text-2xl font-bold">Location</h2>
                <p className="text-muted-foreground">Where is your business located?</p>
              </div>
              
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">District</label>
                    <select 
                      {...form.register("district")}
                      className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-primary"
                    >
                      <option value="">Select district...</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Ranga Reddy">Ranga Reddy</option>
                      <option value="Medchal-Malkajgiri">Medchal-Malkajgiri</option>
                      <option value="Warangal">Warangal</option>
                      <option value="Nizamabad">Nizamabad</option>
                      <option value="Khammam">Khammam</option>
                      <option value="Karimnagar">Karimnagar</option>
                      <option value="Other">Other</option>
                    </select>
                    {form.formState.errors.district && <p className="text-red-500 text-sm mt-1">{form.formState.errors.district.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">City / Town</label>
                    <Input {...form.register("city")} placeholder="e.g. Jubilee Hills" className="h-12 focus-visible:ring-primary" />
                    {form.formState.errors.city && <p className="text-red-500 text-sm mt-1">{form.formState.errors.city.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Short Address (for public directory)</label>
                  <Textarea {...form.register("address")} placeholder="Shop No, Street, Landmark..." className="min-h-[80px] focus-visible:ring-primary" />
                  {form.formState.errors.address && <p className="text-red-500 text-sm mt-1">{form.formState.errors.address.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Full Business Address (Complete details)</label>
                  <Textarea {...form.register("fullAddress")} placeholder="Full postal address..." className="min-h-[100px] focus-visible:ring-primary" />
                  {form.formState.errors.fullAddress && <p className="text-red-500 text-sm mt-1">{form.formState.errors.fullAddress.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Documents */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-8">
                <h2 className="font-heading text-2xl font-bold">Documents</h2>
                <p className="text-muted-foreground">Upload required business proofs (Trade License, GST, ID).</p>
              </div>
              
              <div className="space-y-6">
                
                {/* Custom File Dropzone style */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 hover:border-primary transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    multiple 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                      <UploadCloud size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Click to upload or drag and drop</p>
                      <p className="text-sm text-muted-foreground mt-1">PDF, JPG, or PNG (max. 5MB each)</p>
                    </div>
                  </div>
                </div>

                {form.formState.errors.documents && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.documents.message as string}</p>
                )}

                {uploadedFiles.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Uploaded Files</h4>
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <div className="shrink-0 text-gray-400"><FileIcon type={file.type} /></div>
                          <div className="truncate text-sm font-medium">{file.name}</div>
                          <div className="shrink-0 text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                        <button type="button" onClick={() => removeFile(idx)} className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
              </div>
            </div>
          )}

          {/* STEP 5: Review */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-8">
                <h2 className="font-heading text-2xl font-bold">Review & Submit</h2>
                <p className="text-muted-foreground">Please review your information before submitting.</p>
              </div>
              
              <div className="bg-[#FAF8F3] rounded-xl p-6 md:p-8 space-y-8 border border-[#E9E6E0]">
                
                <section>
                  <h3 className="font-heading text-lg font-bold mb-4 text-primary border-b border-[#E9E6E0] pb-2">Personal</h3>
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">Full Name</div>
                      <div className="font-medium">{form.getValues("fullName")}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Email Address</div>
                      <div className="font-medium">{form.getValues("email")}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Phone Number</div>
                      <div className="font-medium">{form.getValues("phone")}</div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="font-heading text-lg font-bold mb-4 text-primary border-b border-[#E9E6E0] pb-2">Professional & Location</h3>
                  <div className="grid sm:grid-cols-2 gap-y-4 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">Service Centre Name</div>
                      <div className="font-medium">{form.getValues("serviceCenterName")}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">GST Number</div>
                      <div className="font-medium">{form.getValues("gstNo")}</div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="text-muted-foreground mb-1">Brands Worked With</div>
                      <div className="font-medium">{form.getValues("brandsWorkedWith")}</div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="text-muted-foreground mb-1">Address</div>
                      <div className="font-medium">{form.getValues("fullAddress")}</div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="font-heading text-lg font-bold mb-4 text-primary border-b border-[#E9E6E0] pb-2">Documents</h3>
                  <div className="text-sm font-medium">
                    {uploadedFiles.length} file(s) attached ready for upload.
                  </div>
                </section>

              </div>
            </div>
          )}

          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {submitError}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={processPrevStep} 
              disabled={currentStep === 0 || isSubmitting}
              className={cn(currentStep === 0 && "invisible", "h-12 px-6")}
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            
            {currentStep < STEPS.length - 1 ? (
              <Button type="button" onClick={processNextStep} className="h-12 px-8 bg-charcoal hover:bg-black text-white">
                Next Step <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="h-12 px-10 bg-primary hover:bg-primary-maroon text-white font-bold shadow-lg shadow-primary/20">
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}

function FileIcon({ type }: { type: string }) {
  if (type.includes('pdf')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
