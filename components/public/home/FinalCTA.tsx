import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/ui/FadeIn";

export function FinalCTA() {
  return (
    <section className="bg-charcoal text-white py-24 lg:py-32 relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 transform origin-top-right pointer-events-none" />
      
      <Container className="relative z-10 text-center">
        <FadeIn direction="up">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white max-w-4xl mx-auto leading-tight">
            Stronger together. <br className="hidden sm:block" />
            <span className="text-[#D4AF37]">Stronger for Telangana.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
            Join the collective voice of authorized service centre proprietors and help shape the future of our industry.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="w-full sm:w-auto h-14 px-8 bg-primary hover:bg-primary-maroon text-white border-0">
              <Link href="/membership/apply">Apply for Membership</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto h-14 px-8 border-gray-600 hover:bg-white hover:text-charcoal bg-transparent text-white">
              <Link href="/contact">Contact TASPU</Link>
            </Button>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
