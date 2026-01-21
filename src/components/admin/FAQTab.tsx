import { FAQ } from "@/hooks/useAdminData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Sparkles } from "lucide-react";

interface FAQTabProps {
  faqs: FAQ[];
  setFaqs: React.Dispatch<React.SetStateAction<FAQ[]>>;
}

const commonQuestions = [
  "Tell me about yourself",
  "What's your biggest weakness?",
  "Why are you leaving your current role?",
  "Where do you see yourself in 5 years?",
  "Tell me about a time you failed",
  "What's your greatest strength?",
  "Why do you want to work here?",
  "Describe a challenging project",
  "How do you handle disagreements with colleagues?",
  "What motivates you?",
];

const createNewFaq = (question = ""): FAQ => ({
  question,
  answer: "",
  is_common_question: false,
});

const FAQTab = ({ faqs, setFaqs }: FAQTabProps) => {
  const addFaq = (question = "") => {
    setFaqs((prev) => [...prev, createNewFaq(question)]);
  };

  const removeFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFaq = (index: number, field: keyof FAQ, value: unknown) => {
    setFaqs((prev) =>
      prev.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq))
    );
  };

  const existingQuestions = faqs.map((f) => f.question.toLowerCase());
  const availableCommonQuestions = commonQuestions.filter(
    (q) => !existingQuestions.includes(q.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">FAQ Responses</h3>
          <p className="text-sm text-muted-foreground">
            Pre-write answers to common interview questions
          </p>
        </div>
        <Button onClick={() => addFaq()}>
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      {/* Quick add common questions */}
      {availableCommonQuestions.length > 0 && (
        <Card className="glass border-border/50 bg-muted/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Quick Add Common Questions</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Click to add pre-written answers for these common interview questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {availableCommonQuestions.map((question) => (
                <Button
                  key={question}
                  variant="outline"
                  size="sm"
                  onClick={() => addFaq(question)}
                  className="text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {faqs.length === 0 ? (
        <Card className="glass border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No FAQs added yet</p>
            <Button onClick={() => addFaq()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First FAQ
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={faq.id || index} className="glass border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {faq.question || "New Question"}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive h-8 w-8"
                    onClick={() => removeFaq(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Question *</Label>
                  <Input
                    value={faq.question}
                    onChange={(e) => updateFaq(index, "question", e.target.value)}
                    placeholder="e.g., Tell me about yourself"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Your Answer *</Label>
                  <Textarea
                    value={faq.answer}
                    onChange={(e) => updateFaq(index, "answer", e.target.value)}
                    placeholder="Write your honest, prepared answer..."
                    rows={6}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`common-${index}`}
                    checked={faq.is_common_question}
                    onCheckedChange={(checked) => updateFaq(index, "is_common_question", checked)}
                  />
                  <Label htmlFor={`common-${index}`} className="cursor-pointer text-sm">
                    Mark as common question
                  </Label>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FAQTab;
