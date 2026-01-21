import { useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { usePublicExperiences, ExperiencePublic } from "@/hooks/usePublicData";
import { format } from "date-fns";

// Fallback data when no database experiences exist
const fallbackExperiences = [
  {
    id: "exp1",
    company: "TechCorp Inc.",
    dateRange: "2021 - Present",
    titleProgression: "Senior → Staff Engineer",
    achievements: [
      "Led migration of monolith to microservices, reducing deployment time by 85%",
      "Built real-time analytics pipeline processing 2M events/second",
      "Mentored 8 engineers, 3 promoted to senior level",
    ],
  },
  {
    id: "exp2",
    company: "StartupXYZ",
    dateRange: "2018 - 2021",
    titleProgression: "Engineer → Senior Engineer",
    achievements: [
      "Built core payment infrastructure handling $50M+ annually",
      "Reduced API latency by 60% through caching and query optimization",
      "Established engineering practices: CI/CD, code review, on-call rotation",
    ],
  },
  {
    id: "exp3",
    company: "BigTech Corp",
    dateRange: "2015 - 2018",
    titleProgression: "Junior → Mid-Level Engineer",
    achievements: [
      "Contributed to search ranking algorithm improvements (+3% relevance)",
      "Built internal tools used by 500+ engineers daily",
      "Led intern program, managed 4 summer interns",
    ],
  },
];

interface FormattedExperience {
  id: string;
  company: string;
  dateRange: string;
  titleProgression: string;
  achievements: string[];
}

const formatExperience = (exp: ExperiencePublic): FormattedExperience => {
  const startDate = exp.start_date ? format(new Date(exp.start_date), "MMM yyyy") : "";
  const endDate = exp.is_current ? "Present" : exp.end_date ? format(new Date(exp.end_date), "MMM yyyy") : "";
  const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : startDate || endDate || "";

  return {
    id: exp.id,
    company: exp.company_name,
    dateRange,
    titleProgression: exp.title_progression || exp.title,
    achievements: exp.bullet_points || [],
  };
};

const ExperienceCard = ({ experience }: { experience: FormattedExperience }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl overflow-hidden"
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h3 className="text-xl font-serif font-semibold text-foreground">
              {experience.company}
            </h3>
            <p className="text-primary font-medium">{experience.titleProgression}</p>
          </div>
          <span className="text-sm text-muted-foreground mt-2 md:mt-0">
            {experience.dateRange}
          </span>
        </div>

        {experience.achievements.length > 0 && (
          <ul className="space-y-2">
            {experience.achievements.map((achievement, index) => (
              <li key={index} className="flex items-start gap-2 text-muted-foreground">
                <span className="text-primary mt-1">•</span>
                {achievement}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

const ExperienceSection = () => {
  const { data: dbExperiences, isLoading } = usePublicExperiences();
  
  // Use database experiences if available, otherwise fallback
  const experiences: FormattedExperience[] = dbExperiences?.length 
    ? dbExperiences.map(formatExperience)
    : fallbackExperiences;

  return (
    <section id="experience" className="py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A track record of building systems that scale and leading teams that ship.
          </p>
        </motion.div>

        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading experiences...</div>
          ) : (
            experiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
