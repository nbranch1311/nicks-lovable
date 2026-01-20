import { Github, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
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
            Nick Branch
          </h3>
          <p className="text-muted-foreground mb-6">Principal Software Engineer</p>

          {/* Social Links */}
          <div className="flex justify-center gap-4 mb-8">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:hello@example.com"
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          {/* Tagline */}
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Built with AI-queryable context. Because resumes are static, 
            but careers have stories worth exploring.
          </p>

          <div className="mt-8 pt-8 border-t border-border/30">
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
