import { Experience } from "@/hooks/useAdminData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus, Trash2, ChevronDown, GripVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { MonthYearPicker } from "@/components/ui/month-year-picker";

interface ExperienceTabProps {
  experiences: Experience[];
  setExperiences: React.Dispatch<React.SetStateAction<Experience[]>>;
}

const createNewExperience = (order: number): Experience => ({
  company_name: "",
  title: "",
  title_progression: null,
  start_date: null,
  end_date: null,
  is_current: false,
  bullet_points: [],
  why_joined: null,
  why_left: null,
  actual_contributions: null,
  proudest_achievement: null,
  would_do_differently: null,
  challenges_faced: null,
  lessons_learned: null,
  manager_would_say: null,
  reports_would_say: null,
  quantified_impact: {},
  display_order: order,
});

const ExperienceTab = ({ experiences, setExperiences }: ExperienceTabProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [newBullet, setNewBullet] = useState<{ [key: number]: string }>({});

  const addExperience = () => {
    setExperiences((prev) => [...prev, createNewExperience(prev.length)]);
    setExpandedIndex(experiences.length);
  };

  const removeExperience = (index: number) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof Experience, value: unknown) => {
    setExperiences((prev) =>
      prev.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp))
    );
  };

  const addBulletPoint = (index: number) => {
    const bullet = newBullet[index]?.trim();
    if (bullet) {
      const current = experiences[index].bullet_points || [];
      updateExperience(index, "bullet_points", [...current, bullet]);
      setNewBullet((prev) => ({ ...prev, [index]: "" }));
    }
  };

  const removeBulletPoint = (expIndex: number, bulletIndex: number) => {
    const current = [...(experiences[expIndex].bullet_points || [])];
    current.splice(bulletIndex, 1);
    updateExperience(expIndex, "bullet_points", current);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Work Experience</h3>
          <p className="text-sm text-muted-foreground">
            Add your work history with detailed AI context for honest representation
          </p>
        </div>
        <Button onClick={addExperience}>
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {experiences.length === 0 ? (
        <Card className="glass border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No experiences added yet</p>
            <Button onClick={addExperience}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Experience
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <Card key={exp.id || index} className="glass border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                    <CardTitle className="text-lg">
                      {exp.company_name || "New Experience"}{" "}
                      {exp.title && <span className="text-muted-foreground font-normal">— {exp.title}</span>}
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeExperience(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Public Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Name *</Label>
                    <Input
                      value={exp.company_name}
                      onChange={(e) => updateExperience(index, "company_name", e.target.value)}
                      placeholder="Company Inc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      value={exp.title}
                      onChange={(e) => updateExperience(index, "title", e.target.value)}
                      placeholder="Software Engineer"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Title Progression (optional)</Label>
                  <Input
                    value={exp.title_progression || ""}
                    onChange={(e) => updateExperience(index, "title_progression", e.target.value)}
                    placeholder="e.g., Senior → Staff Engineer"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <MonthYearPicker
                      value={exp.start_date ? { month: new Date(exp.start_date).getMonth(), year: new Date(exp.start_date).getFullYear() } : undefined}
                      onChange={(val) => updateExperience(index, "start_date", `${val.year}-${String(val.month + 1).padStart(2, '0')}-01`)}
                      placeholder="e.g. Jan 2020"
                      minYear={1970}
                      maxYear={new Date().getFullYear() + 5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <MonthYearPicker
                      value={exp.end_date ? { month: new Date(exp.end_date).getMonth(), year: new Date(exp.end_date).getFullYear() } : undefined}
                      onChange={(val) => updateExperience(index, "end_date", `${val.year}-${String(val.month + 1).padStart(2, '0')}-01`)}
                      disabled={exp.is_current}
                      placeholder="e.g. Dec 2023"
                      minYear={1970}
                      maxYear={new Date().getFullYear() + 5}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox
                      id={`current-${index}`}
                      checked={exp.is_current}
                      onCheckedChange={(checked) => {
                        updateExperience(index, "is_current", checked);
                        if (checked) updateExperience(index, "end_date", null);
                      }}
                    />
                    <Label htmlFor={`current-${index}`} className="cursor-pointer">
                      Current position
                    </Label>
                  </div>
                </div>

                {/* Bullet Points */}
                <div className="space-y-2">
                  <Label>Achievement Bullets</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newBullet[index] || ""}
                      onChange={(e) => setNewBullet((prev) => ({ ...prev, [index]: e.target.value }))}
                      placeholder="Add an achievement..."
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBulletPoint(index))}
                    />
                    <Button type="button" onClick={() => addBulletPoint(index)} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <ul className="space-y-2 mt-2">
                    {(exp.bullet_points || []).map((bullet, bulletIndex) => (
                      <li
                        key={bulletIndex}
                        className="flex items-start gap-2 bg-muted/50 p-2 rounded-md text-sm"
                      >
                        <span className="flex-1">• {bullet}</span>
                        <button
                          onClick={() => removeBulletPoint(index, bulletIndex)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Private AI Context - Collapsible */}
                <Collapsible
                  open={expandedIndex === index}
                  onOpenChange={(open) => setExpandedIndex(open ? index : null)}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span>Private AI Context Fields</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          expandedIndex === index && "rotate-180"
                        )}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-4">
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                      These fields are only used by the AI to give honest answers. They won't appear on your public profile.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Why did you join this company?</Label>
                        <Textarea
                          value={exp.why_joined || ""}
                          onChange={(e) => updateExperience(index, "why_joined", e.target.value)}
                          placeholder="What attracted you to this role?"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Why did you leave? (be honest)</Label>
                        <Textarea
                          value={exp.why_left || ""}
                          onChange={(e) => updateExperience(index, "why_left", e.target.value)}
                          placeholder="The real reason, not the polished version"
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>What did YOU actually do vs. the team?</Label>
                      <Textarea
                        value={exp.actual_contributions || ""}
                        onChange={(e) => updateExperience(index, "actual_contributions", e.target.value)}
                        placeholder="Be specific about your individual contributions"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>What are you proudest of?</Label>
                        <Textarea
                          value={exp.proudest_achievement || ""}
                          onChange={(e) => updateExperience(index, "proudest_achievement", e.target.value)}
                          placeholder="Your biggest win here"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>What would you do differently?</Label>
                        <Textarea
                          value={exp.would_do_differently || ""}
                          onChange={(e) => updateExperience(index, "would_do_differently", e.target.value)}
                          placeholder="With hindsight, what would you change?"
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>What was hard or frustrating?</Label>
                        <Textarea
                          value={exp.challenges_faced || ""}
                          onChange={(e) => updateExperience(index, "challenges_faced", e.target.value)}
                          placeholder="Challenges, conflicts, or frustrations"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Lessons learned</Label>
                        <Textarea
                          value={exp.lessons_learned || ""}
                          onChange={(e) => updateExperience(index, "lessons_learned", e.target.value)}
                          placeholder="What did this experience teach you?"
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>How would your manager describe you?</Label>
                        <Textarea
                          value={exp.manager_would_say || ""}
                          onChange={(e) => updateExperience(index, "manager_would_say", e.target.value)}
                          placeholder="Be honest - strengths and areas for growth"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>How would your reports describe you? (if applicable)</Label>
                        <Textarea
                          value={exp.reports_would_say || ""}
                          onChange={(e) => updateExperience(index, "reports_would_say", e.target.value)}
                          placeholder="What would people who reported to you say?"
                          rows={3}
                        />
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceTab;
