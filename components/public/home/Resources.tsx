import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn, StaggerContainer, FadeInStaggerItem } from "@/components/ui/FadeIn";
import { FileText, ArrowRight, Download } from "lucide-react";

const RESOURCES = [
  {
    id: 1,
    title: "Service Centre Standard Operating Procedures 2026",
    category: "Guidelines",
    size: "2.4 MB",
    type: "PDF",
  },
  {
    id: 2,
    title: "TASPU Membership Benefits Guide",
    category: "Membership",
    size: "1.1 MB",
    type: "PDF",
  },
  {
    id: 3,
    title: "Consumer Rights and Service Regulations",
    category: "Legal",
    size: "3.5 MB",
    type: "PDF",
  },
];

export function Resources() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <Container>
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <SectionHeading
            eyebrow="Resources"
            heading="Document Library."
          />
          <Button variant="outline" asChild className="hidden md:flex">
            <Link href="/resources">
              View All Resources <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESOURCES.map((resource) => (
            <FadeInStaggerItem key={resource.id}>
              <Link 
                href="/resources" 
                className="group block p-6 border border-border rounded-xl hover:border-[#D4AF37] hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                {/* Subtle Hover Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FAF8F3] to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    <FileText size={20} />
                  </div>
                  
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    {resource.category}
                  </span>
                  
                  <h3 className="font-heading text-lg font-bold mb-4 flex-grow group-hover:text-primary transition-colors">
                    {resource.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{resource.type}</span>
                      <span>• {resource.size}</span>
                    </div>
                    <Download size={16} className="transform transition-transform group-hover:-translate-y-1" />
                  </div>
                </div>
              </Link>
            </FadeInStaggerItem>
          ))}
        </StaggerContainer>

        <div className="mt-10 text-center md:hidden">
          <Button variant="outline" asChild className="w-full">
            <Link href="/resources">
              View All Resources <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
