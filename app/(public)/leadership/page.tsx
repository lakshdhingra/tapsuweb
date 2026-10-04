import React from "react";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

// ─── EDIT LEADER DETAILS HERE ────────────────────────────────────────────────
// To update a leader's info:
//   1. Change `name`     → their full name
//   2. Change `position` → their title / role
//   3. Change `photo`    → path to their photo inside the `public/` folder
//                          e.g. "/leaders/john-doe.jpg"
//      Place the photo file at: public/leaders/<filename>.jpg
// ─────────────────────────────────────────────────────────────────────────────
const leaders = [
  {
    id: 1,
    name: "Vijaya Bhaskar Reddy",
    position: "President",
    photo: "/leaders/president.png",
  },

  {
    id: 2,
    name: "Murali Krishna Teja",
    position: "Working President",
    photo: "/leaders/working president.jpeg",
  },
  {
    id: 3,
    name: "Thanniru Nagaraju",
    position: "General Secretary",
    photo: "/leaders/gen sec.jpeg",
  },
  {
    id: 4,
    name: "Chekrala Krishna Prasad",
    position: "Joint Secretary",
    photo: "/leaders/joint sec.jpeg",
  },
  {
    id: 5,
    name: "Mohd Anwar",
    position: "Treasurer",
    photo: "/leaders/treasurer.jpeg",
  },
  {
    id: 6,
    name: "Ramsingh Bondil",
    position: "Executive Member",
    photo: "/leaders/ec member.jpeg",
  },
  {
    id: 7,
    name: "Thipparthi Chakradhar Kumar",
    position: "Executive Member",
    photo: "/leaders/ec member 2.jpeg",
  },
  {
    id: 8,
    name: "Rameshwar Rao",
    position: "Guest President",
    photo: "/leaders/guest president.jpeg",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

interface Leader {
  id: number;
  name: string;
  position: string;
  photo: string;
}

function LeaderCard({ leader, featured = false }: { leader: Leader; featured?: boolean }) {
  return (
    <div
      className={`group flex flex-col items-center text-center rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${featured ? "col-span-full md:col-span-1 md:col-start-2 lg:col-start-auto" : ""
        }`}
    >
      {/* Photo */}
      <div
        className={`relative overflow-hidden rounded-full ring-4 ring-border group-hover:ring-primary transition-all duration-300 ${featured ? "w-40 h-40" : "w-32 h-32"
          }`}
      >
        <Image
          src={leader.photo}
          alt={`Photo of ${leader.name}`}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 160px, 128px"
        />
      </div>

      {/* Name & Position */}
      <div className="mt-5 space-y-1">
        <h3
          className={`font-heading font-bold tracking-tight text-primary ${featured ? "text-2xl" : "text-lg"
            }`}
        >
          {leader.name}
        </h3>
        <p
          className={`font-semibold tracking-widest uppercase ${featured
            ? "text-sm text-primary"
            : "text-xs text-muted-foreground"
            }`}
        >
          {leader.position}
        </p>
      </div>
    </div>
  );
}

export default function LeadershipPage() {
  const [president, ...rest] = leaders;

  return (
    <div className="py-32">
      <Container>
        <SectionHeading
          eyebrow="Leadership"
          heading="Our Executive Committee"
          description="Meet the dedicated leaders driving TASPU's mission to unite and empower service centre owners across Telangana."
          alignment="center"
          className="items-center text-center"
        />

        {/* President — full-width hero card */}
        <div className="mt-16 flex justify-center">
          <div className="w-full max-w-sm">
            <LeaderCard leader={president} featured />
          </div>
        </div>

        {/* Remaining 6 leaders — responsive grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((leader) => (
            <LeaderCard key={leader.id} leader={leader} />
          ))}
        </div>
      </Container>
    </div>
  );
}
