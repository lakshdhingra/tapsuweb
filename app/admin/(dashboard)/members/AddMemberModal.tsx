"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createManualMember } from "./actions";

export function AddMemberModal() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await createManualMember(formData);
    
    setIsSubmitting(false);
    
    if (result.success) {
      setOpen(false);
    } else {
      setError(result.error || "Failed to create member");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-11 bg-primary hover:bg-primary-maroon">
          <Plus size={18} className="mr-2" /> Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Membership ID</label>
              <Input name="membership_id" required placeholder="e.g. TASPU-2026-001" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">GST No.</label>
              <Input name="gst_no" required placeholder="22AAAAA0000A1Z5" className="uppercase" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input name="full_name" required placeholder="John Doe" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Service Center Name</label>
            <Input name="service_center_name" required placeholder="Doe Electronics" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Brands Worked With</label>
            <Input name="brands_worked_with" required placeholder="Samsung, LG, Sony" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input name="email" type="email" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input name="phone" required placeholder="9876543210" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input name="city" required placeholder="Hyderabad" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">District</label>
              <Input name="district" required placeholder="Ranga Reddy" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Address</label>
            <Input name="full_address" required placeholder="Shop No, Street, City, State, PIN" />
          </div>
          
          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Add Member"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
