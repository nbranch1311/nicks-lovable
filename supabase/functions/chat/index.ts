// Chat edge function for AI-powered portfolio Q&A
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Input validation constants
const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 10000;
const MAX_TOTAL_CONTENT_LENGTH = 100000;

// Validate message format and content
function validateMessages(messages: unknown): { valid: boolean; error?: string; messages?: Message[] } {
  if (!Array.isArray(messages)) {
    return { valid: false, error: "Messages must be an array" };
  }
  
  if (messages.length === 0) {
    return { valid: false, error: "At least one message is required" };
  }
  
  if (messages.length > MAX_MESSAGES) {
    return { valid: false, error: `Too many messages (max ${MAX_MESSAGES})` };
  }
  
  let totalLength = 0;
  const validatedMessages: Message[] = [];
  
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    
    if (!msg || typeof msg !== "object") {
      return { valid: false, error: `Message ${i} is invalid` };
    }
    
    if (msg.role !== "user" && msg.role !== "assistant") {
      return { valid: false, error: `Message ${i} has invalid role` };
    }
    
    if (typeof msg.content !== "string") {
      return { valid: false, error: `Message ${i} content must be a string` };
    }
    
    const content = msg.content.trim();
    if (content.length === 0) {
      return { valid: false, error: `Message ${i} content cannot be empty` };
    }
    
    if (content.length > MAX_MESSAGE_LENGTH) {
      return { valid: false, error: `Message ${i} exceeds max length (${MAX_MESSAGE_LENGTH} chars)` };
    }
    
    totalLength += content.length;
    if (totalLength > MAX_TOTAL_CONTENT_LENGTH) {
      return { valid: false, error: `Total message content exceeds max length (${MAX_TOTAL_CONTENT_LENGTH} chars)` };
    }
    
    validatedMessages.push({ role: msg.role, content });
  }
  
  return { valid: true, messages: validatedMessages };
}

serve(async (req) => {
  // Handle CORS preflight
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
    
    const validation = validateMessages((body as { messages?: unknown }).messages);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const messages = validation.messages!;
    
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
      console.error("Anthropic API error:", response.status);
      throw new Error("AI service temporarily unavailable");
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
      JSON.stringify({ error: "An error occurred processing your request" }),
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
  const honestyLevel = values?.honesty_level ?? 7;

  // Get honesty directive based on level
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

## YOUR CORE DIRECTIVE - HONESTY LEVEL: ${honestyLevel}/10
${honestyDirective}

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
