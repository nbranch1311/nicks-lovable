import { MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onOpenChat: () => void;
}

const companies = [
  "Google",
  "Meta",
  "Stripe",
  "Airbnb",
  "Startup Co.",
];

const HeroSection = ({ onOpenChat }: HeroSectionProps) => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-12 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-slow" />
          <span className="text-sm text-muted-foreground">
            Open to <span className="text-foreground font-medium">Staff Engineer</span> at{" "}
            <span className="text-foreground font-medium">Series B+ Companies</span>
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground mb-4"
        >
          Nick Branch
        </motion.h1>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl md:text-3xl text-primary font-medium mb-6"
        >
          Principal Software Engineer
        </motion.p>

        {/* Positioning Statement */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          I build high-performance systems that scale. 12 years shipping products 
          used by millions, from early-stage chaos to public company stability.
        </motion.p>

        {/* Company Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {companies.map((company, index) => (
            <span
              key={company}
              className="px-4 py-2 rounded-full glass text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {company}
            </span>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button
            onClick={onOpenChat}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-6 glow-primary"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Ask AI About Me
          </Button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
