import { useState } from "react";
import {
  Search,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Verdict = "strong_fit" | "worth_conversation" | "probably_not" | null;

interface Gap {
  requirement: string;
  gap_title: string;
  explanation: string;
}

interface AnalysisResult {
  verdict: Verdict;
  headline: string;
  opening: string;
  gaps: Gap[];
  transfers: string;
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

const JDAnalyzer = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-jd", {
        body: { jobDescription },
      });

      if (error) {
        console.error("Analysis error:", error);
        toast.error("Failed to analyze job description. Please try again.");
        return;
      }

      if (data.error) {
        console.error("Analysis error:", data.error);
        toast.error(data.error);
        return;
      }

      setAnalysis(data as AnalysisResult);
    } catch (err) {
      console.error("Analysis error:", err);
      toast.error("Failed to analyze job description. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadExample = (type: "strong" | "weak") => {
    setJobDescription(type === "strong" ? strongFitJD : weakFitJD);
    setAnalysis(null);
  };

  const getVerdictStyles = (verdict: Verdict) => {
    switch (verdict) {
      case "strong_fit":
        return "bg-primary/20 text-primary border-primary/30";
      case "probably_not":
        return "bg-secondary/20 text-secondary border-secondary/30";
      case "worth_conversation":
        return "bg-muted text-foreground border-border";
      default:
        return "";
    }
  };

  const getVerdictLabel = (verdict: Verdict) => {
    switch (verdict) {
      case "strong_fit":
        return "Strong Fit";
      case "probably_not":
        return "Probably Not Your Person";
      case "worth_conversation":
        return "Worth a Conversation";
      default:
        return "";
    }
  };

  const getVerdictIcon = (verdict: Verdict) => {
    switch (verdict) {
      case "strong_fit":
        return <CheckCircle className="w-4 h-4" />;
      case "probably_not":
        return <AlertTriangle className="w-4 h-4" />;
      case "worth_conversation":
        return <MessageSquare className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <section id="fit-check" className="py-24 px-6 relative">
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
            Paste a job description. Get an honest assessment of whether I'm the
            right person—including when I'm not.
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
              {/* Verdict Badge & Headline */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${getVerdictStyles(
                      analysis.verdict,
                    )}`}
                  >
                    {getVerdictIcon(analysis.verdict)}
                    {getVerdictLabel(analysis.verdict)}
                  </span>
                </div>
                {analysis.headline && (
                  <h3 className="text-xl font-semibold text-foreground">
                    {analysis.headline}
                  </h3>
                )}
              </div>

              {/* Opening Paragraph */}
              <p className="text-foreground text-lg leading-relaxed">
                {analysis.opening}
              </p>

              {/* Gaps Section */}
              {analysis.gaps && analysis.gaps.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
                    Where I Don't Fit
                  </h3>
                  <ul className="space-y-3">
                    {analysis.gaps.map((gap, index) => (
                      <li key={index} className="text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <span className="text-secondary mt-0.5 shrink-0">
                            ✗
                          </span>
                          <div>
                            <span className="font-medium text-foreground">
                              {gap.gap_title}
                            </span>
                            <span className="text-muted-foreground">
                              {" "}
                              — {gap.requirement}
                            </span>
                            <p className="text-sm mt-1 text-muted-foreground/80">
                              {gap.explanation}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Transfers Section */}
              {analysis.transfers && (
                <div>
                  <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                    What Transfers
                  </h3>
                  <p className="text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5 shrink-0">✓</span>
                    {analysis.transfers}
                  </p>
                </div>
              )}

              {/* Recommendation */}
              <div className="pt-4 border-t border-border/50">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                  My Recommendation
                </h3>
                <p className="text-muted-foreground">
                  {analysis.recommendation}
                </p>
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
            "I want to give companies a valuable experience, not just 'please
            consider my resume.' Your time is valuable, so get real answers,
            built on real data, in real time, about me. - Nicholas Branch."
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default JDAnalyzer;
