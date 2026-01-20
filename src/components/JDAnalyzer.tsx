import { useState } from "react";
import { Search, AlertTriangle, CheckCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

type Verdict = "strong" | "weak" | "conversation" | null;

interface AnalysisResult {
  verdict: Verdict;
  verdictLabel: string;
  openingParagraph: string;
  gaps: string[];
  transfers: string[];
  recommendation: string;
}

const strongFitJD = `Staff Engineer - Platform Team
We're looking for a Staff Engineer to lead our platform modernization efforts. You'll work on:
- Designing and building scalable microservices architecture
- Leading technical initiatives across multiple teams
- Mentoring senior engineers and establishing best practices
- Building real-time data pipelines and event-driven systems

Requirements:
- 8+ years of software engineering experience
- Strong experience with TypeScript, Node.js, and React
- Experience with distributed systems and microservices
- Track record of technical leadership`;

const weakFitJD = `Machine Learning Engineer - AI Research Team
We need an ML Engineer to push the boundaries of our AI capabilities:
- Design and implement novel deep learning architectures
- Publish research papers at top ML conferences
- Build and optimize training pipelines at scale
- Lead PhD-level research initiatives

Requirements:
- PhD in Machine Learning, Computer Science, or related field
- 5+ publications at NeurIPS, ICML, or equivalent
- Deep expertise in PyTorch and TensorFlow
- Experience with reinforcement learning and NLP`;

const mockAnalyze = (jd: string): AnalysisResult => {
  const isStrongFit = jd.toLowerCase().includes("microservices") || 
                      jd.toLowerCase().includes("typescript") ||
                      jd.toLowerCase().includes("platform");
  
  const isWeakFit = jd.toLowerCase().includes("machine learning") || 
                    jd.toLowerCase().includes("phd") ||
                    jd.toLowerCase().includes("research");

  if (isWeakFit) {
    return {
      verdict: "weak",
      verdictLabel: "Probably Not Your Person",
      openingParagraph: "I need to be honest with you: this role requires deep ML research expertise that I don't have. While I've built systems that use ML models, I'm not the person who designs novel architectures or publishes papers. Hiring me for this would be like hiring a great driver to design an engine.",
      gaps: [
        "No PhD or formal ML research background",
        "Haven't published academic papers",
        "Limited experience with deep learning frameworks",
        "No reinforcement learning expertise",
      ],
      transfers: [
        "Experience building production ML pipelines (as a consumer, not creator)",
        "Strong systems engineering that could support ML infrastructure",
        "Track record of learning new domains quickly",
      ],
      recommendation: "Look for someone with actual research credentials. If you need someone to build the platform that your ML models run on, that's a different conversation—and one where I'd be a strong fit.",
    };
  }

  if (isStrongFit) {
    return {
      verdict: "strong",
      verdictLabel: "Strong Fit",
      openingParagraph: "This looks like exactly the kind of work I've been doing and want to keep doing. Platform modernization, technical leadership, mentoring—I've done this at scale and have the battle scars and wins to prove it.",
      gaps: [
        "May need ramp-up time on your specific tech stack",
        "Haven't worked in your exact industry before",
      ],
      transfers: [
        "Led a nearly identical microservices migration at TechCorp",
        "Built real-time pipelines processing millions of events",
        "Established engineering practices at multiple companies",
        "Mentored 8+ engineers with strong promotion track record",
      ],
      recommendation: "Let's talk. I can share specific examples of how I've tackled similar challenges and we can explore whether the culture and technical direction align.",
    };
  }

  return {
    verdict: "conversation",
    verdictLabel: "Worth a Conversation",
    openingParagraph: "There's meaningful overlap here, but also some areas where we'd need to dig deeper. I don't want to oversell myself—let me be specific about where I'd add value and where there might be gaps.",
    gaps: [
      "Some requirements may need ramp-up time",
      "Domain expertise would need to be built",
    ],
    transfers: [
      "Core technical skills are well-aligned",
      "Leadership and mentorship experience transfers directly",
      "Problem-solving approach matches the role's challenges",
    ],
    recommendation: "This could be a great fit or a stretch—it depends on factors we'd need to discuss. I'd suggest a technical conversation to explore the specific challenges you're facing.",
  };
};

const JDAnalyzer = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const result = mockAnalyze(jobDescription);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const loadExample = (type: "strong" | "weak") => {
    setJobDescription(type === "strong" ? strongFitJD : weakFitJD);
    setAnalysis(null);
  };

  const getVerdictStyles = (verdict: Verdict) => {
    switch (verdict) {
      case "strong":
        return "bg-primary/20 text-primary border-primary/30";
      case "weak":
        return "bg-secondary/20 text-secondary border-secondary/30";
      case "conversation":
        return "bg-muted text-foreground border-border";
      default:
        return "";
    }
  };

  return (
    <section id="fit-check" className="py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Honest Fit Assessment
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Paste a job description. Get an honest assessment of whether I'm the right person—including when I'm not.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass rounded-xl p-6 mb-8"
        >
          {/* Example Toggles */}
          <div className="flex gap-3 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadExample("strong")}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              Strong Fit Example
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadExample("weak")}
              className="border-secondary/30 text-secondary hover:bg-secondary/10"
            >
              Weak Fit Example
            </Button>
          </div>

          {/* Textarea */}
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description here..."
            className="min-h-[200px] bg-background/50 border-border/50 resize-none mb-4"
          />

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={!jobDescription.trim() || isAnalyzing}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Analyze Fit
              </>
            )}
          </Button>
        </motion.div>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass rounded-xl p-6 space-y-6"
            >
              {/* Verdict Badge */}
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${getVerdictStyles(
                    analysis.verdict
                  )}`}
                >
                  {analysis.verdict === "strong" && <CheckCircle className="w-4 h-4" />}
                  {analysis.verdict === "weak" && <AlertTriangle className="w-4 h-4" />}
                  {analysis.verdict === "conversation" && <MessageSquare className="w-4 h-4" />}
                  {analysis.verdictLabel}
                </span>
              </div>

              {/* Opening Paragraph */}
              <p className="text-foreground text-lg leading-relaxed">
                {analysis.openingParagraph}
              </p>

              {/* Gaps Section */}
              <div>
                <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
                  Where I Don't Fit
                </h3>
                <ul className="space-y-2">
                  {analysis.gaps.map((gap, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-secondary mt-0.5">✗</span>
                      {gap}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Transfers Section */}
              <div>
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                  What Transfers
                </h3>
                <ul className="space-y-2">
                  {analysis.transfers.map((transfer, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary mt-0.5">✓</span>
                      {transfer}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendation */}
              <div className="pt-4 border-t border-border/50">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                  My Recommendation
                </h3>
                <p className="text-muted-foreground">{analysis.recommendation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Philosophy Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 p-6 rounded-xl bg-muted/30 border border-border/50"
        >
          <p className="text-sm text-muted-foreground italic text-center">
            "This signals something completely different than 'please consider my resume.' 
            You're qualifying them. Your time is valuable too."
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default JDAnalyzer;
