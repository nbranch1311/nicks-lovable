import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminData } from "@/hooks/useAdminData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Save, ExternalLink, LogOut, User, Briefcase, Zap, AlertTriangle, Heart, HelpCircle, Bot } from "lucide-react";
import { motion } from "framer-motion";
import ProfileTab from "@/components/admin/ProfileTab";
import ExperienceTab from "@/components/admin/ExperienceTab";
import SkillsTab from "@/components/admin/SkillsTab";
import GapsTab from "@/components/admin/GapsTab";
import ValuesTab from "@/components/admin/ValuesTab";
import FAQTab from "@/components/admin/FAQTab";
import AIInstructionsTab from "@/components/admin/AIInstructionsTab";

const Admin = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  
  const {
    loading,
    saving,
    profile,
    setProfile,
    experiences,
    setExperiences,
    skills,
    setSkills,
    gaps,
    setGaps,
    valuesCulture,
    setValuesCulture,
    faqs,
    setFaqs,
    aiInstructions,
    setAiInstructions,
    saveAllData,
  } = useAdminData();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your data...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Zap },
    { id: "gaps", label: "Gaps", icon: AlertTriangle },
    { id: "values", label: "Values", icon: Heart },
    { id: "faq", label: "FAQ", icon: HelpCircle },
    { id: "ai", label: "AI", icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 glass-strong border-b border-border/50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-serif font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Manage your portfolio content</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => window.open("/", "_blank")}>
              <ExternalLink className="w-4 h-4 mr-2" />
              View Site
            </Button>
            <Button onClick={saveAllData} disabled={saving} className="glow-primary">
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save All Changes
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 flex-1 min-w-[100px]"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <ProfileTab profile={profile} setProfile={setProfile} />
          </TabsContent>

          <TabsContent value="experience" className="mt-6">
            <ExperienceTab experiences={experiences} setExperiences={setExperiences} />
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <SkillsTab skills={skills} setSkills={setSkills} />
          </TabsContent>

          <TabsContent value="gaps" className="mt-6">
            <GapsTab gaps={gaps} setGaps={setGaps} />
          </TabsContent>

          <TabsContent value="values" className="mt-6">
            <ValuesTab valuesCulture={valuesCulture} setValuesCulture={setValuesCulture} />
          </TabsContent>

          <TabsContent value="faq" className="mt-6">
            <FAQTab faqs={faqs} setFaqs={setFaqs} />
          </TabsContent>

          <TabsContent value="ai" className="mt-6">
            <AIInstructionsTab aiInstructions={aiInstructions} setAiInstructions={setAiInstructions} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
