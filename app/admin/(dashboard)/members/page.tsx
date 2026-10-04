import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

import { fetchApi } from "@/lib/api-client";
import { MemberDropdown } from "./MemberDropdown";
import { AddMemberModal } from "./AddMemberModal";
import { MembersFilters } from "./MembersFilters";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Members | TASPU Admin",
};

interface MembersPageProps {
  searchParams: Promise<{ status?: string; search?: string }>;
}

export default async function MembersPage({ searchParams }: MembersPageProps) {
  const { status, search } = await searchParams;

  const currentStatus = status ?? "ALL";
  const currentSearch = search ?? "";

  let filteredMembers: any[] = [];
  try {
    const params = new URLSearchParams();
    if (currentStatus && currentStatus !== "ALL") params.append("status", currentStatus);
    if (currentSearch) params.append("search", currentSearch);

    filteredMembers = await fetchApi(`/admin/members?${params.toString()}`);
  } catch (err) {
    console.error("Failed to fetch members from NestJS API:", err);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Members Directory</h1>
          <p className="text-muted-foreground mt-1">Manage active and suspended members.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="h-11">
            <Download size={18} className="mr-2" /> Export CSV
          </Button>
          <AddMemberModal />
        </div>
      </div>

      {/* Filters — client component reads/writes URL search params */}
      <Suspense>
        <MembersFilters currentStatus={currentStatus} currentSearch={currentSearch} />
      </Suspense>

      {/* Table */}
      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Member ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Service Center</th>
                <th className="px-6 py-4 hidden sm:table-cell">District</th>
                <th className="px-6 py-4 hidden md:table-cell">Joined Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <p className="text-base font-medium text-gray-900 mb-1">
                      {currentStatus !== "ALL" || currentSearch
                        ? "No members match your filters"
                        : "No members yet"}
                    </p>
                    <p>
                      {currentStatus !== "ALL" || currentSearch
                        ? "Try adjusting your search or status filter."
                        : "Click \"Add Member\" to create your first member, or approve a membership application."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-primary">{member.membership_id || "N/A"}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{member.full_name}</td>
                    <td className="px-6 py-4 text-gray-600">{member.service_center_name}</td>
                    <td className="px-6 py-4 text-gray-600 hidden sm:table-cell">{member.district}</td>
                    <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                      {new Date(member.membership_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={member.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <MemberDropdown member={member} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredMembers.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <div>Showing {filteredMembers.length} member{filteredMembers.length !== 1 ? "s" : ""}</div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "ACTIVE":
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Active</span>;
    case "SUSPENDED":
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Suspended</span>;
    case "INACTIVE":
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">Inactive</span>;
    default:
      return null;
  }
}
