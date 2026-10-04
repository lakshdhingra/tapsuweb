import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn, StaggerContainer, FadeInStaggerItem } from "@/components/ui/FadeIn";
import { ArrowRight, Calendar } from "lucide-react";

export function News() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <Container>
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <SectionHeading
            eyebrow="Latest News"
            heading="Updates from TASPU."
          />
          <Button variant="outline" asChild className="hidden md:flex">
            <Link href="/news">
              View All News <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        <StaggerContainer className="grid lg:grid-cols-12 gap-8">
          
          {/* Featured Article - Dominant (7 cols) */}
          <FadeInStaggerItem className="lg:col-span-7">
            <Link href="/news/placeholder-slug-1" className="group block h-full">
              <div className="relative rounded-2xl overflow-hidden h-full min-h-[400px] border border-border/50">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop"
                  alt="TASPU Annual Meeting"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm">
                      Press Release
                    </span>
                    <span className="flex items-center text-sm text-gray-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      Oct 15, 2026
                    </span>
                  </div>
                  <h3 className="font-heading text-3xl md:text-4xl font-bold mb-3 leading-tight group-hover:text-[#D4AF37] transition-colors">
                    TASPU Hosts Annual General Meeting Discussing Future Industry Standards
                  </h3>
                  <p className="text-gray-300 line-clamp-2 max-w-xl">
                    More than 500 authorized service centre proprietors gathered in Hyderabad to discuss the upcoming changes in right-to-repair legislation and its impact on the industry in Telangana.
                  </p>
                </div>
              </div>
            </Link>
          </FadeInStaggerItem>

          {/* Secondary Articles (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <FadeInStaggerItem>
              <Link href="/news/placeholder-slug-2" className="group flex flex-col sm:flex-row gap-6">
                <div className="shrink-0 rounded-xl overflow-hidden w-full sm:w-40 aspect-video sm:aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop"
                    alt="Industry Training"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center">
                    <Calendar className="w-3 h-3 mr-2" />
                    Oct 02, 2026
                  </span>
                  <h4 className="font-heading text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    New Technical Training Partnership Announced
                  </h4>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    A new memorandum of understanding has been signed to provide advanced technical training to members.
                  </p>
                </div>
              </Link>
            </FadeInStaggerItem>

            <FadeInStaggerItem>
              <div className="w-full h-px bg-border" />
            </FadeInStaggerItem>

            <FadeInStaggerItem>
              <Link href="/news/placeholder-slug-3" className="group flex flex-col sm:flex-row gap-6">
                <div className="shrink-0 rounded-xl overflow-hidden w-full sm:w-40 aspect-video sm:aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop"
                    alt="Policy Discussion"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center">
                    <Calendar className="w-3 h-3 mr-2" />
                    Sep 28, 2026
                  </span>
                  <h4 className="font-heading text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    TASPU Delegation Meets with State Officials
                  </h4>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    Key discussions regarding the standardization of service center certifications across districts.
                  </p>
                </div>
              </Link>
            </FadeInStaggerItem>
          </div>
          
        </StaggerContainer>

        <div className="mt-12 text-center md:hidden">
          <Button variant="outline" asChild className="w-full">
            <Link href="/news">
              View All News <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
