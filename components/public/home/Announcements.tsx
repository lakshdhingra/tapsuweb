import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn, StaggerContainer, FadeInStaggerItem } from "@/components/ui/FadeIn";
import { ArrowRight, AlertCircle, Info, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Urgent Meeting Regarding New Certification Requirements",
    date: "Oct 20, 2026",
    priority: "URGENT",
    slug: "urgent-meeting-certification",
  },
  {
    id: 2,
    title: "Quarterly Membership Fee Due Date Extension",
    date: "Oct 18, 2026",
    priority: "IMPORTANT",
    slug: "fee-extension",
  },
  {
    id: 3,
    title: "Welcome to our 50 new members this month",
    date: "Oct 01, 2026",
    priority: "NORMAL",
    slug: "welcome-new-members",
  },
];

export function Announcements() {
  return (
    <section className="py-24 lg:py-32 bg-[#FAF8F3]">
      <Container>
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <SectionHeading
            eyebrow="Announcements"
            heading="Important Notices."
          />
          <Button variant="outline" asChild className="hidden md:flex">
            <Link href="/announcements">
              View All Announcements <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        <StaggerContainer className="bg-white rounded-2xl border border-[#E9E6E0] overflow-hidden shadow-sm">
          {ANNOUNCEMENTS.map((announcement, index) => {
            const isUrgent = announcement.priority === "URGENT";
            const isImportant = announcement.priority === "IMPORTANT";
            
            return (
              <FadeInStaggerItem key={announcement.id}>
                <Link
                  href={`/announcements/${announcement.slug}`}
                  className={cn(
                    "group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-6 md:p-8 transition-colors hover:bg-gray-50",
                    index !== 0 && "border-t border-[#E9E6E0]"
                  )}
                >
                  {/* Priority Indicator */}
                  <div className="shrink-0 sm:w-32">
                    <span className={cn(
                      "inline-flex items-center text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm",
                      isUrgent ? "bg-red-100 text-red-800" :
                      isImportant ? "bg-amber-100 text-amber-800" :
                      "bg-gray-100 text-gray-700"
                    )}>
                      {isUrgent && <AlertCircle className="w-3 h-3 mr-1.5" />}
                      {isImportant && <Info className="w-3 h-3 mr-1.5" />}
                      {!isUrgent && !isImportant && <Bell className="w-3 h-3 mr-1.5" />}
                      {announcement.priority}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <h3 className={cn(
                      "font-heading text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors",
                      isUrgent && "text-red-900"
                    )}>
                      {announcement.title}
                    </h3>
                  </div>

                  {/* Date & Arrow */}
                  <div className="shrink-0 flex items-center justify-between sm:w-32 sm:justify-end text-muted-foreground">
                    <span className="text-sm font-medium">{announcement.date}</span>
                    <ArrowRight className="w-5 h-5 ml-4 transform transition-transform group-hover:translate-x-1 group-hover:text-primary hidden sm:block" />
                  </div>
                </Link>
              </FadeInStaggerItem>
            );
          })}
        </StaggerContainer>

        <div className="mt-10 text-center md:hidden">
          <Button variant="outline" asChild className="w-full">
            <Link href="/announcements">
              View All Announcements <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
