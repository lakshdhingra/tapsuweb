import React from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fetchApi } from "@/lib/api-client";
import { MapPin, Briefcase, FileText, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Members Directory | TASPU",
  description: "Directory of verified Telangana Authorised Service Centre Proprietors Welfare Society members.",
};

export default async function MembersPage() {
  let activeMembers: any[] = [];
  let error = null;

  try {
    activeMembers = await fetchApi('/membership/public-members');
  } catch (err: any) {
    console.error("Failed to fetch public members:", err);
    error = err.message || "Failed to load members directory.";
  }

  return (
    <div className="py-32 bg-gray-50/50 min-h-screen">
      <Container>
        <SectionHeading
          eyebrow="Directory"
          heading="Verified Members"
          description="Explore our community of verified service center proprietors across Telangana."
        />
        
        <div className="mt-16">
          {error && (
            <div className="text-center p-8 bg-red-50 text-red-600 rounded-xl">
              Failed to load members directory. Please try again later.
            </div>
          )}
          
          {!error && activeMembers.length === 0 && (
            <div className="text-center p-16 bg-white border border-border rounded-2xl shadow-sm">
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">No members found</h3>
              <p className="text-muted-foreground">The member directory is currently empty.</p>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeMembers.map((member) => (
              <div 
                key={member.id} 
                className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <CheckCircle2 size={48} className="text-primary" />
                </div>
                
                <h3 className="font-heading font-bold text-xl text-gray-900 mb-1 pr-10">
                  {member.service_center_name || "—"}
                </h3>
                <p className="text-sm font-medium text-primary mb-4">
                  {member.full_name}
                </p>
                
                <div className="space-y-3 mt-6">
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-gray-900 block leading-tight">
                        {member.full_address || [member.city, member.district].filter(Boolean).join(", ") || "Address not provided"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 text-sm">
                    <Briefcase size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-gray-500 text-xs uppercase font-semibold tracking-wider block mb-0.5">Brands</span>
                      <span className="text-gray-900 font-medium">
                        {member.brands_worked_with && member.brands_worked_with.length > 0 
                          ? member.brands_worked_with.join(", ")
                          : "—"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 text-sm">
                    <FileText size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-gray-500 text-xs uppercase font-semibold tracking-wider block mb-0.5">GST No</span>
                      <span className="text-gray-900 font-mono text-xs uppercase bg-gray-100 px-1.5 py-0.5 rounded">
                        {member.gst_no || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
