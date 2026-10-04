import React from "react";
import Link from "next/link";
import { Users, FileText, Newspaper, MessageSquare, ArrowRight, CheckCircle, XCircle, Clock, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchApi } from "@/lib/api-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let stats = {
    totalMembers: 0,
    pendingApps: 0,
    thisMonthApps: 0,
    publishedNews: 0,
    unreadMessages: 0,
  };
  let recentApps: any[] = [];

  try {
    const data = await fetchApi('/admin/dashboard/stats');
    if (data) {
      stats = {
        totalMembers: data.totalMembers || 0,
        pendingApps: data.pendingApps || 0,
        thisMonthApps: data.thisMonthApps || 0,
        publishedNews: data.publishedNews || 0,
        unreadMessages: data.unreadMessages || 0,
      };
      recentApps = data.recentApps || [];
    }
  } catch (err) {
    console.error("Failed to load dashboard stats from NestJS API:", err);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of TASPU platform activity.</p>
      </div>

      {/* Prominent Stat */}
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-8 lg:col-span-6">
          <div className="bg-primary text-white rounded-2xl p-8 shadow-sm relative overflow-hidden h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none rounded-bl-full" />
            <div>
              <div className="flex items-center space-x-2 text-primary-foreground/80 mb-2">
                <Clock size={18} />
                <span className="font-semibold uppercase tracking-wider text-sm">Action Required</span>
              </div>
              <div className="font-heading text-6xl font-bold mb-4">{stats.pendingApps}</div>
              <p className="text-lg text-primary-foreground/90">Pending membership applications await review.</p>
            </div>
            <div className="mt-8">
              <Button variant="secondary" asChild className="font-semibold">
                <Link href="/admin/applications">Review Applications</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="md:col-span-4 lg:col-span-6 grid grid-cols-2 gap-4">
          <StatCard title="Total Members" value={stats.totalMembers} icon={Users} />
          <StatCard title="Apps This Month" value={stats.thisMonthApps} icon={FileText} />
          <StatCard title="Published News" value={stats.publishedNews} icon={Newspaper} />
          <StatCard title="Unread Messages" value={stats.unreadMessages} icon={MessageSquare} highlight={stats.unreadMessages > 0} />
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-border">
          <h2 className="font-heading text-xl font-bold">Recent Applications</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/applications" className="text-primary">
              View All <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          {recentApps && recentApps.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Service Center</th>
                  <th className="px-6 py-4 hidden sm:table-cell">District</th>
                  <th className="px-6 py-4 hidden md:table-cell">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentApps.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{app.full_name}</td>
                    <td className="px-6 py-4 text-gray-600">{app.service_center_name}</td>
                    <td className="px-6 py-4 text-gray-600 hidden sm:table-cell">{app.district}</td>
                    <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                      {new Date(app.submitted_at).toLocaleDateString('en-IN', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/applications/${app.id}`} className="text-primary hover:underline font-medium">
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-heading text-lg font-bold text-gray-900 mb-1">No applications yet</h3>
              <p className="text-gray-500 max-w-sm">
                When new membership applications are submitted, they will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

function StatCard({ title, value, icon: Icon, highlight = false }: { title: string, value: number, icon: any, highlight?: boolean }) {
  return (
    <div className={`bg-white border ${highlight ? 'border-primary shadow-sm' : 'border-border'} rounded-xl p-5 flex flex-col justify-between`}>
      <div className="flex items-center justify-between mb-4">
        <span className={`text-sm font-medium ${highlight ? 'text-primary' : 'text-gray-500'}`}>{title}</span>
        <Icon size={18} className={highlight ? 'text-primary' : 'text-gray-400'} />
      </div>
      <div className="font-heading text-3xl font-bold text-gray-900">
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch(status) {
    case 'PENDING':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Clock size={12} className="mr-1.5" /> Pending</span>;
    case 'UNDER_REVIEW':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Reviewing</span>;
    case 'APPROVED':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={12} className="mr-1.5" /> Approved</span>;
    case 'REJECTED':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle size={12} className="mr-1.5" /> Rejected</span>;
    default:
      return null;
  }
}
