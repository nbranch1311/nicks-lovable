import { useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Experience {
  id: string;
  company: string;
  dateRange: string;
  titleProgression: string;
  achievements: string[];
  aiContext: {
    situation: string;
    approach: string;
    technicalWork: string;
    lessonsLearned: string;
  };
}

const experiences: Experience[] = [
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
    aiContext: {
      situation: "Inherited a 500k LOC monolith with 45-minute deploy cycles and frequent production incidents.",
      approach: "Proposed incremental strangler fig pattern rather than big-bang rewrite. Built coalition with product and leadership.",
      technicalWork: "Designed event-driven architecture with Kafka, implemented circuit breakers, built custom deployment tooling.",
      lessonsLearned: "Technical solutions are 30% of the work. The other 70% is alignment, communication, and managing organizational anxiety about change.",
    },
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
    aiContext: {
      situation: "Series A startup with no engineering processes. Cowboy coding culture leading to regular outages.",
      approach: "Introduced changes gradually, leading by example rather than mandate. Built trust before proposing structural changes.",
      technicalWork: "Implemented Redis caching layer, PostgreSQL query optimization, set up DataDog monitoring stack.",
      lessonsLearned: "Early-stage startups need pragmatic perfectionism. Ship fast but leave rope to climb back up.",
    },
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
    aiContext: {
      situation: "Massive codebase, complex organizational politics, high bar for code quality.",
      approach: "Focused on learning the system deeply before proposing changes. Found mentors who helped navigate the org.",
      technicalWork: "C++, distributed systems, A/B testing frameworks, massive-scale data processing.",
      lessonsLearned: "Big companies teach you rigor and scale. But you can lose your ability to ship without massive infrastructure.",
    },
  },
];

const ExperienceCard = ({ experience }: { experience: Experience }) => {
  const [expanded, setExpanded] = useState(false);

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

        <ul className="space-y-2 mb-4">
          {experience.achievements.map((achievement, index) => (
            <li key={index} className="flex items-start gap-2 text-muted-foreground">
              <span className="text-primary mt-1">•</span>
              {achievement}
            </li>
          ))}
        </ul>

        <Button
          variant="ghost"
          onClick={() => setExpanded(!expanded)}
          className="text-primary hover:text-primary/80 hover:bg-primary/10 p-0 h-auto font-medium"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {expanded ? "Hide" : "Show"} AI Context
          <ChevronDown
            className={`w-4 h-4 ml-2 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </Button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-background/50 p-6 border-t border-border/50 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
                  Situation
                </h4>
                <p className="text-muted-foreground italic">{experience.aiContext.situation}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
                  Approach
                </h4>
                <p className="text-muted-foreground italic">{experience.aiContext.approach}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
                  Technical Work
                </h4>
                <p className="text-muted-foreground italic">{experience.aiContext.technicalWork}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
                  Lessons Learned
                </h4>
                <p className="text-muted-foreground italic">{experience.aiContext.lessonsLearned}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ExperienceSection = () => {
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
            Each role includes queryable AI context—the real story behind the bullet points.
          </p>
        </motion.div>

        <div className="space-y-6">
          {experiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
