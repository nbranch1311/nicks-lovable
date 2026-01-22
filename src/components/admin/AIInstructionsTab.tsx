import { AIInstruction } from "@/hooks/useAdminData";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2, Bot, Lightbulb } from "lucide-react";
import { useState } from "react";

interface AIInstructionsTabProps {
  aiInstructions: AIInstruction[];
  setAiInstructions: React.Dispatch<React.SetStateAction<AIInstruction[]>>;
}

const createNewInstruction = (priority: number): AIInstruction => ({
  instruction_type: "honesty",
  instruction: "",
  priority,
});

const exampleInstructions = [
  { type: "honesty", text: "Never oversell me" },
  { type: "honesty", text: "If they need X and I don't have it, say so directly" },
  { type: "honesty", text: "Use 'I'm probably not your person' when appropriate" },
  { type: "tone", text: "Don't hedge—be direct" },
  { type: "tone", text: "Be warm but not salesy" },
  { type: "boundaries", text: "It's okay to recommend they not hire me" },
  { type: "boundaries", text: "Don't discuss salary specifics, just say I'm open to discussing" },
  { type: "boundaries", text: "Don't share personal contact info directly" },
];

const honestyLabels: { [key: number]: string } = {
  1: "Very diplomatic",
  2: "Diplomatic",
  3: "Balanced",
  4: "Direct",
  5: "Very direct",
  6: "Blunt",
  7: "Very blunt",
  8: "Brutally honest",
  9: "No filter",
  10: "Maximum honesty",
};

const AIInstructionsTab = ({ aiInstructions, setAiInstructions }: AIInstructionsTabProps) => {
  const [honestyLevel, setHonestyLevel] = useState(7);

  const addInstruction = (instruction = "", type: AIInstruction["instruction_type"] = "honesty") => {
    setAiInstructions((prev) => [
      ...prev,
      { ...createNewInstruction(prev.length), instruction, instruction_type: type },
    ]);
  };

  const removeInstruction = (index: number) => {
    setAiInstructions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateInstruction = (index: number, field: keyof AIInstruction, value: unknown) => {
    setAiInstructions((prev) =>
      prev.map((instr, i) => (i === index ? { ...instr, [field]: value } : instr))
    );
  };

  return (
    <div className="space-y-6">
      <Card className="glass bg-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle>Tell the AI How to Behave</CardTitle>
          </div>
          <CardDescription>
            These instructions shape how the AI represents you. Be specific about your communication
            preferences and what the AI should and shouldn't say.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Honesty Level Slider */}
      <Card className="glass border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Honesty Level</CardTitle>
          <CardDescription>
            How direct should the AI be when discussing your limitations?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Diplomatic</span>
            <span className="font-medium text-primary">{honestyLabels[honestyLevel]}</span>
            <span className="text-muted-foreground">Brutally honest</span>
          </div>
          <Slider
            value={[honestyLevel]}
            onValueChange={([value]) => setHonestyLevel(value)}
            min={1}
            max={10}
            step={1}
            className="py-2"
          />
        </CardContent>
      </Card>

      {/* Example Instructions */}
      <Card className="glass border-border/50 bg-muted/30">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-secondary" />
            <CardTitle className="text-sm">Example Instructions</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Click to add these as starting points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {exampleInstructions.map((example, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => addInstruction(example.text, example.type as AIInstruction["instruction_type"])}
                className="text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                {example.text}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Instructions */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Custom Instructions</h3>
          <p className="text-sm text-muted-foreground">
            Add specific rules for how the AI should behave
          </p>
        </div>
        <Button onClick={() => addInstruction()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Instruction
        </Button>
      </div>

      {aiInstructions.length === 0 ? (
        <Card className="glass border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No custom instructions yet</p>
            <Button onClick={() => addInstruction()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Instruction
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {aiInstructions.map((instr, index) => (
            <Card key={instr.id || index} className="glass border-border/50">
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={instr.instruction_type}
                          onValueChange={(value) =>
                            updateInstruction(index, "instruction_type", value as AIInstruction["instruction_type"])
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="honesty">Honesty</SelectItem>
                            <SelectItem value="tone">Tone</SelectItem>
                            <SelectItem value="boundaries">Boundaries</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        <Label>Instruction</Label>
                        <Textarea
                          value={instr.instruction}
                          onChange={(e) => updateInstruction(index, "instruction", e.target.value)}
                          placeholder="e.g., Never claim expertise in areas where I've marked gaps"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive mt-6"
                    onClick={() => removeInstruction(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIInstructionsTab;
