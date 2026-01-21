import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Public view types (exposed to anonymous users)
export interface CandidateProfilePublic {
  id: string;
  name: string | null;
  email: string | null;
  title: string | null;
  elevator_pitch: string | null;
  career_narrative: string | null;
  looking_for: string | null;
  location: string | null;
  remote_preference: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  twitter_url: string | null;
  availability_status: string | null;
  target_titles: string[] | null;
  target_company_stages: string[] | null;
  resume_url: string | null;
}

export interface ExperiencePublic {
  id: string;
  candidate_id: string;
  company_name: string;
  title: string;
  title_progression: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean | null;
  bullet_points: string[] | null;
  display_order: number | null;
}

export interface SkillPublic {
  id: string;
  candidate_id: string;
  skill_name: string;
  category: 'strong' | 'moderate' | 'gap';
  self_rating: number | null;
  years_experience: number | null;
}

export const usePublicProfile = () => {
  return useQuery({
    queryKey: ['public-profile'],
    queryFn: async (): Promise<CandidateProfilePublic | null> => {
      // Try public view first, fall back to main table
      const { data: viewData, error: viewError } = await supabase
        .from('candidate_profile_public')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (!viewError && viewData) {
        return viewData as CandidateProfilePublic;
      }

      // Fallback to main table (for when views aren't created yet)
      const { data, error } = await supabase
        .from('candidate_profile')
        .select('id, name, email, title, elevator_pitch, career_narrative, looking_for, location, remote_preference, linkedin_url, github_url, twitter_url, availability_status, target_titles, target_company_stages, resume_url')
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching public profile:', error);
        return null;
      }
      return data as CandidateProfilePublic | null;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

// Combined hook for convenience
export const usePublicData = () => {
  const { data: profile, isLoading: profileLoading } = usePublicProfile();
  const { data: experiences, isLoading: experiencesLoading } = usePublicExperiences();
  const { data: grouped, isLoading: skillsLoading } = useGroupedPublicSkills();

  return {
    profile,
    experiences,
    skills: grouped,
    loading: profileLoading || experiencesLoading || skillsLoading,
  };
};

export const usePublicExperiences = () => {
  return useQuery({
    queryKey: ['public-experiences'],
    queryFn: async (): Promise<ExperiencePublic[]> => {
      const { data, error } = await supabase
        .from('experiences_public')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching public experiences:', error);
        return [];
      }
      return (data as ExperiencePublic[]) || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const usePublicSkills = () => {
  return useQuery({
    queryKey: ['public-skills'],
    queryFn: async (): Promise<SkillPublic[]> => {
      const { data, error } = await supabase
        .from('skills_public')
        .select('*');
      
      if (error) {
        console.error('Error fetching public skills:', error);
        return [];
      }
      return (data as SkillPublic[]) || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Helper to group skills by category
export const useGroupedPublicSkills = () => {
  const { data: skills, ...rest } = usePublicSkills();
  
  const grouped = {
    strong: skills?.filter(s => s.category === 'strong') || [],
    moderate: skills?.filter(s => s.category === 'moderate') || [],
    gap: skills?.filter(s => s.category === 'gap') || [],
  };
  
  return { data: grouped, skills, ...rest };
};
