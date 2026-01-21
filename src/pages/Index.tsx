import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ExperienceSection from "@/components/ExperienceSection";
import SkillsMatrix from "@/components/SkillsMatrix";
import JDAnalyzer from "@/components/JDAnalyzer";
import AIChatDrawer from "@/components/AIChatDrawer";
import Footer from "@/components/Footer";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Track visitor on page load
  const { stats } = useVisitorTracking();

  // Log visitor stats for debugging (optional - can be removed)
  useEffect(() => {
    if (stats) {
      console.log(`Visitor tracked. Total unique visitors: ${stats.uniqueVisitors}`);
    }
  }, [stats]);

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
