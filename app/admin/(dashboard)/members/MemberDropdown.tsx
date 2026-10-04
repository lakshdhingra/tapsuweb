"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toggleMemberSuspension } from "./actions";
import { EditMemberModal } from "./EditMemberModal";

interface MemberDropdownProps {
  member: {
    id: string;
    membership_id: string | null;
    full_name: string;
    service_center_name: string;
    district: string;
    city: string;
    phone: string;
    email: string;
    brands_worked_with?: string[];
    gst_no?: string;
    full_address?: string;
    status: string;
  };
}

export function MemberDropdown({ member }: MemberDropdownProps) {
  const [isPending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);

  const handleToggleSuspension = () => {
    startTransition(async () => {
      try {
        await toggleMemberSuspension(member.id, member.status);
      } catch (error) {
        alert("Failed to update member status.");
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <Link href={`/admin/members/${member.id}`}>
            <DropdownMenuItem className="cursor-pointer">View Profile</DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            onClick={() => setEditOpen(true)}
            className="cursor-pointer"
          >
            Edit Member
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {member.status === "APPROVED" || member.status === "ACTIVE" ? (
            <DropdownMenuItem
              onClick={handleToggleSuspension}
              className="text-amber-600 focus:text-amber-700 cursor-pointer"
              disabled={isPending}
            >
              {isPending ? "Suspending..." : "Suspend Member"}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={handleToggleSuspension}
              className="text-green-600 focus:text-green-700 cursor-pointer"
              disabled={isPending}
            >
              {isPending ? "Activating..." : "Activate Member"}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <EditMemberModal
        member={member}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}