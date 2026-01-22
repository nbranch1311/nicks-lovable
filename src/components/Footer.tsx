import { Github, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePublicProfile } from "@/hooks/usePublicData";

const Footer = () => {
  const { data: profile } = usePublicProfile();

  const name = profile?.name || "Nick Branch";
  const title = profile?.title || "Principal Software Engineer";
  const githubUrl = profile?.github_url || "";
  const linkedinUrl = profile?.linkedin_url || "";
  const email = profile?.email || "";

  return (
    <footer id="projects" className="py-16 px-6 border-t border-border/50">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
            {name}
          </h3>
          <p className="text-muted-foreground mb-6">{title}</p>

          {/* Social Links */}
          <div className="flex justify-center gap-4 mb-8">
            {githubUrl && (
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full glass text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
              >
                <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5" />
                </a>
              </Button>
            )}
            {linkedinUrl && (
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full glass text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
              >
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-5 h-5" />
                </a>
              </Button>
            )}
            {email && (
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full glass text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
              >
                <a href={`mailto:${email}`}>
                  <Mail className="w-5 h-5" />
                </a>
              </Button>
            )}
          </div>

          {/* Tagline */}
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Built with AI-queryable context. Excited for future prospects. Because resumes are static and often times boring, 
            but careers can be exciting and alwaysworth exploring. I am not a rapper.
          </p>

          <div className="mt-8 pt-8">
            <Separator className="mb-8 bg-border/30" />
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Nick Branch. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
