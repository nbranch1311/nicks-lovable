// Analyze JD edge function for honest job fit assessment
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalysisResponse {
  verdict: "strong_fit" | "worth_conversation" | "probably_not";
  headline: string;
  opening: string;
  gaps: Array<{
    requirement: string;
    gap_title: string;
    explanation: string;
  }>;
  transfers: string;
  recommendation: string;
}

// Input validation constants
const MIN_JD_LENGTH = 50;

// Validate job description input
function validateJobDescription(input: unknown): { valid: boolean; error?: string; jobDescription?: string } {
  if (input === null || input === undefined) {
    return { valid: false, error: "Job description is required" };
  }
  
  if (typeof input !== "string") {
    return { valid: false, error: "Job description must be a string" };
  }
  
  const trimmed = input.trim();
  
  if (trimmed.length < MIN_JD_LENGTH) {
    return { valid: false, error: `Job description too short (min ${MIN_JD_LENGTH} characters)` };
  }
  
  return { valid: true, jobDescription: trimmed };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate input
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!body || typeof body !== "object") {
      return new Response(
        JSON.stringify({ error: "Request body must be an object" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const validation = validateJobDescription((body as { jobDescription?: unknown }).jobDescription);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const jobDescription = validation.jobDescription!;

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

    // Build system prompt for JD analysis
    const systemPrompt = buildAnalysisSystemPrompt(profile, experiences, skills, gaps, values, faqs, instructions);

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
        max_tokens: 2048,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Please analyze this job description and assess my fit:\n\n${jobDescription}`
          }
        ]
      })
    });

    if (!response.ok) {
      console.error("Anthropic API error:", response.status);
      throw new Error("AI service temporarily unavailable");
    }

    const result = await response.json();
    const content = result.content[0]?.text || "";

    // Parse JSON from response
    let analysis: AnalysisResponse;
    try {
      // Extract JSON from the response (handle potential markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      analysis = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Failed to parse analysis response");
      throw new Error("Failed to parse analysis response");
    }

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Analyze JD function error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function buildAnalysisSystemPrompt(
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
  const honestyLevel = values?.honesty_level ?? 7;
  const honestyDirective = getHonestyDirective(honestyLevel);

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

Achievements:
${bullets}

Context:
- What I actually did: ${exp.actual_contributions || "Not specified"}
- Proudest of: ${exp.proudest_achievement || "Not specified"}
- Challenges faced: ${exp.challenges_faced || "Not specified"}
- Lessons learned: ${exp.lessons_learned || "Not specified"}`;
  }).join("\n");

  // Build skills sections
  const formatSkillsList = (skillsList: any[]) => 
    skillsList.map(s => {
      let entry = `- ${s.skill_name}`;
      if (s.years_experience) entry += ` (${s.years_experience} years)`;
      if (s.honest_notes) entry += ` - ${s.honest_notes}`;
      return entry;
    }).join("\n");

  // Build gaps section
  const gapsSection = gaps.map(g => 
    `- [${g.gap_type?.toUpperCase()}] ${g.description}: ${g.why_its_a_gap || ""}`
  ).join("\n");

  return `You are analyzing a job description to assess fit for ${name}, a ${title}.

## ⚠️ MANDATORY CUSTOM INSTRUCTIONS - FOLLOW THESE EXACTLY
${customInstructions ? `
These are ${name}'s explicit instructions for how you MUST behave. Violating these is not acceptable:

${customInstructions}

Apply these instructions throughout your entire analysis.
` : "No custom instructions provided."}

## HONESTY LEVEL: ${honestyLevel}/10
${honestyDirective}

Your assessment MUST:
1. Follow ALL custom instructions above - they override default behavior
2. Identify specific requirements from the JD that ${name} DOES NOT meet
3. Be appropriately direct based on the honesty level above
4. Explain what DOES transfer even if it's not a perfect fit
5. Consider adjacent skills and learning potential when custom instructions indicate openness
6. Give a clear recommendation

## ABOUT ${name}
${profile?.elevator_pitch || "No elevator pitch provided."}
${profile?.career_narrative || ""}

What I'm looking for: ${profile?.looking_for || "Not specified"}
What I'm NOT looking for: ${profile?.not_looking_for || "Not specified"}

## EDUCATION
${profile?.education || "No formal education listed."}

## WORK EXPERIENCE
${experiencesSection || "No experiences listed."}

## SKILLS

### Strong
${formatSkillsList(strongSkills) || "None listed"}

### Moderate  
${formatSkillsList(moderateSkills) || "None listed"}

### Known Gaps
${formatSkillsList(gapSkills) || "None listed"}

## EXPLICIT GAPS & WEAKNESSES
${gapsSection || "None listed"}

## VALUES & CULTURE
${values ? `
Must-haves: ${values.must_haves || "Not specified"}
Dealbreakers: ${values.dealbreakers || "Not specified"}
` : "Not specified"}

Respond ONLY with valid JSON in this exact format:
{
  "verdict": "strong_fit" | "worth_conversation" | "probably_not",
  "headline": "Brief headline for the assessment",
  "opening": "1-2 sentence direct assessment in first person",
  "gaps": [
    {
      "requirement": "What the JD asks for",
      "gap_title": "Short title",
      "explanation": "Why this is a gap for me"
    }
  ],
  "transfers": "What skills/experience DO transfer",
  "recommendation": "Direct advice - can be 'don't hire me for this'"
}`;
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

function getHonestyDirective(level: number): string {
  if (level <= 2) {
    return `You should be diplomatic and tactful. Frame limitations gently and focus on positives.
- Soften any negative information with qualifiers
- Lead with strengths before mentioning gaps
- Use phrases like "I'm still developing" or "an area of growth"
- Avoid directly discouraging employers`;
  } else if (level <= 4) {
    return `You should be balanced and professional. Be honest but diplomatic.
- Acknowledge gaps when asked directly
- Present information fairly without overselling
- Use measured language like "not my primary strength"
- Be straightforward but not blunt`;
  } else if (level <= 6) {
    return `You should be direct and transparent. Don't hedge on important limitations.
- State gaps clearly when relevant
- Be upfront about fit concerns
- Use direct language like "I don't have experience in X"
- It's okay to express uncertainty about fit`;
  } else if (level <= 8) {
    return `You should be blunt and forthcoming. Proactively surface concerns.
- Call out gaps without being asked
- Use phrases like "I'm probably not your person for this"
- Don't sugarcoat limitations
- Prioritize saving everyone's time over making a good impression`;
  } else {
    return `You should be brutally honest with maximum transparency.
- Lead with deal-breaking gaps
- Actively recommend against hiring if there's a clear mismatch
- Use phrases like "You should not hire me for this" when appropriate
- Honesty is more important than politeness
- Your job is to filter OUT bad fits, not sell the candidate`;
  }
}