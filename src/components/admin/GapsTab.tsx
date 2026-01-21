import { Gap } from "@/hooks/useAdminData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, AlertTriangle } from "lucide-react";

interface GapsTabProps {
  gaps: Gap[];
  setGaps: React.Dispatch<React.SetStateAction<Gap[]>>;
}

const createNewGap = (): Gap => ({
  gap_type: "skill",
  description: "",
  why_its_a_gap: null,
  interest_in_learning: false,
});

const gapTypeLabels: Record<Gap["gap_type"], string> = {
  skill: "Skill Gap",
  experience: "Experience Gap",
  environment: "Environment Mismatch",
  role_type: "Role Type Mismatch",
};

const GapsTab = ({ gaps, setGaps }: GapsTabProps) => {
  const addGap = () => {
    setGaps((prev) => [...prev, createNewGap()]);
  };

  const removeGap = (index: number) => {
    setGaps((prev) => prev.filter((_, i) => i !== index));
  };

  const updateGap = (index: number, field: keyof Gap, value: unknown) => {
    setGaps((prev) =>
      prev.map((gap, i) => (i === index ? { ...gap, [field]: value } : gap))
    );
  };

  return (
    <div className="space-y-4">
      <Card className="glass border-border/50 bg-muted/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-secondary" />
            <CardTitle className="text-lg">Gaps & Weaknesses</CardTitle>
          </div>
          <CardDescription>
            Be honest about your gaps—this is what makes the AI valuable. When you're upfront about
            limitations, the AI can have honest conversations with recruiters and save everyone time.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex justify-end">
        <Button onClick={addGap}>
          <Plus className="w-4 h-4 mr-2" />
          Add Gap
        </Button>
      </div>

      {gaps.length === 0 ? (
        <Card className="glass border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No gaps added yet</p>
            <Button onClick={addGap}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Gap
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {gaps.map((gap, index) => (
            <Card key={gap.id || index} className="glass border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {gapTypeLabels[gap.gap_type]}
                    {gap.description && (
                      <span className="text-muted-foreground font-normal ml-2">
                        — {gap.description.slice(0, 40)}
                        {gap.description.length > 40 && "..."}
                      </span>
                    )}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive h-8 w-8"
                    onClick={() => removeGap(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Gap Type</Label>
                    <Select
                      value={gap.gap_type}
                      onValueChange={(value) => updateGap(index, "gap_type", value as Gap["gap_type"])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="skill">Skill Gap</SelectItem>
                        <SelectItem value="experience">Experience Gap</SelectItem>
                        <SelectItem value="environment">Environment Mismatch</SelectItem>
                        <SelectItem value="role_type">Role Type Mismatch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-3 pt-8">
                    <Switch
                      id={`learning-${index}`}
                      checked={gap.interest_in_learning}
                      onCheckedChange={(checked) => updateGap(index, "interest_in_learning", checked)}
                    />
                    <Label htmlFor={`learning-${index}`} className="cursor-pointer">
                      Interested in learning
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Input
                    value={gap.description}
                    onChange={(e) => updateGap(index, "description", e.target.value)}
                    placeholder="e.g., No experience with Kubernetes"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Why it's a gap (be specific)</Label>
                  <Textarea
                    value={gap.why_its_a_gap || ""}
                    onChange={(e) => updateGap(index, "why_its_a_gap", e.target.value)}
                    placeholder="Why is this a limitation for you? What context helps explain it?"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GapsTab;
