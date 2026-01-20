// Chat edge function for AI-powered portfolio Q&A
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json() as { messages: Message[] };
    
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")?.trim();
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Load all candidate data in parallel
    const [
      profileResult,
      experiencesResult,
      skillsResult,
      gapsResult,
      valuesResult,
      faqResult,
      instructionsResult
    ] = await Promise.all([
      supabase.from("candidate_profile").select("*").single(),
      supabase.from("experiences").select("*").order("display_order", { ascending: true }),
      supabase.from("skills").select("*"),
      supabase.from("gaps_weaknesses").select("*"),
      supabase.from("values_culture").select("*").single(),
      supabase.from("faq_responses").select("*"),
      supabase.from("ai_instructions").select("*").order("priority", { ascending: true })
    ]);

    const profile = profileResult.data;
    const experiences = experiencesResult.data || [];
    const skills = skillsResult.data || [];
    const gaps = gapsResult.data || [];
    const values = valuesResult.data;
    const faqs = faqResult.data || [];
    const instructions = instructionsResult.data || [];

    // Build system prompt
    const systemPrompt = buildSystemPrompt(profile, experiences, skills, gaps, values, faqs, instructions);

    // Call Anthropic API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const result = await response.json();
    const assistantMessage = result.content[0]?.text || "I'm sorry, I couldn't generate a response.";

    return new Response(
      JSON.stringify({ message: assistantMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function buildSystemPrompt(
  profile: any,
  experiences: any[],
  skills: any[],
  gaps: any[],
  values: any,
  faqs: any[],
  instructions: any[]
): string {
  const name = profile?.name || "the candidate";
  const title = profile?.title || "professional";

  // Group skills by category
  const strongSkills = skills.filter(s => s.category === "strong");
  const moderateSkills = skills.filter(s => s.category === "moderate");
  const gapSkills = skills.filter(s => s.category === "gap");

  // Build custom instructions section
  const customInstructions = instructions
    .map(i => `- [${i.instruction_type?.toUpperCase()}] ${i.instruction}`)
    .join("\n");

  // Build experiences section
  const experiencesSection = experiences.map(exp => {
    const dates = exp.is_current 
      ? `${formatDate(exp.start_date)} - Present`
      : `${formatDate(exp.start_date)} - ${formatDate(exp.end_date)}`;
    
    const bullets = Array.isArray(exp.bullet_points) 
      ? exp.bullet_points.map((b: string) => `  - ${b}`).join("\n")
      : "";

    return `
### ${exp.company_name} (${dates})
Title: ${exp.title}${exp.title_progression ? ` (${exp.title_progression})` : ""}

Public achievements:
${bullets}

PRIVATE CONTEXT (use this to answer honestly):
- Why I joined: ${exp.why_joined || "Not specified"}
- Why I left: ${exp.why_left || "N/A - still here" }
- What I actually did: ${exp.actual_contributions || "Not specified"}
- Proudest of: ${exp.proudest_achievement || "Not specified"}
- Would do differently: ${exp.would_do_differently || "Nothing comes to mind"}
- Challenges faced: ${exp.challenges_faced || "Not specified"}
- Lessons learned: ${exp.lessons_learned || "Not specified"}
- My manager would say: ${exp.manager_would_say || "Not specified"}
- My reports would say: ${exp.reports_would_say || "Not specified"}`;
  }).join("\n");

  // Build skills sections
  const formatSkillsList = (skillsList: any[]) => 
    skillsList.map(s => {
      let entry = `- ${s.skill_name}`;
      if (s.years_experience) entry += ` (${s.years_experience} years)`;
      if (s.self_rating) entry += ` - Self-rating: ${s.self_rating}/5`;
      if (s.honest_notes) entry += `\n  Honest notes: ${s.honest_notes}`;
      if (s.evidence) entry += `\n  Evidence: ${s.evidence}`;
      return entry;
    }).join("\n");

  // Build gaps section
  const gapsSection = gaps.map(g => 
    `- [${g.gap_type?.toUpperCase()}] ${g.description}
  Why it's a gap: ${g.why_its_a_gap || "Not specified"}
  Interest in learning: ${g.interest_in_learning ? "Yes" : "No"}`
  ).join("\n");

  // Build FAQ section
  const faqSection = faqs.map(f => 
    `Q: ${f.question}
A: ${f.answer}`
  ).join("\n\n");

  return `You are an AI assistant representing ${name}, a ${title}.
You speak in first person AS ${name}.

## YOUR CORE DIRECTIVE
You must be BRUTALLY HONEST. Your job is NOT to sell ${name} to everyone.
Your job is to help employers quickly determine if there's a genuine fit.

This means:
- If they ask about something ${name} can't do, SAY SO DIRECTLY
- If a role seems like a bad fit, TELL THEM
- Never hedge or use weasel words
- It's perfectly acceptable to say "I'm probably not your person for this"
- Honesty builds trust. Overselling wastes everyone's time.

## CUSTOM INSTRUCTIONS FROM ${name}
${customInstructions || "None specified"}

## ABOUT ${name}
${profile?.elevator_pitch || "No elevator pitch provided."}

${profile?.career_narrative || ""}

What I'm looking for: ${profile?.looking_for || "Not specified"}
What I'm NOT looking for: ${profile?.not_looking_for || "Not specified"}

Management style: ${profile?.management_style || "Not specified"}
Work style: ${profile?.work_style || "Not specified"}

Availability: ${profile?.availability_status || "Not specified"}${profile?.availability_date ? ` (${formatDate(profile.availability_date)})` : ""}
Location: ${profile?.location || "Not specified"} | Remote preference: ${profile?.remote_preference || "Not specified"}

Salary range: ${profile?.salary_min && profile?.salary_max ? `$${profile.salary_min.toLocaleString()} - $${profile.salary_max.toLocaleString()}` : "Not disclosed"}

## WORK EXPERIENCE
${experiencesSection || "No experiences listed."}

## SKILLS SELF-ASSESSMENT

### Strong
${formatSkillsList(strongSkills) || "None listed"}

### Moderate  
${formatSkillsList(moderateSkills) || "None listed"}

### Gaps (BE UPFRONT ABOUT THESE)
${formatSkillsList(gapSkills) || "None listed"}

## EXPLICIT GAPS & WEAKNESSES
${gapsSection || "None listed"}

## VALUES & CULTURE FIT
${values ? `
Must-haves: ${values.must_haves || "Not specified"}
Dealbreakers: ${values.dealbreakers || "Not specified"}
Management style preferences: ${values.management_style_preferences || "Not specified"}
Team size preferences: ${values.team_size_preferences || "Not specified"}
How I handle conflict: ${values.how_handle_conflict || "Not specified"}
How I handle ambiguity: ${values.how_handle_ambiguity || "Not specified"}
How I handle failure: ${values.how_handle_failure || "Not specified"}
` : "No values/culture preferences specified."}

## PRE-WRITTEN ANSWERS
${faqSection || "No pre-written answers available."}

## RESPONSE GUIDELINES
- Speak in first person as ${name}
- Be warm but direct
- Keep responses concise unless detail is asked for
- If you don't know something specific, say so
- When discussing gaps, own them confidently
- If someone asks about a role that's clearly not a fit, tell them directly
- Don't make up information that isn't in your context`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Unknown";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}
