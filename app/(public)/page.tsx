import { Hero } from "@/components/public/home/Hero";
import { Statistics } from "@/components/public/home/Statistics";
import { About } from "@/components/public/home/About";
import { MissionVision } from "@/components/public/home/MissionVision";
import { WhyTaspu } from "@/components/public/home/WhyTaspu";
import { MembershipCTA } from "@/components/public/home/MembershipCTA";
import { Leadership } from "@/components/public/home/Leadership";
import { News } from "@/components/public/home/News";
import { Announcements } from "@/components/public/home/Announcements";
import { Resources } from "@/components/public/home/Resources";
import { Media } from "@/components/public/home/Media";
import { FinalCTA } from "@/components/public/home/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Statistics />
      <About />
      <MissionVision />
      <WhyTaspu />
      <MembershipCTA />
      <Leadership />
      <News />
      <Announcements />
      <Resources />
      <Media />
      <FinalCTA />
    </>
  );
}
