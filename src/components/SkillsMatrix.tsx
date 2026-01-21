import { Check, Circle, X } from "lucide-react";
import { motion } from "framer-motion";
import { useGroupedPublicSkills, SkillPublic } from "@/hooks/usePublicData";
import ScrollDownCaret from "@/components/ScrollDownCaret";

// Fallback data when no database skills exist
const fallbackSkillCategories = {
  strong: {
    icon: Check,
    title: "Strong",
    accent: "primary",
    skills: [
      "TypeScript / JavaScript",
      "React & Next.js",
      "Node.js",
      "PostgreSQL",
      "System Design",
      "Technical Leadership",
      "API Design",
      "Performance Optimization",
    ],
  },
  moderate: {
    icon: Circle,
    title: "Moderate",
    accent: "muted",
    skills: [
      "Python",
      "Go",
      "Kubernetes",
      "AWS / GCP",
      "GraphQL",
      "Machine Learning Basics",
      "Mobile (React Native)",
    ],
  },
  gaps: {
    icon: X,
    title: "Gaps",
    accent: "secondary",
    skills: [
      "Rust",
      "Low-level Systems",
      "iOS / Swift",
      "Data Science",
      "Blockchain",
    ],
  },
};

interface SkillCategoryConfig {
  icon: typeof Check | typeof Circle | typeof X;
  title: string;
  accent: string;
  skills: string[];
}

const SkillsMatrix = () => {
  const { data: groupedSkills, isLoading } = useGroupedPublicSkills();
  
  // Build skill categories from database or use fallback
  const hasDbSkills = groupedSkills.strong.length > 0 || 
                       groupedSkills.moderate.length > 0 || 
                       groupedSkills.gap.length > 0;
  
  const skillCategories: Record<string, SkillCategoryConfig> = hasDbSkills
    ? {
        strong: {
          icon: Check,
          title: "Strong",
          accent: "primary",
          skills: groupedSkills.strong.map(s => s.skill_name),
        },
        moderate: {
          icon: Circle,
          title: "Moderate",
          accent: "muted",
          skills: groupedSkills.moderate.map(s => s.skill_name),
        },
        gaps: {
          icon: X,
          title: "Gaps",
          accent: "secondary",
          skills: groupedSkills.gap.map(s => s.skill_name),
        },
      }
    : fallbackSkillCategories;

  return (
    <section id="skills" className="py-24 px-6 bg-card/30 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Skills Matrix
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            An honest breakdown of where I excel, where I'm competent, and where I have gaps.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(skillCategories).map(([key, category], index) => {
            const Icon = category.icon;
            const isStrong = key === "strong";
            const isGaps = key === "gaps";

            // Skip empty categories
            if (category.skills.length === 0) return null;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glass rounded-xl p-6 ${
                  isStrong ? "glow-primary" : isGaps ? "glow-secondary" : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isStrong
                        ? "bg-primary/20 text-primary"
                        : isGaps
                        ? "bg-secondary/20 text-secondary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-foreground">
                    {category.title}
                  </h3>
                </div>

                <ul className="space-y-3">
                  {category.skills.map((skill) => (
                    <li
                      key={skill}
                      className={`text-sm ${
                        isStrong
                          ? "text-foreground"
                          : isGaps
                          ? "text-secondary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>

      <ScrollDownCaret nextSectionId="fit-check" ariaLabel="Scroll to Fit Check" />
    </section>
  );
};

export default SkillsMatrix;
