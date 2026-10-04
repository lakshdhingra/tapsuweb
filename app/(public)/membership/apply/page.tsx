import React from "react";
import { Container } from "@/components/layout/Container";
import { ApplicationForm } from "@/components/membership/ApplicationForm";
import { Shield, BookOpen, Network } from "lucide-react";

export const metadata = {
  title: "Apply for Membership | TASPU",
  description: "Join the Telangana Authorized Service Centre Proprietors Union.",
};

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] py-24 lg:py-32">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column - Form */}
          <div className="lg:col-span-8">
            <div className="mb-8">
              <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Become a TASPU Member
              </h1>
              <p className="text-lg text-muted-foreground">
                Join our community of authorized service centre proprietors. Please fill out the application below with accurate information.
              </p>
            </div>
            
            <ApplicationForm />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
              <h3 className="font-heading text-xl font-bold mb-6">Why Join TASPU?</h3>
              
              <ul className="space-y-6">
                <li className="flex">
                  <div className="shrink-0 mt-1 w-8 h-8 rounded-full bg-secondary text-primary flex items-center justify-center">
                    <Shield size={16} />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-bold text-foreground mb-1">Strong Representation</h4>
                    <p className="text-sm text-muted-foreground">Collective bargaining power and policy advocacy.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="shrink-0 mt-1 w-8 h-8 rounded-full bg-secondary text-primary flex items-center justify-center">
                    <Network size={16} />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-bold text-foreground mb-1">Valuable Networking</h4>
                    <p className="text-sm text-muted-foreground">Connect with hundreds of fellow proprietors.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="shrink-0 mt-1 w-8 h-8 rounded-full bg-secondary text-primary flex items-center justify-center">
                    <BookOpen size={16} />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-bold text-foreground mb-1">Resource Library</h4>
                    <p className="text-sm text-muted-foreground">Access exclusive SOPs, guidelines, and training materials.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-charcoal text-white p-8 rounded-2xl shadow-sm">
              <h3 className="font-heading text-xl font-bold mb-4">Need Help?</h3>
              <p className="text-gray-400 text-sm mb-6">
                If you have questions about the application process or required documents, our team is here to assist you.
              </p>
              <div className="text-sm">
                <div className="mb-2"><span className="text-gray-400">Email:</span> membership@taspu.org</div>
                <div><span className="text-gray-400">Phone:</span> +91 98765 43210</div>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}
