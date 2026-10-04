import React from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function NewsPage() {
  return (
    <div className="py-32">
      <Container>
        <SectionHeading
          eyebrow="News"
          heading="News Overview"
        />
        <div className="mt-12 text-muted-foreground max-w-3xl space-y-6">
          <p>
            [Placeholder for news content]
          </p>
        </div>
      </Container>
    </div>
  );
}
