import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { FadeIn, StaggerContainer, FadeInStaggerItem } from "@/components/ui/FadeIn";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-[90vh] flex items-center">
      <Container className="relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Text Content - Approx 45-50% width on Desktop */}
          <StaggerContainer className="lg:col-span-5 xl:col-span-6 space-y-8">
            <FadeInStaggerItem>
              <div className="inline-flex items-center space-x-3 mb-2">
                <div className="h-px w-8 bg-primary" />
                <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-muted-foreground">
                  Telangana Authorized Service Centre Proprietors Union
                </span>
              </div>
            </FadeInStaggerItem>

            <FadeInStaggerItem>
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-foreground">
                Stronger <span className="text-primary block">Together.</span>
              </h1>
            </FadeInStaggerItem>

            <FadeInStaggerItem>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
                Building a connected and empowered community of authorized service centre proprietors across Telangana.
              </p>
            </FadeInStaggerItem>

            <FadeInStaggerItem>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" asChild className="h-14 px-8 text-base shadow-lg shadow-primary/20">
                  <Link href="/membership/apply">Become a Member</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-14 px-8 text-base">
                  <Link href="/about">Discover TASPU</Link>
                </Button>
              </div>
            </FadeInStaggerItem>
          </StaggerContainer>

          {/* Image Content - Approx 50-55% width on Desktop */}
          <div className="lg:col-span-7 xl:col-span-6 relative">
            <FadeIn delay={0.4} duration={0.8} direction="left">
              <div className="relative aspect-[4/3] md:aspect-[16/10] lg:aspect-[4/3] flex items-center justify-center">
                <img
                  src="/union-logo.png"
                  alt="Telangana Authorized Service Centre Proprietors Union Logo"
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
            </FadeIn>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:12px_12px] opacity-20 -z-10" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[radial-gradient(#8B1E2D_1px,transparent_1px)] [background-size:16px_16px] opacity-10 -z-10" />
          </div>

        </div>
      </Container>
    </section>
  );
}
