import { Profile } from "@/hooks/useAdminData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ResumeUpload from "./ResumeUpload";

interface ProfileTabProps {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
}

const companyStages = ["Seed", "Series A", "Series B", "Series C", "Series D", "Public"];

const ProfileTab = ({ profile, setProfile }: ProfileTabProps) => {
  const [newTargetTitle, setNewTargetTitle] = useState("");

  const updateProfile = (field: keyof Profile, value: unknown) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const addTargetTitle = () => {
    if (newTargetTitle.trim()) {
      updateProfile("target_titles", [...(profile.target_titles || []), newTargetTitle.trim()]);
      setNewTargetTitle("");
    }
  };

  const removeTargetTitle = (index: number) => {
    const newTitles = [...(profile.target_titles || [])];
    newTitles.splice(index, 1);
    updateProfile("target_titles", newTitles);
  };

  const toggleCompanyStage = (stage: string) => {
    const current = profile.target_company_stages || [];
    if (current.includes(stage)) {
      updateProfile("target_company_stages", current.filter((s) => s !== stage));
    } else {
      updateProfile("target_company_stages", [...current, stage]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Resume Upload Section */}
      <ResumeUpload
        resumeUrl={profile.resume_url}
        onResumeChange={(url) => updateProfile("resume_url", url)}
      />

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Your name, title, and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => updateProfile("name", e.target.value)}
                placeholder="Nick Branch"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email || ""}
                onChange={(e) => updateProfile("email", e.target.value)}
                placeholder="nick@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Current Title</Label>
            <Input
              id="title"
              value={profile.title || ""}
              onChange={(e) => updateProfile("title", e.target.value)}
              placeholder="Principal Software Engineer"
            />
          </div>

          <div className="space-y-2">
            <Label>Target Titles</Label>
            <div className="flex gap-2">
              <Input
                value={newTargetTitle}
                onChange={(e) => setNewTargetTitle(e.target.value)}
                placeholder="Add a target title"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTargetTitle())}
              />
              <Button type="button" onClick={addTargetTitle} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(profile.target_titles || []).map((title, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {title}
                  <button onClick={() => removeTargetTitle(index)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Target Company Stages</Label>
            <div className="flex flex-wrap gap-3">
              {companyStages.map((stage) => (
                <div key={stage} className="flex items-center gap-2">
                  <Checkbox
                    id={`stage-${stage}`}
                    checked={(profile.target_company_stages || []).includes(stage)}
                    onCheckedChange={() => toggleCompanyStage(stage)}
                  />
                  <Label htmlFor={`stage-${stage}`} className="cursor-pointer text-sm">
                    {stage}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Your Story</CardTitle>
          <CardDescription>Help the AI represent you authentically</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="elevator">Elevator Pitch (2-3 sentences)</Label>
            <Textarea
              id="elevator"
              value={profile.elevator_pitch || ""}
              onChange={(e) => updateProfile("elevator_pitch", e.target.value)}
              placeholder="A quick summary of who you are and what you do best..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="narrative">Career Narrative</Label>
            <Textarea
              id="narrative"
              value={profile.career_narrative || ""}
              onChange={(e) => updateProfile("career_narrative", e.target.value)}
              placeholder="Your career story - the thread that connects your experiences..."
              rows={6}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="looking">What You're Looking For</Label>
              <Textarea
                id="looking"
                value={profile.looking_for || ""}
                onChange={(e) => updateProfile("looking_for", e.target.value)}
                placeholder="The type of role, company, or challenge you want..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="not-looking">What You're NOT Looking For</Label>
              <Textarea
                id="not-looking"
                value={profile.not_looking_for || ""}
                onChange={(e) => updateProfile("not_looking_for", e.target.value)}
                placeholder="Things that would be dealbreakers or bad fits..."
                rows={4}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="management">Management Style (if applicable)</Label>
              <Textarea
                id="management"
                value={profile.management_style || ""}
                onChange={(e) => updateProfile("management_style", e.target.value)}
                placeholder="How you lead teams, make decisions..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="work-style">Work Style Preferences</Label>
              <Textarea
                id="work-style"
                value={profile.work_style || ""}
                onChange={(e) => updateProfile("work_style", e.target.value)}
                placeholder="How you like to work, communicate, collaborate..."
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Availability & Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary-min">Salary Min ($)</Label>
              <Input
                id="salary-min"
                type="number"
                value={profile.salary_min || ""}
                onChange={(e) => updateProfile("salary_min", e.target.value ? parseInt(e.target.value) : null)}
                placeholder="150000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary-max">Salary Max ($)</Label>
              <Input
                id="salary-max"
                type="number"
                value={profile.salary_max || ""}
                onChange={(e) => updateProfile("salary_max", e.target.value ? parseInt(e.target.value) : null)}
                placeholder="250000"
              />
            </div>
            <div className="space-y-2">
              <Label>Availability Status</Label>
              <Select
                value={profile.availability_status || ""}
                onValueChange={(value) => updateProfile("availability_status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actively looking">Actively looking</SelectItem>
                  <SelectItem value="Open to opportunities">Open to opportunities</SelectItem>
                  <SelectItem value="Not looking">Not looking</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Available Starting</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !profile.availability_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {profile.availability_date
                      ? format(new Date(profile.availability_date), "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={profile.availability_date ? new Date(profile.availability_date) : undefined}
                    onSelect={(date) => updateProfile("availability_date", date?.toISOString().split("T")[0] || null)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location || ""}
                onChange={(e) => updateProfile("location", e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
            <div className="space-y-2">
              <Label>Remote Preference</Label>
              <Select
                value={profile.remote_preference || ""}
                onValueChange={(value) => updateProfile("remote_preference", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Remote only">Remote only</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="On-site">On-site</SelectItem>
                  <SelectItem value="Flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                value={profile.linkedin_url || ""}
                onChange={(e) => updateProfile("linkedin_url", e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub URL</Label>
              <Input
                id="github"
                value={profile.github_url || ""}
                onChange={(e) => updateProfile("github_url", e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter URL</Label>
              <Input
                id="twitter"
                value={profile.twitter_url || ""}
                onChange={(e) => updateProfile("twitter_url", e.target.value)}
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
