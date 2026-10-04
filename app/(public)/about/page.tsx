import React from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function AboutPage() {
  return (
    <div className="py-32">
      <Container>
        <SectionHeading
          eyebrow="About Us"
          heading="Our Story"
          description="Learn about the history and foundation of TASPU."
        />
        <div className="mt-12 text-muted-foreground max-w-3xl space-y-6">
          <p>
            The Telangana Authorized Service Centre Proprietors Union (TASPU) was founded to unite the voices of service centre owners across the state.
          </p>
          <p>
            [Placeholder for detailed about content]
          </p>
        </div>
      </Container>
    </div>
  );
}
