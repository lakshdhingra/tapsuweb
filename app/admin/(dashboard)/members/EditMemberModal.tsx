"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateMember } from "./actions";

interface MemberData {
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
}

interface EditMemberModalProps {
  member: MemberData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMemberModal({ member, open, onOpenChange }: EditMemberModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateMember(member.id, formData);

    setIsSubmitting(false);

    if (result.success) {
      onOpenChange(false);
    } else {
      setError(result.error || "Failed to update member");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Membership ID</label>
              <Input
                name="membership_id"
                required
                defaultValue={member.membership_id ?? ""}
                placeholder="e.g. TASPU-2026-001"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">GST No.</label>
              <Input
                name="gst_no"
                defaultValue={member.gst_no}
                required
                placeholder="22AAAAA0000A1Z5"
                className="uppercase"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input name="full_name" required defaultValue={member.full_name} placeholder="John Doe" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Service Center Name</label>
            <Input name="service_center_name" required defaultValue={member.service_center_name} placeholder="Doe Electronics" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Brands Worked With</label>
            <Input name="brands_worked_with" required defaultValue={member.brands_worked_with?.join(", ") ?? ""} placeholder="Samsung, LG, Sony" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input name="email" type="email" defaultValue={member.email} placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input name="phone" required defaultValue={member.phone} placeholder="9876543210" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input name="city" required defaultValue={member.city} placeholder="Hyderabad" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">District</label>
              <Input name="district" required defaultValue={member.district} placeholder="Ranga Reddy" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Full Address</label>
            <Input name="full_address" required defaultValue={member.full_address} placeholder="Shop No, Street, City, State, PIN" />
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}