import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function About() {
  return (
    <section className="py-24 lg:py-32 bg-[#FAF8F3]">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Side */}
          <div className="order-2 lg:order-1">
            <FadeIn direction="right">
              <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0">
                {/* Image */}
                <div className="absolute inset-0 rounded-xl overflow-hidden border border-[#E9E6E0] shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop"
                    alt="TASPU community gathering"
                    className="w-full h-full object-cover grayscale-[20%]"
                  />
                </div>
                {/* Small Gold Accent */}
                <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-[#D4AF37] z-10" />
                {/* Caption */}
                <div className="absolute -bottom-6 -right-6 bg-white p-6 shadow-lg border border-[#E9E6E0] max-w-[200px] rounded-lg hidden md:block">
                  <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1">
                    TASPU Community
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    Telangana
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Text Side */}
          <div className="order-1 lg:order-2">
            <FadeIn direction="left" delay={0.2}>
              <div className="space-y-8">
                <SectionHeading
                  eyebrow="About TASPU"
                  heading={<>Stronger representation starts with a stronger community.</>}
                />
                
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    The Telangana Authorized Service Centre Proprietors Union (TASPU) brings together authorized service centre owners across the state to ensure a unified voice, better representation, and mutual support.
                  </p>
                  <p>
                    We believe that by standing together, we can overcome industry challenges, elevate service standards, and protect the interests of our businesses and the customers we serve.
                  </p>
                </div>

                <div className="pt-4">
                  <Button variant="outline" size="lg" asChild className="h-12 px-8">
                    <Link href="/about">Learn More About Us</Link>
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>

        </div>
      </Container>
    </section>
  );
}
