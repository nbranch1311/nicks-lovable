import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Profile {
  id?: string;
  name: string;
  email: string | null;
  title: string | null;
  target_titles: string[];
  target_company_stages: string[];
  elevator_pitch: string | null;
  career_narrative: string | null;
  looking_for: string | null;
  not_looking_for: string | null;
  management_style: string | null;
  work_style: string | null;
  salary_min: number | null;
  salary_max: number | null;
  availability_status: string | null;
  availability_date: string | null;
  location: string | null;
  remote_preference: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  twitter_url: string | null;
}

export interface Experience {
  id?: string;
  candidate_id?: string;
  company_name: string;
  title: string;
  title_progression: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  bullet_points: string[];
  why_joined: string | null;
  why_left: string | null;
  actual_contributions: string | null;
  proudest_achievement: string | null;
  would_do_differently: string | null;
  challenges_faced: string | null;
  lessons_learned: string | null;
  manager_would_say: string | null;
  reports_would_say: string | null;
  quantified_impact: Record<string, unknown>;
  display_order: number;
}

export interface Skill {
  id?: string;
  candidate_id?: string;
  skill_name: string;
  category: "strong" | "moderate" | "gap";
  self_rating: number | null;
  evidence: string | null;
  honest_notes: string | null;
  years_experience: number | null;
  last_used: string | null;
}

export interface Gap {
  id?: string;
  candidate_id?: string;
  gap_type: "skill" | "experience" | "environment" | "role_type";
  description: string;
  why_its_a_gap: string | null;
  interest_in_learning: boolean;
}

export interface ValuesCulture {
  id?: string;
  candidate_id?: string;
  must_haves: string | null;
  dealbreakers: string | null;
  management_style_preferences: string | null;
  team_size_preferences: string | null;
  how_handle_conflict: string | null;
  how_handle_ambiguity: string | null;
  how_handle_failure: string | null;
}

export interface FAQ {
  id?: string;
  candidate_id?: string;
  question: string;
  answer: string;
  is_common_question: boolean;
}

export interface AIInstruction {
  id?: string;
  candidate_id?: string;
  instruction_type: "honesty" | "tone" | "boundaries";
  instruction: string;
  priority: number;
}

const defaultProfile: Profile = {
  name: "",
  email: null,
  title: null,
  target_titles: [],
  target_company_stages: [],
  elevator_pitch: null,
  career_narrative: null,
  looking_for: null,
  not_looking_for: null,
  management_style: null,
  work_style: null,
  salary_min: null,
  salary_max: null,
  availability_status: null,
  availability_date: null,
  location: null,
  remote_preference: null,
  linkedin_url: null,
  github_url: null,
  twitter_url: null,
};

const defaultValuesCulture: ValuesCulture = {
  must_haves: null,
  dealbreakers: null,
  management_style_preferences: null,
  team_size_preferences: null,
  how_handle_conflict: null,
  how_handle_ambiguity: null,
  how_handle_failure: null,
};

export const useAdminData = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [valuesCulture, setValuesCulture] = useState<ValuesCulture>(defaultValuesCulture);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [aiInstructions, setAiInstructions] = useState<AIInstruction[]>([]);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [
        profileRes,
        experiencesRes,
        skillsRes,
        gapsRes,
        valuesRes,
        faqsRes,
        instructionsRes,
      ] = await Promise.all([
        supabase.from("candidate_profile").select("*").single(),
        supabase.from("experiences").select("*").order("display_order"),
        supabase.from("skills").select("*"),
        supabase.from("gaps_weaknesses").select("*"),
        supabase.from("values_culture").select("*").single(),
        supabase.from("faq_responses").select("*"),
        supabase.from("ai_instructions").select("*").order("priority"),
      ]);

      if (profileRes.data) setProfile(profileRes.data as Profile);
      if (experiencesRes.data) setExperiences(experiencesRes.data as Experience[]);
      if (skillsRes.data) setSkills(skillsRes.data as Skill[]);
      if (gapsRes.data) setGaps(gapsRes.data as Gap[]);
      if (valuesRes.data) setValuesCulture(valuesRes.data as ValuesCulture);
      if (faqsRes.data) setFaqs(faqsRes.data as FAQ[]);
      if (instructionsRes.data) setAiInstructions(instructionsRes.data as AIInstruction[]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error loading data",
        description: "Failed to load your portfolio data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveAllData = async () => {
    try {
      setSaving(true);

      // Save profile
      if (profile.id) {
        await supabase.from("candidate_profile").update(profile).eq("id", profile.id);
      } else {
        const { data } = await supabase.from("candidate_profile").insert(profile).select().single();
        if (data) setProfile(data as Profile);
      }

      const candidateId = profile.id;
      if (!candidateId) {
        throw new Error("No candidate profile found");
      }

      // Save experiences - delete removed, update existing, insert new
      const existingExpIds = experiences.filter(e => e.id).map(e => e.id);
      await supabase.from("experiences").delete().eq("candidate_id", candidateId).not("id", "in", `(${existingExpIds.join(",")})`);
      
      for (const exp of experiences) {
        if (exp.id) {
          await supabase.from("experiences").update({ ...exp, candidate_id: candidateId }).eq("id", exp.id);
        } else {
          await supabase.from("experiences").insert({ ...exp, candidate_id: candidateId });
        }
      }

      // Save skills
      const existingSkillIds = skills.filter(s => s.id).map(s => s.id);
      if (existingSkillIds.length > 0) {
        await supabase.from("skills").delete().eq("candidate_id", candidateId).not("id", "in", `(${existingSkillIds.join(",")})`);
      } else {
        await supabase.from("skills").delete().eq("candidate_id", candidateId);
      }
      
      for (const skill of skills) {
        if (skill.id) {
          await supabase.from("skills").update({ ...skill, candidate_id: candidateId }).eq("id", skill.id);
        } else {
          await supabase.from("skills").insert({ ...skill, candidate_id: candidateId });
        }
      }

      // Save gaps
      const existingGapIds = gaps.filter(g => g.id).map(g => g.id);
      if (existingGapIds.length > 0) {
        await supabase.from("gaps_weaknesses").delete().eq("candidate_id", candidateId).not("id", "in", `(${existingGapIds.join(",")})`);
      } else {
        await supabase.from("gaps_weaknesses").delete().eq("candidate_id", candidateId);
      }
      
      for (const gap of gaps) {
        if (gap.id) {
          await supabase.from("gaps_weaknesses").update({ ...gap, candidate_id: candidateId }).eq("id", gap.id);
        } else {
          await supabase.from("gaps_weaknesses").insert({ ...gap, candidate_id: candidateId });
        }
      }

      // Save values/culture
      if (valuesCulture.id) {
        await supabase.from("values_culture").update({ ...valuesCulture, candidate_id: candidateId }).eq("id", valuesCulture.id);
      } else {
        await supabase.from("values_culture").insert({ ...valuesCulture, candidate_id: candidateId });
      }

      // Save FAQs
      const existingFaqIds = faqs.filter(f => f.id).map(f => f.id);
      if (existingFaqIds.length > 0) {
        await supabase.from("faq_responses").delete().eq("candidate_id", candidateId).not("id", "in", `(${existingFaqIds.join(",")})`);
      } else {
        await supabase.from("faq_responses").delete().eq("candidate_id", candidateId);
      }
      
      for (const faq of faqs) {
        if (faq.id) {
          await supabase.from("faq_responses").update({ ...faq, candidate_id: candidateId }).eq("id", faq.id);
        } else {
          await supabase.from("faq_responses").insert({ ...faq, candidate_id: candidateId });
        }
      }

      // Save AI instructions
      const existingInstrIds = aiInstructions.filter(i => i.id).map(i => i.id);
      if (existingInstrIds.length > 0) {
        await supabase.from("ai_instructions").delete().eq("candidate_id", candidateId).not("id", "in", `(${existingInstrIds.join(",")})`);
      } else {
        await supabase.from("ai_instructions").delete().eq("candidate_id", candidateId);
      }
      
      for (const instr of aiInstructions) {
        if (instr.id) {
          await supabase.from("ai_instructions").update({ ...instr, candidate_id: candidateId }).eq("id", instr.id);
        } else {
          await supabase.from("ai_instructions").insert({ ...instr, candidate_id: candidateId });
        }
      }

      toast({
        title: "Saved successfully!",
        description: "All your changes have been saved.",
      });

      // Refresh data to get IDs
      await fetchData();
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        title: "Error saving",
        description: "Failed to save your changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
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
    fetchData,
  };
};
