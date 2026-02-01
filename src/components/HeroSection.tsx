import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { usePublicProfile, usePublicExperiences } from "@/hooks/usePublicData";
import ScrollDownCaret from "@/components/ScrollDownCaret";

interface HeroSectionProps {
  onOpenChat: () => void;
}

const HeroSection = ({ onOpenChat }: HeroSectionProps) => {
  const { data: profile, isLoading: profileLoading } = usePublicProfile();
  const { data: experiences, isLoading: experiencesLoading } =
    usePublicExperiences();

  // Extract unique company names from experiences
  const companies =
    experiences?.map((exp) => exp.company_name).filter(Boolean) || [];

  // Use database data if available, otherwise fallback to defaults
  const name = profile?.name || "Nick Branch";
  const title = profile?.title || "Principal Software Engineer";
  const elevatorPitch =
    profile?.elevator_pitch ||
    "My passion begins and ends with the user experience. Applications should feel as enjoyable to use as they are easy to use";
  const targetTitles = profile?.target_titles?.length
    ? profile.target_titles
    : ["Staff Engineer"];
  const targetCompanyStages = profile?.target_company_stages?.length
    ? profile.target_company_stages
    : [];
  const availabilityStatus =
    profile?.availability_status || "Open to opportunities";
  const isLoading = profileLoading || experiencesLoading;

  // Format availability badge text
  const getAvailabilityText = () => {
    const statusMap: Record<string, string> = {
      actively_looking: "Actively looking",
      open: "Open to opportunities",
      not_looking: "Not currently looking",
    };
    return statusMap[availabilityStatus] || availabilityStatus;
  };

  return (
    <section
      id="top"
      className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-12 relative"
    >
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
        >
          <Badge
            variant="outline"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-normal border-transparent bg-transparent mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-slow" />
            <span className="text-muted-foreground">
              {getAvailabilityText()} for{" "}
              <span className="text-foreground font-medium">
                {targetTitles.join(", ")}
              </span>
              {targetCompanyStages.length > 0 && (
                <>
                  {" "}
                  at{" "}
                  <span className="text-foreground font-medium">
                    {targetCompanyStages.join(", ")}
                  </span>
                </>
              )}
            </span>
          </Badge>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground mb-4"
        >
          {isLoading ? <span className="opacity-50">Loading...</span> : name}
        </motion.h1>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl md:text-3xl text-primary font-medium mb-6"
        >
          {title}
        </motion.p>

        {/* Positioning Statement */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          {elevatorPitch}
        </motion.p>

        {/* Company Badges */}
        {companies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {companies.map((company) => (
              <Badge
                key={company}
                variant="outline"
                className="px-4 py-2 rounded-full glass text-sm text-muted-foreground hover:text-foreground transition-colors border-transparent bg-transparent font-normal"
              >
                {company}
              </Badge>
            ))}
          </motion.div>
        )}

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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <ScrollDownCaret
          nextSectionId="experience"
          ariaLabel="Scroll to Experience"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
