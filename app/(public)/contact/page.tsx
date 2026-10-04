import React from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function ContactPage() {
  return (
    <div className="py-32">
      <Container>
        <SectionHeading
          eyebrow="Contact"
          heading="Contact Overview"
        />
        <div className="mt-12 text-muted-foreground max-w-3xl space-y-6">
          <p>
            [Placeholder for contact content]
          </p>
        </div>
      </Container>
    </div>
  );
}
