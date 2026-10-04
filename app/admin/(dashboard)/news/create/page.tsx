"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Save, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreateNewsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.href = "/admin/news";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2 text-muted-foreground hover:text-foreground">
            <Link href="/admin/news">
              <ChevronLeft size={16} className="mr-1" /> Back to News
            </Link>
          </Button>
          <h1 className="font-heading text-3xl font-bold text-foreground">Create Article</h1>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-primary hover:bg-primary-maroon">
          <Save size={18} className="mr-2" /> {isSubmitting ? "Saving..." : "Save & Publish"}
        </Button>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl border border-border shadow-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          <div>
            <label className="block text-sm font-medium mb-2">Article Title</label>
            <Input placeholder="Enter an engaging title..." className="h-12" required />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="Update">Update</option>
                <option value="Event">Event</option>
                <option value="Policy">Policy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cover Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center hover:bg-gray-50 cursor-pointer flex items-center justify-center h-12">
                <span className="flex items-center text-sm text-gray-500">
                  <UploadCloud size={18} className="mr-2" /> Upload Image
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <Textarea 
              placeholder="Write your article content here..." 
              className="min-h-[300px] resize-y" 
              required 
            />
            <p className="text-xs text-muted-foreground mt-2">
              Note: A rich text editor (e.g. TipTap/Quill) will be integrated here for rich formatting.
            </p>
          </div>

        </form>
      </div>

    </div>
  );
}
