import { ValuesCulture } from "@/hooks/useAdminData";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ValuesTabProps {
  valuesCulture: ValuesCulture;
  setValuesCulture: React.Dispatch<React.SetStateAction<ValuesCulture>>;
}

const ValuesTab = ({ valuesCulture, setValuesCulture }: ValuesTabProps) => {
  const updateValues = (field: keyof ValuesCulture, value: string) => {
    setValuesCulture((prev) => ({ ...prev, [field]: value || null }));
  };

  return (
    <div className="space-y-6">
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Company Preferences</CardTitle>
          <CardDescription>
            What you need in a company culture and what would make you run the other way
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="must-haves">Must-Haves in a Company</Label>
            <Textarea
              id="must-haves"
              value={valuesCulture.must_haves || ""}
              onChange={(e) => updateValues("must_haves", e.target.value)}
              placeholder="What's non-negotiable for you? e.g., Remote-first, engineering-led culture, strong mentorship..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dealbreakers">Dealbreakers</Label>
            <Textarea
              id="dealbreakers"
              value={valuesCulture.dealbreakers || ""}
              onChange={(e) => updateValues("dealbreakers", e.target.value)}
              placeholder="What would make you immediately uninterested? e.g., Open office plans, micromanagement, unclear product strategy..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Work Environment</CardTitle>
          <CardDescription>
            Your preferences for how you work with others
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="manager-prefs">Management Style Preferences</Label>
            <Textarea
              id="manager-prefs"
              value={valuesCulture.management_style_preferences || ""}
              onChange={(e) => updateValues("management_style_preferences", e.target.value)}
              placeholder="What do you want from a manager? e.g., Hands-off but available, regular 1:1s, clear feedback..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team-size">Team Size Preferences</Label>
            <Input
              id="team-size"
              value={valuesCulture.team_size_preferences || ""}
              onChange={(e) => updateValues("team_size_preferences", e.target.value)}
              placeholder="e.g., Small teams (3-5 people), medium-sized org (50-200)"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>How You Handle Challenges</CardTitle>
          <CardDescription>
            Be honest—this helps the AI answer behavioral questions accurately
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="conflict">How do you handle conflict?</Label>
            <Textarea
              id="conflict"
              value={valuesCulture.how_handle_conflict || ""}
              onChange={(e) => updateValues("how_handle_conflict", e.target.value)}
              placeholder="Be specific about your approach. e.g., I prefer direct conversations early rather than letting things fester..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ambiguity">How do you handle ambiguity?</Label>
            <Textarea
              id="ambiguity"
              value={valuesCulture.how_handle_ambiguity || ""}
              onChange={(e) => updateValues("how_handle_ambiguity", e.target.value)}
              placeholder="Do you thrive in it or prefer clarity? e.g., I need some structure but can navigate unclear situations..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="failure">How do you handle failure?</Label>
            <Textarea
              id="failure"
              value={valuesCulture.how_handle_failure || ""}
              onChange={(e) => updateValues("how_handle_failure", e.target.value)}
              placeholder="What's your honest reaction to failure? e.g., I take it hard initially but focus on learning..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValuesTab;
