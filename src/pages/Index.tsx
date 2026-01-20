import { useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ExperienceSection from "@/components/ExperienceSection";
import SkillsMatrix from "@/components/SkillsMatrix";
import JDAnalyzer from "@/components/JDAnalyzer";
import AIChatDrawer from "@/components/AIChatDrawer";
import Footer from "@/components/Footer";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation onOpenChat={() => setIsChatOpen(true)} />
      
      <main>
        <HeroSection onOpenChat={() => setIsChatOpen(true)} />
        <ExperienceSection />
        <SkillsMatrix />
        <JDAnalyzer />
      </main>
      
      <Footer />
      
      <AIChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Index;
