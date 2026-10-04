import React from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn, StaggerContainer, FadeInStaggerItem } from "@/components/ui/FadeIn";

const LEADERSHIP_PLACEHOLDERS = [
  { id: 1, role: "President", name: "Vijaya Bhaskar Reddy", photo: "/leaders/president.png" },
  { id: 2, role: "Working President", name: "Murali Krishna Teja", photo: "/leaders/working president.jpeg" },
  { id: 3, role: "General Secretary", name: "Thanniru Nagaraju", photo: "/leaders/gen sec.jpeg" },
  { id: 4, role: "Joint Secretary", name: "Chekrala Krishna Prasad", photo: "/leaders/joint sec.jpeg" },
  { id: 5, role: "Treasurer", name: "Mohd Anwar", photo: "/leaders/treasurer.jpeg" },
  { id: 6, role: "Executive Member", name: "Ramsingh Bondil", photo: "/leaders/ec member.jpeg" },
  { id: 7, role: "Executive Member", name: "Thipparthi Chakradhar Kumar", photo: "/leaders/ec member 2.jpeg" },
  { id: 8, role: "Guest President", name: "Rameshwar Rao", photo: "/leaders/guest president.jpeg" },
];

export function Leadership() {
  return (
    <section className="py-24 lg:py-32 bg-[#FAF8F3]">
      <Container>
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <SectionHeading
            eyebrow="Our Leadership"
            heading="Guided by Experience."
          />
        </div>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {LEADERSHIP_PLACEHOLDERS.map((leader) => (
            <FadeInStaggerItem key={leader.id} direction="up">
              <div className="group relative bg-white border border-[#E9E6E0] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Image Container - Rectangular Portrait */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#E9E6E0]">
                  <img
                    src={leader.photo}
                    alt={leader.role}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Subtle Gold Line on Hover */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#D4AF37] transition-all duration-500 ease-out group-hover:w-full" />
                </div>

                <div className="p-6 text-center">
                  <div className="text-sm font-semibold tracking-wider uppercase text-primary mb-2">
                    {leader.role}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    {leader.name}
                  </h3>
                </div>
              </div>
            </FadeInStaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
