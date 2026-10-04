import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";

export function MembershipCTA() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionHeading
            heading="Become part of something stronger."
            alignment="center"
          />
        </div>

        <FadeIn direction="up">
          <div className="relative rounded-2xl overflow-hidden aspect-video md:aspect-[21/9] lg:aspect-[2.5/1]">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop"
                alt="Professionals in a meeting"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-charcoal/70 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 sm:p-12">
              <h2 className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-8 tracking-tight">
                STRONGER TOGETHER.
              </h2>
              <Button size="lg" asChild className="h-14 px-10 text-lg bg-primary hover:bg-primary-maroon text-white border-0 shadow-2xl">
                <Link href="/membership/apply">Apply for Membership</Link>
              </Button>
            </div>
            
            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none rounded-bl-full" />
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
