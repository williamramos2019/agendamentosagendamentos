import { PublicLayout } from "@/components/layout/PublicLayout";
import { HeroSection } from "@/components/home/sections/HeroSection";
import { ServicesSection } from "@/components/home/sections/ServicesSection";
import { StatsSection } from "@/components/home/sections/StatsSection";
import { TestimonialsSection } from "@/components/home/sections/TestimonialsSection";
import { FAQSection } from "@/components/home/sections/FAQSection";
import { FinalCTA } from "@/components/home/sections/FinalCTA";
import { motion } from "framer-motion";

export default function Index() {
  return (
    <PublicLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <HeroSection />
        <StatsSection />
        
        <div id="servicos">
          <ServicesSection />
        </div>

        <TestimonialsSection />
        <FAQSection />
        <FinalCTA />
      </motion.div>
    </PublicLayout>
  );
}