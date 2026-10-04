"use client";

import React, { useCallback, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ApplicationsFiltersProps {
  currentStatus: string;
  currentSearch: string;
}

export function ApplicationsFilters({ currentStatus, currentSearch }: ApplicationsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "ALL") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.delete("page");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  const handleClear = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasFilters = currentStatus !== "ALL" || currentSearch !== "";

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-border flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Search by name, business or App ID..."
          className="pl-10 h-11"
          defaultValue={currentSearch}
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex items-center space-x-3 w-full md:w-auto">
        <select
          className="h-11 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full md:w-44"
          value={currentStatus}
          onChange={(e) => updateParams("status", e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        {hasFilters && (
          <button
            onClick={handleClear}
            disabled={isPending}
            className="h-11 px-4 text-sm text-gray-500 hover:text-gray-900 border border-input rounded-md bg-background whitespace-nowrap transition-colors"
          >
            Clear
          </button>
        )}
        {isPending && (
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
        )}
      </div>
    </div>
  );
}