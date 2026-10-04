import React, { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import { fetchApi } from "@/lib/api-client";
import { ApplicationsFilters } from "./ApplicationsFilters";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Applications | TASPU Admin",
};

interface ApplicationsPageProps {
  searchParams: Promise<{ status?: string; search?: string }>;
}

export default async function ApplicationsPage({ searchParams }: ApplicationsPageProps) {
  const { status, search } = await searchParams;

  const currentStatus = status ?? "ALL";
  const currentSearch = search ?? "";

  let apps: any[] = [];
  try {
    const params = new URLSearchParams();
    if (currentStatus && currentStatus !== "ALL") params.append("status", currentStatus);
    if (currentSearch) params.append("search", currentSearch);

    apps = await fetchApi(`/admin/applications?${params.toString()}`);
  } catch (err) {
    console.error("Failed to fetch applications from NestJS API:", err);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Membership Applications</h1>
          <p className="text-muted-foreground mt-1">Review and process new member requests.</p>
        </div>
      </div>

      {/* Filters — client component reads/writes URL search params */}
      <Suspense>
        <ApplicationsFilters currentStatus={currentStatus} currentSearch={currentSearch} />
      </Suspense>

      {/* Table or Empty State */}
      {apps.length === 0 ? (
        <div className="bg-white border border-border rounded-xl shadow-sm p-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
            <FileText size={28} />
          </div>
          <h2 className="font-heading text-xl font-bold text-gray-900 mb-2">
            {currentStatus !== "ALL" || currentSearch ? "No applications match your filters" : "No applications yet"}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {currentStatus !== "ALL" || currentSearch
              ? "Try adjusting your search or status filter."
              : "When someone submits a membership application through the public form, it will appear here for review."}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">App ID</th>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Business Details</th>
                  <th className="px-6 py-4">Submitted On</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {apps.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{app.application_number}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{app.full_name}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-800">{app.service_center_name}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(app.submitted_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary hover:bg-primary/5">
                        <Link href={`/admin/applications/${app.id}`}>
                          <Eye size={16} className="mr-2" /> Review
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <div>Showing {apps.length} application{apps.length !== 1 ? "s" : ""}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "PENDING":
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Pending</span>;
    case "UNDER_REVIEW":
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Reviewing</span>;
    case "APPROVED":
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Approved</span>;
    case "REJECTED":
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Rejected</span>;
    default:
      return null;
  }
}
