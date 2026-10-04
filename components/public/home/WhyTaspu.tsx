"use client";

import React, { useState } from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Users, Shield, BookOpen, HeartHandshake, Network, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

const BENEFITS = [
  {
    id: "01",
    title: "Representation",
    description: "A strong, unified voice in discussions with brands, distributors, and government bodies.",
    icon: Shield,
  },
  {
    id: "02",
    title: "Networking",
    description: "Connect with fellow proprietors, share experiences, and build valuable industry relationships.",
    icon: Network,
  },
  {
    id: "03",
    title: "Advocacy",
    description: "Protecting the rights and interests of service centres through collective bargaining and policy influence.",
    icon: Megaphone,
  },
  {
    id: "04",
    title: "Knowledge",
    description: "Access to industry insights, training resources, and technical support networks.",
    icon: BookOpen,
  },
  {
    id: "05",
    title: "Support",
    description: "Mutual assistance during business challenges and collective problem-solving initiatives.",
    icon: HeartHandshake,
  },
  {
    id: "06",
    title: "Community",
    description: "Be part of a thriving ecosystem that values collaboration over competition.",
    icon: Users,
  },
];

export function WhyTaspu() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24 lg:py-32 bg-background">
      <Container>
        <div className="mb-20 max-w-3xl">
          <SectionHeading
            heading="Why TASPU?"
            description="Because a stronger community creates a stronger voice."
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-between items-start gap-8 lg:gap-4">
          {BENEFITS.map((benefit, index) => (
            <div
              key={benefit.id}
              className="relative flex-1 group w-full lg:w-auto cursor-default"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Desktop Connecting Line */}
              {index !== BENEFITS.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-12 right-[-2rem] h-[1px] bg-border -z-10" />
              )}
              
              <div className="flex flex-row lg:flex-col items-start gap-4 lg:gap-6">
                {/* Number / Icon area */}
                <div className="shrink-0 flex items-center justify-between lg:w-full">
                  <span className="font-heading text-4xl lg:text-5xl font-bold text-muted transition-colors duration-300 group-hover:text-primary">
                    {benefit.id}
                  </span>
                  <div className="hidden lg:flex items-center justify-center w-12 h-12 bg-secondary rounded-full transform transition-all duration-300 group-hover:-translate-y-2 group-hover:bg-primary group-hover:text-white">
                    <benefit.icon size={20} />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex flex-col flex-grow">
                  <h3 className="text-xl font-bold font-heading mb-2 transition-colors duration-300 group-hover:text-primary">
                    {benefit.title}
                  </h3>
                  
                  {/* Expanding line */}
                  <div className="h-[2px] bg-[#D4AF37] w-0 transition-all duration-400 ease-out group-hover:w-full mb-3" />
                  
                  {/* Description reveals on desktop hover, always visible on mobile */}
                  <div className={cn(
                    "overflow-hidden transition-all duration-400 ease-out",
                    "h-auto opacity-100 lg:h-0 lg:opacity-0",
                    hoveredIndex === index && "lg:h-24 lg:opacity-100 lg:pt-2"
                  )}>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
