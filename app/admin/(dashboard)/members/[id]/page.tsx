import React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  User,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  Calendar,
  Hash,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchApi } from "@/lib/api-client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await fetchApi(`/admin/members/${id}`);
    return { title: data?.full_name ? `${data.full_name} | TASPU Admin` : "Member Profile | TASPU Admin" };
  } catch {
    return { title: "Member Profile | TASPU Admin" };
  }
}

export default async function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let member: any = null;
  try {
    member = await fetchApi(`/admin/members/${id}`);
  } catch (err) {
    console.error("Error fetching member details:", err);
  }

  if (!member) {
    notFound();
  }

  const application = member.application;

  const joinedDate = member.membership_date
    ? new Date(member.membership_date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2 text-muted-foreground hover:text-foreground">
            <Link href="/admin/members">
              <ChevronLeft size={16} className="mr-1" /> Back to Members
            </Link>
          </Button>
          <div className="flex items-center space-x-3 flex-wrap gap-y-2">
            <h1 className="font-heading text-3xl font-bold text-foreground">{member.full_name}</h1>
            <StatusBadge status={member.status} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Member ID:{" "}
            <span className="font-mono text-foreground">
              {member.membership_id || "—"}
            </span>{" "}
            • Joined {joinedDate}
          </p>
        </div>
        {application && (
          <Button variant="outline" asChild className="shrink-0">
            <Link href={`/admin/applications/${application.id}`}>
              <FileText size={16} className="mr-2" />
              View Application
              <ExternalLink size={14} className="ml-2 opacity-60" />
            </Link>
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <SectionCard title="Personal Information" icon={User}>
            <div className="grid sm:grid-cols-2 gap-y-5 text-sm">
              <InfoField label="Full Name" value={member.full_name} icon={User} />
              <InfoField label="Email Address" value={member.email || "—"} icon={Mail} />
              <InfoField label="Phone Number" value={member.phone || "—"} icon={Phone} />
              <InfoField label="Membership ID" value={member.membership_id || "—"} icon={Hash} />
              <InfoField label="Member Since" value={joinedDate} icon={Calendar} />
            </div>
          </SectionCard>

          <SectionCard title="Business & Professional Details" icon={Briefcase}>
            <div className="grid sm:grid-cols-2 gap-y-5 text-sm">
              <InfoField label="Service Center Name" value={member.service_center_name || "—"} icon={Briefcase} />
              <InfoField label="Brands" value={member.brands_worked_with?.join(", ") || "—"} icon={Briefcase} />
              <InfoField label="GST No" value={member.gst_no || "—"} icon={FileText} />
              {application?.designation && (
                <InfoField label="Designation" value={application.designation} icon={Briefcase} />
              )}
              {application?.years_experience != null && (
                <InfoField
                  label="Experience"
                  value={`${application.years_experience} Year${application.years_experience !== 1 ? "s" : ""}`}
                  icon={Briefcase}
                />
              )}
            </div>
          </SectionCard>

          <SectionCard title="Location" icon={MapPin}>
            <div className="grid sm:grid-cols-2 gap-y-5 text-sm">
              <InfoField label="District" value={member.district || "—"} icon={MapPin} />
              <InfoField label="City / Town" value={member.city || "—"} icon={MapPin} />
              <InfoField label="Full Address" value={member.full_address || "—"} icon={MapPin} />
            </div>
          </SectionCard>

          {(application?.reason_for_joining || application?.additional_info) && (
            <SectionCard title="Application Details" icon={FileText}>
              <div className="space-y-4 text-sm">
                {application.reason_for_joining && (
                  <div>
                    <div className="text-gray-500 mb-1">Reason for Joining</div>
                    <div className="font-medium text-gray-900">{application.reason_for_joining}</div>
                  </div>
                )}
                {application.additional_info && (
                  <div>
                    <div className="text-gray-500 mb-1">Additional Info</div>
                    <div className="font-medium text-gray-900">{application.additional_info}</div>
                  </div>
                )}
              </div>
            </SectionCard>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <h3 className="font-heading font-bold text-lg text-gray-900 mb-4">Membership Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <StatusBadge status={member.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Member ID</span>
                <span className="font-mono font-medium text-gray-900">{member.membership_id || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Joined</span>
                <span className="font-medium text-gray-900">{joinedDate}</span>
              </div>
              {application && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Application No.</span>
                  <span className="font-mono font-medium text-gray-900 text-xs">{application.application_number}</span>
                </div>
              )}
            </div>
          </div>

          {application?.admin_notes && (
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
              <h3 className="font-heading font-bold text-lg text-gray-900 mb-3">Admin Notes</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{application.admin_notes}</p>
            </div>
          )}

          {!application && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <p className="font-semibold mb-1">Manually Added Member</p>
              <p>This member was added directly and has no linked membership application.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoField({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div>
      <div className="text-gray-500 mb-1 flex items-center gap-1.5">
        <Icon size={13} className="opacity-70" />
        {label}
      </div>
      <div className="font-medium text-gray-900">{value}</div>
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
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
  switch (status) {
    case "ACTIVE":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
          Active
        </span>
      );
    case "SUSPENDED":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 border border-red-200">
          Suspended
        </span>
      );
    case "INACTIVE":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 border border-gray-200">
          Inactive
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 border border-gray-200">
          {status}
        </span>
      );
  }
}