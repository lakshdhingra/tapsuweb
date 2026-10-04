"use client";

import React, { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Global Settings</h1>
        <p className="text-muted-foreground mt-1">Configure site-wide parameters.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl border border-border shadow-sm">
        <form className="space-y-8" onSubmit={handleSave}>
          
          <section>
            <h3 className="font-heading text-lg font-bold mb-4 pb-2 border-b border-gray-100">Identifiers</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Membership ID Prefix</label>
                <Input defaultValue="TASPU" className="h-11" />
                <p className="text-xs text-muted-foreground mt-1.5">Used for generating new Member IDs (e.g. TASPU-2026-0001)</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Membership Year Code</label>
                <Input defaultValue="2026" className="h-11" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Application ID Prefix</label>
                <Input defaultValue="TASPU-APP" className="h-11" />
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-heading text-lg font-bold mb-4 pb-2 border-b border-gray-100">Contact Information</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Public Email Address</label>
                <Input defaultValue="info@taspu.org" className="h-11" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Support Phone</label>
                <Input defaultValue="+91 98765 43210" className="h-11" />
              </div>
            </div>
          </section>
          
          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary-maroon px-8 h-11">
              <Save size={18} className="mr-2" /> {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>

        </form>
      </div>

    </div>
  );
}
