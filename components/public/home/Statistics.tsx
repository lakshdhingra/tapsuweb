"use client";

import React from "react";
import { Container } from "@/components/layout/Container";
import { FadeIn, StaggerContainer, FadeInStaggerItem } from "@/components/ui/FadeIn";

const STATS = [
  { value: "00+", label: "MEMBERS" },
  { value: "00+", label: "DISTRICTS" },
  { value: "00+", label: "YEARS" },
  { value: "00+", label: "INITIATIVES" },
];

export function Statistics() {
  return (
    <section className="py-20 bg-background border-y border-border">
      <Container>
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-border">
          {STATS.map((stat, index) => (
            <FadeInStaggerItem key={index} direction="up">
              <div className="flex flex-col items-center text-center space-y-2 relative px-4">
                <span className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                  {stat.value}
                </span>
                <span className="text-xs md:text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  {stat.label}
                </span>
                {/* Small gold divider */}
                <div className="h-[2px] w-8 bg-[#D4AF37] mt-4" />
              </div>
            </FadeInStaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
