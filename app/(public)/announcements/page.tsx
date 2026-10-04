import React from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function AnnouncementsPage() {
  return (
    <div className="py-32">
      <Container>
        <SectionHeading
          eyebrow="Announcements"
          heading="Announcements Overview"
        />
        <div className="mt-12 text-muted-foreground max-w-3xl space-y-6">
          <p>
            [Placeholder for announcements content]
          </p>
        </div>
      </Container>
    </div>
  );
}
