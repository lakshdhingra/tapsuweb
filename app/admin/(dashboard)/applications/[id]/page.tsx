import React from "react";
import Link from "next/link";
import { ChevronLeft, FileText, User, MapPin, Briefcase, AlertCircle, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchApi } from "@/lib/api-client";
import { createServiceClient } from "@/lib/supabase/service";
import { notFound } from "next/navigation";
import { ApplicationActions } from "./ApplicationActions";
import { AdminNotesForm } from "./AdminNotesForm";

const BUCKET_NAME = "application-documents";

export default async function ApplicationReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let app: any = null;
  try {
    app = await fetchApi(`/admin/applications/${id}`);
  } catch (err) {
    console.error("Error loading application details:", err);
  }

  if (!app) {
    notFound();
  }

  const supabase = createServiceClient();

  // Fetch documents from Storage
  const { data: files } = await supabase.storage
    .from(BUCKET_NAME)
    .list(app.id, { sortBy: { column: "name", order: "asc" } });

  const documents = files?.filter((f) => f.name !== ".emptyFolderPlaceholder") ?? [];

  // Generate signed URLs for each document (valid for 1 hour)
  const documentsWithUrls = await Promise.all(
    documents.map(async (file) => {
      const filePath = `${app.id}/${file.name}`;
      const { data: signedUrlData } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(filePath, 3600);

      return {
        name: file.name,
        size: file.metadata?.size
          ? `${(file.metadata.size / 1024).toFixed(0)} KB`
          : "—",
        url: signedUrlData?.signedUrl ?? null,
      };
    })
  );

  const submittedDate = new Date(app.submitted_at).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Navigation & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2 text-muted-foreground hover:text-foreground">
            <Link href="/admin/applications">
              <ChevronLeft size={16} className="mr-1" /> Back to Applications
            </Link>
          </Button>
          <div className="flex items-center space-x-3">
            <h1 className="font-heading text-3xl font-bold text-foreground">Review Application</h1>
            <StatusBadge status={app.status} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">Application ID: <span className="font-mono text-foreground">{app.application_number}</span> • Submitted on {submittedDate}</p>
        </div>
        
        <ApplicationActions applicationId={app.id} currentStatus={app.status} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Main Details (Left 2 cols) */}
        <div className="md:col-span-2 space-y-6">
          
          <SectionCard title="Personal Information" icon={User}>
            <div className="grid sm:grid-cols-2 gap-y-4 text-sm">
              <div>
                <div className="text-gray-500 mb-1">Full Name</div>
                <div className="font-medium text-gray-900">{app.full_name}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Email Address</div>
                <div className="font-medium text-gray-900">{app.email}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Phone Number</div>
                <div className="font-medium text-gray-900">{app.phone}</div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Professional Details" icon={Briefcase}>
            <div className="grid sm:grid-cols-2 gap-y-4 text-sm">
              <div>
                <div className="text-gray-500 mb-1">Service Center Name</div>
                <div className="font-medium text-gray-900">{app.service_center_name}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Designation</div>
                <div className="font-medium text-gray-900">{app.designation}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Brands Worked With</div>
                <div className="font-medium text-gray-900">{app.brands_worked_with?.join(", ") || "—"}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">GST No.</div>
                <div className="font-medium text-gray-900">{app.gst_no}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Experience</div>
                <div className="font-medium text-gray-900">{app.years_experience} Year{app.years_experience !== 1 ? "s" : ""}</div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Location" icon={MapPin}>
            <div className="grid sm:grid-cols-2 gap-y-4 text-sm">
              <div>
                <div className="text-gray-500 mb-1">District</div>
                <div className="font-medium text-gray-900">{app.district}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">City / Town</div>
                <div className="font-medium text-gray-900">{app.city}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-gray-500 mb-1">Full Address</div>
                <div className="font-medium text-gray-900">{app.full_address || app.address}</div>
              </div>
            </div>
          </SectionCard>

          {/* Additional Info */}
          {(app.reason_for_joining || app.additional_info) && (
            <SectionCard title="Additional Information" icon={AlertCircle}>
              <div className="space-y-4 text-sm">
                {app.reason_for_joining && (
                  <div>
                    <div className="text-gray-500 mb-1">Reason for Joining</div>
                    <div className="font-medium text-gray-900">{app.reason_for_joining}</div>
                  </div>
                )}
                {app.additional_info && (
                  <div>
                    <div className="text-gray-500 mb-1">Additional Info</div>
                    <div className="font-medium text-gray-900">{app.additional_info}</div>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

        </div>

        {/* Sidebar (Right col) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center space-x-2 mb-4 text-primary">
              <FileText size={20} />
              <h3 className="font-heading font-bold text-lg text-gray-900">Attached Documents</h3>
            </div>
            
            {documentsWithUrls.length === 0 ? (
              <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg text-center">
                No documents were uploaded with this application.
              </div>
            ) : (
              <div className="space-y-3">
                {documentsWithUrls.map((doc, idx) => (
                  <div key={idx} className="flex flex-col p-3 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="text-sm font-medium text-gray-900 truncate" title={doc.name}>{doc.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{doc.size}</div>
                      </div>
                    </div>
                    {doc.url && (
                      <div className="flex space-x-2 mt-3 pt-3 border-t border-gray-200">
                        <Button variant="outline" size="sm" className="h-8 flex-1 text-xs" asChild>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            <Eye size={14} className="mr-1.5" /> View
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 flex-1 text-xs" asChild>
                          <a href={doc.url} download={doc.name}>
                            <Download size={14} className="mr-1.5" /> Download
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Admin Notes */}
          <AdminNotesForm applicationId={app.id} initialNotes={app.admin_notes || ""} />
        </div>

      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl border border-border shadow-sm">
      <div className="flex items-center space-x-2 mb-6 border-b border-gray-100 pb-3">
        <Icon size={20} className="text-primary" />
        <h2 className="font-heading font-bold text-xl text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch(status) {
    case 'PENDING':
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 border border-amber-200">Pending Review</span>;
    case 'UNDER_REVIEW':
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-200">Under Review</span>;
    case 'APPROVED':
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200">Approved</span>;
    case 'REJECTED':
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 border border-red-200">Rejected</span>;
    default:
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 border border-gray-200">{status}</span>;
  }
}
