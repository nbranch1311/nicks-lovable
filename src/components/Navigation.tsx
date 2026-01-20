import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface NavigationProps {
  onOpenChat: () => void;
}

const Navigation = ({ onOpenChat }: NavigationProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo/Initials */}
        <a 
          href="#" 
          className="text-2xl font-serif font-bold text-foreground hover:text-primary transition-colors"
        >
          NB
        </a>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("experience")}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            Experience
          </button>
          <button
            onClick={() => scrollToSection("fit-check")}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            Fit Check
          </button>
          <button
            onClick={() => scrollToSection("projects")}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            Projects
          </button>
        </div>

        {/* Ask AI Button */}
        <Button
          onClick={onOpenChat}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium glow-primary"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Ask AI
        </Button>
      </div>
    </motion.nav>
  );
};

export default Navigation;
