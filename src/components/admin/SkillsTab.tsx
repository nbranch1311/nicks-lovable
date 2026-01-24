import { Skill } from "@/hooks/useAdminData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { MonthYearPicker } from "@/components/admin/MonthYearPicker";
import type { MonthYearValue } from "@/components/admin/MonthYearPickerTypes";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillsTabProps {
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
}

const createNewSkill = (): Skill => ({
  skill_name: "",
  category: "moderate",
  self_rating: 3,
  evidence: null,
  honest_notes: null,
  years_experience: null,
  last_used: null,
});

const SkillsTab = ({ skills, setSkills }: SkillsTabProps) => {
  const addSkill = () => {
    setSkills((prev) => [...prev, createNewSkill()]);
  };

  const removeSkill = (index: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSkill = (index: number, field: keyof Skill, value: unknown) => {
    setSkills((prev) =>
      prev.map((skill, i) => (i === index ? { ...skill, [field]: value } : skill))
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "strong":
        return "border-l-primary";
      case "moderate":
        return "border-l-secondary";
      case "gap":
        return "border-l-destructive";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Skills Matrix</h3>
          <p className="text-sm text-muted-foreground">
            Be honest about your skill levels - the AI uses this to give accurate answers
          </p>
        </div>
        <Button onClick={addSkill}>
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {skills.length === 0 ? (
        <Card className="glass border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No skills added yet</p>
            <Button onClick={addSkill}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Skill
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill, index) => (
            <Card
              key={skill.id || index}
              className={cn("glass border-border/50 border-l-4", getCategoryColor(skill.category))}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{skill.skill_name || "New Skill"}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive h-8 w-8"
                    onClick={() => removeSkill(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Skill Name *</Label>
                    <Input
                      value={skill.skill_name}
                      onChange={(e) => updateSkill(index, "skill_name", e.target.value)}
                      placeholder="e.g., React"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={skill.category}
                      onValueChange={(value) => updateSkill(index, "category", value as Skill["category"])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strong">Strong</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="gap">Gap</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Self-Rating: {skill.self_rating}/5</Label>
                  <Slider
                    value={[skill.self_rating || 3]}
                    onValueChange={([value]) => updateSkill(index, "self_rating", value)}
                    min={1}
                    max={5}
                    step={1}
                    className="py-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 items-start">
                  <div className="space-y-2">
                    <div className="flex items-center h-5">
                      <Label>Years of Experience</Label>
                    </div>
                    <Input
                      type="number"
                      value={skill.years_experience || ""}
                      onChange={(e) =>
                        updateSkill(index, "years_experience", e.target.value ? parseFloat(e.target.value) : null)
                      }
                      placeholder="e.g., 5"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between h-5">
                      <Label>Last Used</Label>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`current-${index}`}
                          checked={!skill.last_used}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateSkill(index, "last_used", null);
                            }
                          }}
                        />
                        <Label htmlFor={`current-${index}`} className="text-xs font-normal cursor-pointer">
                          Current
                        </Label>
                      </div>
                    </div>
                    {skill.last_used ? (
                      <div className="flex gap-2">
                        <MonthYearPicker
                          value={{
                            month: new Date(skill.last_used).getMonth(),
                            year: new Date(skill.last_used).getFullYear()
                          }}
                          onChange={(val: MonthYearValue) => {
                            const dateStr = `${val.year}-${String(val.month + 1).padStart(2, '0')}-01`;
                            updateSkill(index, "last_used", dateStr);
                          }}
                          placeholder="Select"
                          minYear={1990}
                          maxYear={new Date().getFullYear()}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 shrink-0"
                          onClick={() => updateSkill(index, "last_used", null)}
                          title="Clear date"
                        >
                          ×
                        </Button>
                      </div>
                    ) : (
                      <div className="h-10 flex items-center text-sm text-muted-foreground px-3 border border-input rounded-md bg-muted/50">
                        Currently using
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Evidence (projects, certifications)</Label>
                  <Textarea
                    value={skill.evidence || ""}
                    onChange={(e) => updateSkill(index, "evidence", e.target.value)}
                    placeholder="What proves your proficiency?"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Honest Notes</Label>
                  <Textarea
                    value={skill.honest_notes || ""}
                    onChange={(e) => updateSkill(index, "honest_notes", e.target.value)}
                    placeholder="e.g., 'Haven't used this in 2 years'"
                    rows={2}
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

export default SkillsTab;
