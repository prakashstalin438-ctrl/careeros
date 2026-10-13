# CareerOS — AI Coding Instructions

## 1. Project Source of Truth

`CAREEROS_MASTER.md` is the primary source of truth for the CareerOS project.

Before making any major architectural, UI, feature, or implementation decision:

1. Read `CAREEROS_MASTER.md`.
2. Follow its product vision, architecture, phases, principles, and Definition of Done.
3. Do not contradict the master specification.
4. Do not invent major features that are not part of the current development phase unless explicitly requested.

---

## 2. Development Philosophy

CareerOS is being built as a production-quality AI Career Operating System.

The goal is not to create a simple chatbot, job board, or auto-apply script.

The system should eventually support:

- AI-powered career intelligence
- Resume intelligence
- Job discovery
- Job analysis
- Resume-to-job matching
- Skill-gap intelligence
- Personalized career coaching
- Learning roadmaps
- Portfolio/project recommendations
- Application workflows
- Application tracking
- Interview intelligence
- Multi-agent orchestration
- Career Digital Twin

Build the system progressively according to the phases defined in `CAREEROS_MASTER.md`.

---

## 3. Phase Discipline

Follow the development phases sequentially.

DO NOT implement future-phase functionality prematurely.

The current phase must be determined from `CAREEROS_MASTER.md`.

If the current phase is Phase 1:

- Focus on frontend UI/UX.
- Use mock data.
- Build reusable components.
- Build the complete navigation and page structure.
- Do not implement real backend functionality.
- Do not connect real job APIs.
- Do not implement real application submission.
- Do not implement real authentication unless explicitly requested.
- Do not implement real AI API calls unless explicitly requested.

Future functionality should be represented through clean UI states or mock data where appropriate.

---

## 4. Inspect Before Editing

Before modifying any existing file:

1. Inspect the current project structure.
2. Inspect relevant existing files.
3. Understand existing components and dependencies.
4. Reuse existing components when appropriate.
5. Avoid unnecessary rewrites.
6. Do not delete working functionality without a clear reason.

Never assume the project is empty.

---

## 5. Code Quality

Write clean, maintainable, modular code.

Prefer:

- Reusable components
- Clear component boundaries
- Logical folder structure
- Consistent naming
- Type safety where applicable
- Small focused functions
- Maintainable state management
- Clear error handling
- Scalable architecture

Avoid:

- Giant components
- Duplicate code
- Unnecessary dependencies
- Hardcoded business logic
- Random architectural changes
- Temporary hacks that become permanent

---

## 6. UI/UX Standards

CareerOS should look like a premium modern SaaS product.

Design direction:

- Professional
- Modern
- Minimal
- AI-focused
- Premium
- Clean
- Responsive

Preferred visual language:

- Dark sidebar/navigation
- Clean light content areas
- Purple/blue AI accents
- Soft gradients
- Rounded cards
- Subtle shadows
- Strong typography
- Clear visual hierarchy
- Consistent spacing
- Professional dashboard layouts

Avoid:

- Excessive animations
- Excessive gradients
- Cluttered dashboards
- Unnecessary glassmorphism
- Random colors
- Inconsistent spacing
- Generic chatbot-style UI

Every page should feel like part of the same product.

---

## 7. Responsive Design

CareerOS must work across:

- Desktop
- Laptop
- Tablet
- Mobile

Do not build desktop-only layouts.

Use responsive layouts and components from the beginning.

---

## 8. Career Data Integrity

CareerOS must NEVER fabricate user information.

Never invent:

- Skills
- Work experience
- Education
- Certifications
- Projects
- Job history
- Achievements
- Qualifications
- Interview experience

AI-generated career content must be clearly based on:

- User-provided information
- Parsed resume information
- Job descriptions
- User preferences
- Verified application/interview data

If information is missing, mark it as missing instead of inventing it.

---

## 9. AI Architecture

CareerOS will eventually use multiple specialized AI agents.

Potential agents include:

- Job Discovery Agent
- Job Analysis Agent
- Matching Agent
- Profile Agent
- Skill Gap Agent
- Career Coach Agent
- Learning Agent
- Project Agent
- Application Agent
- Tracking Agent
- Interview Agent
- Orchestrator

Do not create unnecessary agents for simple functionality.

Use specialized agents only where they provide a clear architectural benefit.

The Orchestrator should eventually coordinate agents rather than putting all intelligence into one giant agent.

---

## 10. Job Source Rules

Job sources must use a modular adapter architecture.

Conceptually:

Job Source
→ Source Adapter
→ Normalized Job Object
→ Duplicate Detection
→ Job Database
→ AI Analysis

Do not assume that LinkedIn, Naukri, or any other platform provides unrestricted public API access.

Real integrations must respect:

- API permissions
- Authentication requirements
- Terms of service
- Rate limits
- robots.txt where applicable
- Source-specific restrictions

Never bypass authentication, anti-bot systems, CAPTCHAs, or access restrictions.

---

## 11. Application Automation Rules

Application automation must only operate through supported and permitted workflows.

Never:

- Fabricate qualifications
- Fabricate experience
- Misrepresent skills
- Submit false information
- Bypass security controls
- Bypass CAPTCHA
- Bypass authentication restrictions

For Auto Apply Mode, the user's configured rules must control what can be submitted.

Approval Mode must allow the user to review and approve an application before submission.

---

## 12. Three CareerOS Modes

CareerOS supports three operating modes:

### Auto Apply Mode

AI can prepare and submit applications through supported workflows according to user-defined rules.

### Approval Mode

AI prepares the application, but the user must approve before submission.

### Coach Mode

AI focuses on:

- Career strategy
- Skill gaps
- Learning roadmap
- Project recommendations
- Job-market intelligence
- Interview preparation

The UI should make the current mode clear.

---

## 13. Mock Data Rules

During frontend development:

- Use realistic mock data.
- Clearly separate mock data from production integrations.
- Keep mock data easy to replace with real API/database data later.
- Do not build fake functionality that appears to be a real external integration.

Example:

Good:

`mockJobs.ts`

Bad:

Hardcoding fake jobs directly inside UI components.

---

## 14. Security

Never expose:

- API keys
- Secrets
- Passwords
- Tokens
- Private credentials

Never commit secrets into source code.

When backend functionality is introduced, implement:

- Authentication
- Authorization
- User data isolation
- Secure file storage
- Input validation
- API protection
- Rate limiting where appropriate
- Audit logging
- Agent permission boundaries

Security must be considered throughout development, not only at the end.

---

## 15. File and Folder Discipline

Keep project structure organized.

Prefer separation between:

- Components
- Pages
- Layouts
- Hooks
- Services
- Types
- Utilities
- Mock data
- AI/agent logic
- API/integration logic
- Configuration

Do not create unnecessary files.

Use descriptive names.

Keep related functionality together.

---

## 16. Error Handling

Production-quality code should handle failure gracefully.

Consider:

- Empty states
- Loading states
- Error states
- Network failures
- Invalid input
- Missing data
- API failures
- AI failures
- Authentication failures

Never leave the user with a broken or confusing interface.

---

## 17. User Experience

CareerOS should always make the next action obvious.

Examples:

Instead of only showing:

"Skill Gap: Docker"

Show useful context such as:

- Current level
- Required level
- Gap
- Why it matters
- Priority
- Recommended learning
- Suggested project
- Expected career impact

The product should help users make decisions, not simply display AI-generated text.

---

## 18. Explainability

Important AI decisions should be explainable.

For example:

Job Match should explain:

- Why the job matches
- Matching skills
- Missing skills
- Required skills
- Preferred skills
- Experience alignment
- Potential concerns

Skill recommendations should explain why the skill is recommended.

Do not present unexplained AI scores as absolute truth.

---

## 19. Development Workflow

For every requested feature:

### Step 1
Read the relevant section of `CAREEROS_MASTER.md`.

### Step 2
Inspect the existing implementation.

### Step 3
Determine what needs to be created or modified.

### Step 4
Implement the smallest clean solution that satisfies the requirement.

### Step 5
Check for regressions.

### Step 6
Verify responsiveness and UX.

### Step 7
Only then move to the next task.

---

## 20. When Requirements Are Ambiguous

If a requirement is unclear:

- Prefer the architecture defined in `CAREEROS_MASTER.md`.
- Prefer the simplest scalable solution.
- Do not introduce unnecessary complexity.
- If the ambiguity could materially change the architecture, ask for clarification before implementing.

Do not silently make major architectural decisions.

---

## 21. Do Not Break Existing Work

Existing working functionality is valuable.

Before changing anything:

- Understand it.
- Preserve it.
- Extend it where possible.

Do not replace working components simply because another implementation looks cleaner.

If a refactor is necessary, keep the behavior intact.

---

## 22. Current Development Priority

The project must progress phase by phase.

The current priority is always the active phase defined in:

`CAREEROS_MASTER.md`

Do not jump ahead simply because a future feature is interesting.

Build the foundation correctly first.

---

## 23. Definition of Quality

A feature is not considered complete merely because it works technically.

It should also be:

- Visually polished
- Responsive
- Maintainable
- Reusable
- Understandable
- Error-tolerant
- Secure where applicable
- Consistent with CareerOS architecture
- Consistent with the CareerOS design system

---

## 24. Final Rule

Before every major implementation, ask:

1. Does this follow `CAREEROS_MASTER.md`?
2. Is this part of the current phase?
3. Does it preserve existing functionality?
4. Is it scalable?
5. Is it secure?
6. Is the UX clear?
7. Am I inventing any user information or unsupported external functionality?

If the answer is no to any important question, stop and reconsider the implementation.
## Fast Execution Mode

For implementation requests, prioritize execution speed.

Do NOT repeatedly perform broad project-wide inspections or unnecessary reviews.

Before implementing:
- Read only the files directly relevant to the requested feature.
- Check existing implementation only where necessary to avoid conflicts.
- Do not re-read CAREEROS_MASTER.md or GEMINI.md repeatedly during the same task if they have already been read.

Do NOT:
- Re-analyze the entire project for every request.
- Re-check unrelated files.
- Repeat completed validation steps unnecessarily.
- Stop and ask for confirmation for routine implementation decisions.
- Spend excessive time reviewing already completed work.

When the requested feature is clear:
1. Make the required changes.
2. Run a focused typecheck/build if needed.
3. Fix obvious errors.
4. Continue to the next implementation step.

Do not wait for user confirmation between normal implementation steps.

Only stop and ask the user when:
- A destructive action is required.
- A major architectural decision is genuinely ambiguous.
- Required credentials or external configuration are missing.
- An external service is unavailable and cannot be worked around.

Otherwise, proceed autonomously.