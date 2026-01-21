# Admin Panel Documentation

## Overview

The Admin Panel (`/admin`) is a protected area where you can manage all content that powers your AI-powered portfolio. The AI chatbot uses this data to represent you honestly and accurately to recruiters and hiring managers.

## Accessing the Admin Panel

### URL
- **Admin Panel**: `/admin`
- **Authentication**: `/auth`

### First-Time Setup

1. Navigate to `/auth`
2. Click the **Sign Up** tab
3. Enter your email and password (minimum 6 characters)
4. Check your email for a confirmation link
5. Click the confirmation link to verify your account
6. Return to `/auth` and sign in
7. You'll be automatically redirected to `/admin`

### Subsequent Access

1. Navigate to `/admin` (or `/auth`)
2. If you're already logged in, you'll go directly to the admin panel
3. If not, sign in with your email and password

## Admin Panel Tabs

### 1. Profile Tab
Your basic information and career narrative.

**Fields:**
- Full Name (required)
- Email
- Current Title
- Target Titles (add multiple)
- Target Company Stages (Seed through Public)
- Elevator Pitch (2-3 sentences)
- Career Narrative (your full story)
- What you're looking for
- What you're NOT looking for
- Management Style
- Work Style
- Salary Range (min/max)
- Availability Status
- Available Starting Date
- Location
- Remote Preference
- Social Links (LinkedIn, GitHub, Twitter)

### 2. Experience Tab
Your work history with both public and private AI context.

**Public Fields (visible on your portfolio):**
- Company Name
- Title
- Title Progression (e.g., "Senior → Staff")
- Start/End Dates
- Achievement Bullets

**Private AI Context Fields (used by AI for honest answers):**
- Why you joined
- Why you left (be honest!)
- What YOU actually did vs. the team
- What you're proudest of
- What you'd do differently
- Challenges faced
- Lessons learned
- What your manager would say
- What your reports would say

### 3. Skills Tab
Self-assessment of your technical and professional skills.

**For each skill:**
- Skill Name
- Category: Strong / Moderate / Gap
- Self-Rating (1-5)
- Years of Experience
- Last Used Date
- Evidence (projects, certifications)
- Honest Notes (e.g., "Haven't used this in 2 years")

### 4. Gaps Tab
Your limitations and weaknesses (this is what makes the AI valuable!).

**Gap Types:**
- Skill Gap
- Experience Gap
- Environment Mismatch
- Role Type Mismatch

**For each gap:**
- Description
- Why it's a gap
- Whether you're interested in learning

### 5. Values & Culture Tab
Your work environment preferences and how you handle challenges.

**Sections:**
- Must-haves in a company
- Dealbreakers
- Management style preferences
- Team size preferences
- How you handle conflict
- How you handle ambiguity
- How you handle failure

### 6. FAQ Tab
Pre-written answers to common interview questions.

**Built-in common questions:**
- Tell me about yourself
- What's your biggest weakness?
- Why are you leaving your current role?
- Where do you see yourself in 5 years?
- Tell me about a time you failed
- And more...

### 7. AI Instructions Tab
Control how the AI represents you.

**Features:**
- Honesty Level slider (1-10)
- Custom instruction rules

**Instruction Types:**
- **Honesty**: Rules about transparency
- **Tone**: How the AI should sound
- **Boundaries**: What the AI shouldn't discuss

**Example Instructions:**
- "Never oversell me"
- "If they need X and I don't have it, say so directly"
- "Use 'I'm probably not your person' when appropriate"
- "Don't hedge—be direct"
- "It's okay to recommend they not hire me"

## Saving Your Changes

Click the **Save All Changes** button in the header to save all data across all tabs. You'll see:
- A loading spinner while saving
- A success toast when complete
- An error toast if something goes wrong

## Signing Out

Click the logout icon (arrow) in the top-right corner of the admin panel.

## Security Notes

- The admin panel is protected by authentication
- Only signed-in users can access `/admin`
- Your data is stored in Supabase with Row Level Security
- Sessions are managed securely via Supabase Auth

## Troubleshooting

**Can't access admin panel?**
- Make sure you're signed in at `/auth`
- Check that your email is verified

**Data not saving?**
- Check your internet connection
- Look for error messages in the toast notifications
- Ensure required fields (marked with *) are filled

**Changes not appearing on public site?**
- Data updates in real-time for the AI
- Hard refresh your browser if needed (Ctrl+Shift+R)
