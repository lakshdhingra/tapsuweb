import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn, StaggerContainer, FadeInStaggerItem } from "@/components/ui/FadeIn";
import { ArrowRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const MEDIA_ITEMS = [
  {
    id: 1,
    title: "Annual Conference Highlights 2026",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop",
    colSpan: "lg:col-span-8",
    rowSpan: "lg:row-span-2",
  },
  {
    id: 2,
    title: "Leadership Summit",
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=1000&auto=format&fit=crop",
    colSpan: "lg:col-span-4",
    rowSpan: "lg:row-span-1",
  },
  {
    id: 3,
    title: "Technical Training Session",
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000&auto=format&fit=crop",
    colSpan: "lg:col-span-4",
    rowSpan: "lg:row-span-1",
  },
];

export function Media() {
  return (
    <section className="py-24 lg:py-32 bg-[#FAF8F3]">
      <Container>
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <SectionHeading
            eyebrow="Media"
            heading="Moments & Memories."
          />
          <Button variant="outline" asChild className="hidden md:flex">
            <Link href="/media">
              View Gallery <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 auto-rows-[250px]">
          {MEDIA_ITEMS.map((item) => (
            <FadeInStaggerItem 
              key={item.id} 
              className={cn("group relative rounded-xl overflow-hidden cursor-pointer", item.colSpan, item.rowSpan)}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/60" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                {item.type === "video" && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110">
                    <Play fill="currentColor" size={24} className="ml-1" />
                  </div>
                )}
                
                <div className="transform translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-2 block">
                    {item.type === "video" ? "Video" : "Gallery"}
                  </span>
                  <h3 className="font-heading text-xl md:text-2xl font-bold text-white">
                    {item.title}
                  </h3>
                </div>
              </div>
            </FadeInStaggerItem>
          ))}
        </StaggerContainer>

        <div className="mt-10 text-center md:hidden">
          <Button variant="outline" asChild className="w-full">
            <Link href="/media">
              View Gallery <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
