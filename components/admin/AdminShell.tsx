"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  UserCheck,
  Newspaper,
  Bell,
  FolderOpen,
  Image as ImageIcon,
  MessageSquare,
  ShieldAlert
} from "lucide-react";

const NAVIGATION = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { 
    name: "MEMBERSHIP",
    items: [
      { name: "Applications", href: "/admin/applications", icon: FileText },
      { name: "Members", href: "/admin/members", icon: UserCheck },
    ]
  },
  {
    name: "CONTENT",
    items: [
      { name: "News", href: "/admin/news", icon: Newspaper },
      { name: "Announcements", href: "/admin/announcements", icon: Bell },
      { name: "Resources", href: "/admin/resources", icon: FolderOpen },
      { name: "Media", href: "/admin/media", icon: ImageIcon },
    ]
  },
  {
    name: "ORGANIZATION",
    items: [
      { name: "Leadership", href: "/admin/leadership", icon: Users },
      { name: "Messages", href: "/admin/messages", icon: MessageSquare },
    ]
  },
  {
    name: "ADMINISTRATION",
    items: [
      { name: "Users", href: "/admin/users", icon: ShieldAlert },
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ]
  }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-20">
        <div className="font-heading text-xl font-bold text-primary">TASPU Admin</div>
        <button onClick={() => setSidebarOpen(true)} className="p-2 -mr-2 text-gray-600">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-charcoal text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shrink-0 flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between border-b border-gray-800">
          <div className="font-heading text-2xl font-bold tracking-tight text-white">TASPU</div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
          <nav className="px-4 space-y-8">
            
            {/* Dashboard Link */}
            <div>
              <Link
                href="/admin/dashboard"
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === "/admin/dashboard"
                    ? "bg-primary text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                <LayoutDashboard className="mr-3 shrink-0 w-5 h-5" />
                Dashboard
              </Link>
            </div>

            {/* Sections */}
            {NAVIGATION.slice(1).map((section) => (
              <div key={section.name}>
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {section.name}
                </h3>
                <div className="space-y-1">
                  {section.items?.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        pathname.startsWith(item.href)
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      )}
                    >
                      <item.icon className="mr-3 shrink-0 w-4 h-4" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut className="mr-3 shrink-0 w-5 h-5" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
