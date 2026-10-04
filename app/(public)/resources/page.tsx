import React from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function ResourcesPage() {
  return (
    <div className="py-32">
      <Container>
        <SectionHeading
          eyebrow="Resources"
          heading="Resources Overview"
        />
        <div className="mt-12 text-muted-foreground max-w-3xl space-y-6">
          <p>
            [Placeholder for resources content]
          </p>
        </div>
      </Container>
    </div>
  );
}
