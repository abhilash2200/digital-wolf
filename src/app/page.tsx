import { Hero } from "@/components/sections/Hero";
import { TrustSection } from "@/components/sections/TrustSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { GrowthPhilosophy } from "@/components/sections/GrowthPhilosophy";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { ContactSection } from "@/components/sections/ContactSection";
import { ScrollChoreography } from "@/components/motion/ScrollChoreography";
import { PageTransition } from "@/components/motion/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <TrustSection />
      <ProblemSection />
      <ServicesSection />
      <GrowthPhilosophy />
      <ProcessSection />
      <CaseStudies />
      <Testimonials />
      <FAQ />
      <ContactSection />
      <ScrollChoreography />
    </PageTransition>
  );
}
