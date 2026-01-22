import { motion } from "framer-motion";
import { usePublicExperiences, ExperiencePublic } from "@/hooks/usePublicData";
import { format } from "date-fns";
import ScrollDownCaret from "@/components/ScrollDownCaret";
import { Briefcase } from "lucide-react";

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
  const dateRange = startDate && endDate ? `${startDate} – ${endDate}` : startDate || endDate || "";

  return {
    id: exp.id,
    company: exp.company_name,
    dateRange,
    titleProgression: exp.title_progression || exp.title,
    achievements: exp.bullet_points || [],
  };
};

const ExperienceCard = ({ experience, index }: { experience: FormattedExperience; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="glass rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-border/50">
        <div className="p-6">
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-serif font-semibold text-foreground">
                {experience.company}
              </h3>
              <span className="text-sm text-muted-foreground whitespace-nowrap shrink-0">
                {experience.dateRange}
              </span>
            </div>
            <p className="text-primary font-medium">{experience.titleProgression}</p>
          </div>

          {experience.achievements.length > 0 && (
            <ul className="space-y-2">
              {experience.achievements.map((achievement, i) => (
                <li key={i} className="flex items-center gap-3 text-muted-foreground text-sm leading-relaxed">
                  <span className="text-primary shrink-0">•</span>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-center py-16"
  >
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
      <Briefcase className="w-8 h-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-medium text-foreground mb-2">No experiences yet</h3>
    <p className="text-muted-foreground max-w-md mx-auto">
      Experience details will appear here once added through the admin panel.
    </p>
  </motion.div>
);

const ExperienceSection = () => {
  const { data: dbExperiences, isLoading } = usePublicExperiences();
  
  const experiences: FormattedExperience[] = dbExperiences?.length 
    ? dbExperiences.map(formatExperience)
    : [];

  return (
    <section id="experience" className="py-24 px-6 relative bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A track record of building systems that scale and leading teams that ship.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : experiences.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <ExperienceCard key={exp.id} experience={exp} index={index} />
            ))}
          </div>
        )}
      </div>

      <ScrollDownCaret nextSectionId="skills" ariaLabel="Scroll to Skills" />
    </section>
  );
};

export default ExperienceSection;
