# Competitive Teardown: AI Agent Oversight / Human-in-the-Loop Dashboards

**Date:** 2026-03-08
**Researcher:** UX Research (automated)
**Project:** Co-Sign — Provisional Action Review for AI Agents

---

## Competitors Analyzed

| # | Product | Category | Primary Users |
|---|---------|----------|---------------|
| 1 | **Salesforce Agentforce** | CRM-native AI agent platform | Sales ops, service managers |
| 2 | **Microsoft Copilot Studio** | Enterprise agent builder (Power Platform) | IT admins, ops leads |
| 3 | **LangChain / LangSmith** | Developer-first agent framework + observability | Engineers, ML ops |
| 4 | **Relevance AI** | No-code AI workforce builder | GTM teams, ops managers |
| 5 | **CrewAI** | Multi-agent orchestration framework | Developers, enterprise ops |

---

## 1. Individual Competitor Profiles

### 1.1 Salesforce Agentforce

**Core proposition:** AI agents embedded natively within the Salesforce CRM ecosystem, automating sales and service workflows while leveraging existing customer data.

**Human-in-the-loop model:**
- Escalation-based. Agents run autonomously until they hit a confidence threshold or policy trigger, then hand off to a human via Omni-Channel routing.
- During handoff, the human receives a transcript of the conversation and an AI-generated summary.
- Guardrails are defined declaratively: role-based permissions, data access policies, escalation criteria (sentiment, confidence level, sensitive topics).
- No "provisional action" concept — actions are either executed autonomously or escalated entirely to a human.

**UI patterns:**
- Chat-first interface. Agent interactions happen in a conversational window.
- Escalation handoff appears in the Omni-Channel queue — standard Salesforce service console patterns.
- Guardrail configuration happens in Agentforce Builder (a flow-style visual editor).
- No dedicated oversight dashboard for reviewing staged actions.

**Strengths:**
- Deep CRM data integration gives agents rich context.
- Einstein Trust Layer provides token-level safety (PII masking, toxicity, grounding).
- Familiar Salesforce UI reduces learning curve for existing customers.

**Weaknesses:**
- Binary control model: fully autonomous OR fully escalated. No middle ground for "review and correct."
- Chat-based UX adds workflow complexity. G2 user: *"Lots of clicking to get select the right options. UX needs improvement. Everything opens in a new browser tabs clustering the browser."* ([G2 Reviews](https://www.g2.com/products/salesforce-agentforce/reviews))
- 77% of B2B Agentforce deployments reportedly fail due to data quality issues and UX limitations. ([Oliv.ai analysis](https://www.oliv.ai/blog/salesforce-agentforce-reviews-analyzed))
- One reviewer tested Agentforce across six practical use cases; it only delivered well on two. ([Salesforce Ben](https://www.salesforceben.com/agentforce-for-salesforce-help-6-month-review-and-whats-improved/))
- Steep learning curve: *"Getting consistent and accurate results isn't as simple as just telling the agent what to do."* (Verified Salesforce Administrator, [G2](https://www.g2.com/products/salesforce-agentforce/reviews))
- Late 2025 revealed challenges with drift after 8+ agent steps, missed instructions, and hallucinations. ([Intigris](https://www.intigris.nl/blog-posts/salesforce-in-2026))

---

### 1.2 Microsoft Copilot Studio

**Core proposition:** Enterprise agent builder within the Power Platform ecosystem. Agents operate autonomously in the background, triggered by events, with guardrails and approval flows built into Power Automate.

**Human-in-the-loop model:**
- **Multistage approvals** (preview, 2025-2026): Combines manual human stages + AI approval stages + conditional routing in a single workflow. Added via a "Human in the loop" connector in agent flows.
- Manual stages send approval requests to designated humans via Teams, Outlook, or Power Automate portal.
- AI stages can pre-screen with an LLM (GPT-o3/GPT-4.1) that produces Approve/Reject with rationale. Human reviewers can follow to override.
- Conditions route approvals dynamically (e.g., expense > $5K goes to manager; under $5K auto-approves if AI stage approved).
- Agent Registry surfaces "Top Actions that require attention" — pending access requests, risky agents, ownerless agents. ([Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-advanced-approvals))

**UI patterns:**
- Flow-based visual builder for configuring approval stages (multi-stage approval viewer with tiles).
- Approval responses happen in Teams or Outlook — reviewers approve/reject from within tools they already use.
- AI rationale is viewable in the Approvals Center (History tab) and Prompt Builder Activity screen.
- Agent 365 dashboard provides a unified view of agents across the organization.

**Strengths:**
- Most sophisticated multi-stage approval system among competitors — combines AI pre-screening with human review.
- Approval surfaces in Teams/Outlook reduce context-switching.
- Condition-based routing allows nuanced approval logic without code.
- Strong enterprise governance story (Entra Agent ID, Defender integration, audit logging).

**Weaknesses:**
- Most HITL features still in preview — not production-ready. *"Microsoft's tendency to market preview features as production-ready create serious trust issues."* ([Ragnar Heil review](https://ragnarheil.de/the-good-the-bad-and-the-ugly-of-copilot-studio-a-brutally-honest-review-going-into-late-2025/))
- Governance described as a "nightmare" — ALM (application lifecycle management) is broken for advanced approvals; sharing flows requires recreating approval logic. ([Microsoft Learn known limitations](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-advanced-approvals))
- Binary approve/reject only — no mechanism for correcting or steering the agent's proposed action.
- AI rationale displayed as raw JSON in the Prompt Builder Activity screen. No user-friendly summary for non-technical reviewers.
- If Copilot Credits are insufficient, approval stalls silently. ([Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-advanced-approvals))
- Cannot assign the same approver to multiple stages (causes flow failure).

---

### 1.3 LangChain / LangSmith

**Core proposition:** Developer-first framework for building AI agents (LangChain/LangGraph) with an observability and evaluation platform (LangSmith) for monitoring agents in production.

**Human-in-the-loop model:**
- **HITL middleware** in LangGraph intercepts tool calls after model generation but before execution.
- Three decision types: **Approve** (execute unchanged), **Edit** (modify tool arguments before running), **Reject** (decline with feedback).
- Interrupt pattern: middleware issues an `interrupt` that halts execution; graph state is saved via persistence layer; resumes when human provides a `Command` object with decisions.
- Thread ID enables safe pause/resume cycles across async interactions.
- Warning on edits: *"When editing tool arguments, make changes conservatively. Significant modifications...may cause the model to re-evaluate its approach."* ([LangChain docs](https://docs.langchain.com/oss/python/langchain/human-in-the-loop))

**UI patterns:**
- **No built-in review UI.** HITL is entirely programmatic — developers must build their own approval interface.
- LangSmith provides observability dashboards: token usage, latency (P50, P99), error rates, cost breakdowns, feedback scores.
- Custom dashboards with configurable alerts (webhooks, PagerDuty).
- Traces visualize agent decision chains but are developer-oriented (not designed for ops managers).
- New "Insights Agent" analyzes traces to surface common usage patterns and failure modes.

**Strengths:**
- Only competitor offering **Edit** capability — reviewers can modify tool arguments before execution, not just approve/reject.
- Fine-grained interrupt points per tool call.
- Strong observability: traces every LLM call, tool invocation, and decision path.
- Open-source framework with large community.

**Weaknesses:**
- No UI for non-technical users. Oversight requires API calls and custom frontend development.
- *"The UI can be tricky to work with for larger datasets or datasets with large experiment history."* ([Product Hunt reviews](https://www.producthunt.com/products/langsmith/reviews))
- *"The interface can get cluttered faster than a whiteboard after a brainstorming session."* ([Slashdot reviews](https://slashdot.org/software/p/LangSmith/))
- No role-based access control for approvals — anyone with API access can approve.
- Edit capability has a significant caveat: edits may cause unexpected agent behavior.
- No learning loop — agent doesn't improve from corrections.

---

### 1.4 Relevance AI

**Core proposition:** No-code AI workforce builder for GTM teams. Build multi-agent "workforces" that handle sales outreach, research, and operations with configurable oversight.

**Human-in-the-loop model:**
- **Three approval modes per edge** (connection between workflow nodes):
  - **Auto Run**: Execute automatically (with optional max auto-run limits).
  - **Approval Required**: Agent drafts action, waits for human authorization.
  - **Let Agent Decide**: Agent completes tasks autonomously when confident; requests approval when uncertain, governed by natural language instructions.
- **Escalation tools**: Slack notifications, email alerts route issues to team members.
- Workforce Task View is the central dashboard for monitoring approvals. Users can approve, reject, or "provide additional guidance."

**UI patterns:**
- Workforce Builder: visual flow editor for connecting agents and tools.
- Edge Settings panel: per-connection approval configuration.
- Task View dashboard: pending approvals, action history, outcome tracking.
- "Provide additional guidance" option alongside approve/reject.

**Strengths:**
- "Let Agent Decide" mode is unique — dynamic confidence-based autonomy with natural language escalation criteria.
- Per-edge granularity allows different oversight levels for different actions.
- Non-technical users can configure approval logic.
- "Provide additional guidance" goes beyond binary approve/reject.

**Weaknesses:**
- *"The UX/UI is busy and it sometimes does not fully sync your latest edits."* ([G2 Reviews](https://www.g2.com/products/relevance-ai/reviews))
- *"Confusing onboarding and busy UX/UI design."* ([G2 Reviews](https://www.g2.com/products/relevance-ai/reviews))
- Reviewer requested *"more governance controls and admin configuration controls for the administration team."* ([G2](https://www.g2.com/products/relevance-ai/reviews))
- "Provide additional guidance" is vaguely defined — unclear how feedback is structured or how agents use it.
- No evidence of agents learning from correction patterns over time.
- Integration difficulties: custom solutions required for major tools like BigQuery.
- Expensive pricing prompts consideration of alternatives.

---

### 1.5 CrewAI

**Core proposition:** Multi-agent orchestration framework for production workloads. "Crews" of specialized agents collaborate on complex tasks with human oversight built into Flows.

**Human-in-the-loop model:**
- **`@human_feedback` decorator**: Pauses flow at checkpoint, presents output for review, collects feedback, routes to different paths based on response.
- Webhook-based async workflows for production (Slack, Teams, email notifications).
- If negative feedback is provided, the crew retries the task with the feedback added as context.
- Enterprise (AMP) adds: in-platform review, responder assignment, permissions, escalation policies, SLA management, dynamic routing, analytics.

**UI patterns:**
- Open-source: No built-in review UI. Reviewers interact via REST API endpoints.
- Enterprise (AMP): "Flow HITL Management Platform" with in-platform review — details sparse.
- Central dashboard tracks crews/agents carrying out workflows.
- Email-first notifications for review requests (no platform account required for reviewers).

**Strengths:**
- Agent actually re-executes with feedback context — closest thing to "learning from corrections" among competitors.
- Smart routing: assign reviewers dynamically from flow state (e.g., CRM ownership).
- SLA tracking prevents review bottlenecks (auto-response fallbacks).
- Proven at scale: AB InBev processes 20M tickets/year through HITL architecture.

**Weaknesses:**
- Open-source version has no reviewer UI — requires API calls to resume.
- Enterprise features poorly documented; marketing language outpaces product specifics.
- Documentation acknowledges that for mission-critical systems, platform *"still needs oversight, observability, and sometimes more maturity in certain integrations or memory behaviors."*
- No structured correction format — feedback is freeform text, not guided editing.
- Limited to retry-with-feedback; cannot edit the specific action parameters before execution.

---

## 2. Competitor Matrix

### Feature Comparison

| Capability | Agentforce | Copilot Studio | LangSmith | Relevance AI | CrewAI |
|---|---|---|---|---|---|
| **Approval flow** | Escalation only | Multi-stage (preview) | Interrupt-based | Per-edge config | Decorator-based |
| **Approve/Reject** | Via handoff | Yes | Yes | Yes | Yes |
| **Edit action before execution** | No | No | Yes (API only) | No | No |
| **Provide textual feedback** | No | No | Yes (reject reason) | Yes ("guidance") | Yes (retry context) |
| **Agent re-executes with feedback** | No | No | No | Unclear | Yes |
| **Confidence/risk scoring** | Sentiment-based | AI stage rationale | No built-in | "Let Agent Decide" | No built-in |
| **Dedicated review dashboard** | No (uses Omni-Channel) | Approvals Center | No (traces only) | Task View | Enterprise only |
| **Non-technical reviewer UI** | Yes (Salesforce console) | Yes (Teams/Outlook) | No | Yes | Enterprise only |
| **Per-action granularity** | Topic-level | Stage-level | Tool-call level | Edge-level | Checkpoint-level |
| **Audit trail** | Einstein Trust Layer | Prompt Builder Activity | Traces | Task history | Enterprise only |
| **Multi-agent support** | Limited | Limited (child agents broken) | Yes | Yes (Workforce) | Yes (Crews) |
| **Conditional routing** | Flow-based | Conditions between stages | Custom code | Natural language rules | Code-based |
| **SLA/timeout management** | No | No | No | No | Enterprise only |
| **Learning from corrections** | No | No | No | No | Retry with context |

### Oversight Model Comparison

| Dimension | Agentforce | Copilot Studio | LangSmith | Relevance AI | CrewAI |
|---|---|---|---|---|---|
| **Primary metaphor** | Escalation queue | Approval workflow | Debug trace | Task inbox | Flow checkpoint |
| **User persona** | Service agent | IT admin / approver | Developer | Ops manager | Developer / Enterprise ops |
| **Review surface** | Salesforce console | Teams / Outlook / Portal | API / custom UI | Web dashboard | API / Enterprise platform |
| **Autonomy control** | Binary (on/off) | Stage-gated | Per-tool-call | Per-edge + confidence | Per-checkpoint |
| **Correction model** | None (human takes over) | None (approve/reject) | Edit tool args | "Provide guidance" | Freeform feedback + retry |

---

## 3. Pattern Library: Emerging Industry Standards

These UI patterns appear across multiple competitors and are becoming expected conventions:

### P1. Approve/Reject Binary
**Prevalence:** 5/5 competitors
Every platform offers at minimum a binary approve/reject mechanism. This is table stakes.

### P2. Audit Trail / Action Log
**Prevalence:** 5/5 competitors
Chronological record of agent actions, human decisions, and outcomes. Used for compliance, debugging, and trust-building. The Smashing Magazine "Action Audit & Undo" pattern describes this as "the most powerful trust-builder." ([Smashing Magazine](https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/))

### P3. Escalation/Handoff to Human
**Prevalence:** 5/5 competitors
Triggered by confidence thresholds, policy violations, or sensitive content. Standard in all platforms, though trigger granularity varies.

### P4. Visual Flow Builder for Oversight Configuration
**Prevalence:** 4/5 competitors (not LangSmith)
Drag-and-drop or visual editors for defining where oversight checkpoints occur. Salesforce (Agentforce Builder), Microsoft (agent flow designer), Relevance (Workforce Builder), CrewAI (Flows).

### P5. Multi-Channel Notification
**Prevalence:** 4/5 competitors (not LangSmith)
Approval requests surface in Slack, Teams, email, or in-platform — meeting reviewers where they already work.

### P6. Agent Reasoning Visibility
**Prevalence:** 3/5 competitors
Showing the agent's rationale for a proposed action. Copilot Studio (AI stage rationale), LangSmith (traces), Relevance AI (supporting reasoning in Task View). Emerging but not yet standard.

### P7. Confidence/Uncertainty Signal
**Prevalence:** 2/5 competitors
Only Relevance AI ("Let Agent Decide" with confidence) and Agentforce (sentiment-based triggers) expose confidence levels. The Smashing Magazine "Confidence Signal" pattern recommends this as essential for preventing automation bias. ([Smashing Magazine](https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/))

### P8. Autonomy Dial / Progressive Authorization
**Prevalence:** 1/5 competitors (Relevance AI's three modes)
Allowing users to adjust the level of agent autonomy per action type. Smashing Magazine identifies this as a core pattern but only Relevance AI implements it partially. ([Smashing Magazine](https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/))

---

## 4. Gap Analysis: Design Opportunities

### Gap 1: No "Provisional State" — Only Escalation or Approval
**What's missing:** No competitor implements a true provisional state where the agent's proposed action is staged as a draft that humans can inspect, modify, and refine before execution. The current models are:
- **Escalation** (Agentforce): Human takes over entirely.
- **Approve/Reject** (Copilot Studio, Relevance AI): Binary gate with no correction.
- **Edit tool args** (LangSmith): Technically possible but requires API calls and risks destabilizing the agent.
- **Retry with feedback** (CrewAI): Agent re-runs, but the human can't directly shape the specific action.

**Opportunity for Co-Sign:** The Provisional Card is a genuinely novel interaction pattern. A staged action that shows the agent's reasoning, surfaces conflicts with guardrails, and lets the reviewer correct specific parameters while keeping the agent in the loop — this does not exist in any competitor.

### Gap 2: No Structured Correction — Only Binary or Freeform
**What's missing:** Corrections are either absent (Agentforce, Copilot Studio), freeform text (CrewAI, Relevance AI), or raw parameter editing (LangSmith). No competitor provides a structured correction interface that guides the reviewer through what specifically needs to change and why.

**Opportunity for Co-Sign:** A correction prompt that is structured (highlighting the specific conflict, suggesting alternatives, showing guardrail context) rather than a blank text field or a raw JSON editor. This bridges the gap between "approve/reject" and "take over entirely."

### Gap 3: No Agent Learning from Corrections
**What's missing:** Only CrewAI attempts this (retry with feedback context), but it's a blunt instrument — the entire task re-executes with appended text. No competitor tracks correction patterns to improve the agent's future behavior. As the Smashing Magazine article notes, the ideal is "Correction -> Pattern -> Policy -> Autonomy" progression. ([Smashing Magazine](https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/))

**Opportunity for Co-Sign:** Track corrections over time, surface patterns ("This agent keeps over-discounting for enterprise deals"), and suggest guardrail updates. Turn human corrections into agent improvement, not just one-time fixes.

### Gap 4: No Risk-Prioritized Review Queue
**What's missing:** Approval queues are flat lists. No competitor surfaces risk scores to help reviewers prioritize. When managing 5-20+ agents, reviewers waste time on low-risk approvals while high-risk actions wait.

**Opportunity for Co-Sign:** Risk-scored review queue with visual priority indicators. High-risk actions surface first with rich context; low-risk actions can be batch-approved.

### Gap 5: Reviewer Fatigue — No Support for "Supervised Autonomy"
**What's missing:** Current HITL models create bottlenecks. SiliconANGLE reports that HITL has "hit the wall" because *"humans cannot meaningfully track or supervise AI at machine speed and scale"* and human loops are *"too slow, too fragmented or too late."* ([SiliconANGLE](https://siliconangle.com/2026/01/18/human-loop-hit-wall-time-ai-oversee-ai/)) No competitor offers progressive trust — where agents earn more autonomy as their corrections decrease.

**Opportunity for Co-Sign:** The "Autonomy Dial" concept from Smashing Magazine, implemented dynamically. As an agent demonstrates reliability (fewer corrections over time), the system recommends increasing its autonomy for specific action types. Supervision scales down, not up.

---

## 5. Key Quotes (with sources)

### On UX Friction

> "Lots of clicking to get select the right options. UX needs improvement. Everything opens in a new browser tabs clustering the browser."
> — Verified Enterprise User, Salesforce Agentforce ([G2](https://www.g2.com/products/salesforce-agentforce/reviews))

> "The UX/UI is busy and it sometimes does not fully sync your latest edits."
> — User review, Relevance AI ([G2](https://www.g2.com/products/relevance-ai/reviews))

> "The interface can get cluttered faster than a whiteboard after a brainstorming session."
> — LangSmith reviewer ([Slashdot](https://slashdot.org/software/p/LangSmith/))

### On Trust and Control

> "Getting consistent and accurate results isn't as simple as just telling the agent what to do."
> — Verified Salesforce Administrator ([G2](https://www.g2.com/products/salesforce-agentforce/reviews))

> "Legacy baggage, broken ALM, governance nightmares, and Microsoft's tendency to market preview features as production-ready create serious trust issues."
> — Ragnar Heil, Copilot Studio review ([ragnarheil.de](https://ragnarheil.de/the-good-the-bad-and-the-ugly-of-copilot-studio-a-brutally-honest-review-going-into-late-2025/))

> "Nearly two-thirds of companies were surprised by the extent of oversight required to manage agents, despite vendor claims."
> — G2 Enterprise AI Agents Report ([G2](https://learn.g2.com/enterprise-ai-agents-report))

### On HITL Scaling

> "AI systems make millions of decisions per second... human oversight is often defined in aspirational terms that do not scale with AI decision-making volume or velocity."
> — SiliconANGLE ([siliconangle.com](https://siliconangle.com/2026/01/18/human-loop-hit-wall-time-ai-oversee-ai/))

> "For many execution tasks, inserting a human to verify or tweak the AI lowered output quality compared to the AI working alone."
> — Research cited in HITL dashboard analysis ([siliconangle.com](https://siliconangle.com/2026/01/18/human-loop-hit-wall-time-ai-oversee-ai/))

### On Design Patterns

> "Trustworthiness is an output of a design process, not a technical capability alone."
> — Smashing Magazine, Designing for Agentic AI ([smashingmagazine.com](https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/))

> "When asking humans for approval, keep the request clear, focused, and explain why it's needed. Don't overload reviewers with raw JSON."
> — Permit.io HITL best practices ([permit.io](https://www.permit.io/blog/human-in-the-loop-for-ai-agents-best-practices-frameworks-use-cases-and-demo))

> "Delete user john@example.com? is better than Tool execution requires approval."
> — Mastra, on approval UX clarity ([mastra.ai](https://mastra.ai/blog/human-in-the-loop-when-to-use-agent-approval))

### On the Correction Gap

> "When editing tool arguments, make changes conservatively. Significant modifications may cause the model to re-evaluate its approach."
> — LangChain HITL documentation ([docs.langchain.com](https://docs.langchain.com/oss/python/langchain/human-in-the-loop))

> "90% automated, 10% human-augmented — though ratios vary by use case."
> — CrewAI on the HITL ratio ([blog.crewai.com](https://blog.crewai.com/a-missing-layer-in-agentic-systems/))

---

## 6. Design Implications for Co-Sign

### Implication 1: The "Provisional Card" is a genuine differentiator
No competitor offers a staged, editable preview of an agent's proposed action with structured correction. This is the gap between "approve/reject" and "take over entirely" that the entire industry is circling but hasn't solved. Co-Sign's core interaction — reviewing a provisional action, seeing reasoning, identifying guardrail conflicts, and providing a correction prompt — is novel.

**Design direction:** The Provisional Card should combine the Smashing Magazine "Intent Preview" pattern (showing planned steps and reversibility) with structured correction fields (not freeform text). Show the agent's reasoning alongside the guardrail it conflicts with. Make the correction feel like editing, not starting over.

### Implication 2: Risk scoring must drive the review queue
With 5-20+ agents, flat approval lists will create the same bottleneck users complain about everywhere else. Risk-scored prioritization is the difference between a useful dashboard and an overwhelming inbox.

**Design direction:** Queue sorted by risk score. High-risk cards expanded by default with full context. Low-risk actions collapsible or batch-approvable. Visual risk indicators (not just numbers).

### Implication 3: Corrections must feed back into agent behavior
The biggest unmet need is closing the loop. Every competitor treats corrections as one-time events. The market opportunity is in making corrections compound — tracking patterns, surfacing trends, recommending guardrail updates.

**Design direction:** Correction history per agent. Pattern detection ("3 of the last 5 discount actions were corrected downward"). Suggested guardrail updates that the ops manager can approve with one click. The agent gets better, the human reviews less.

### Implication 4: Show agent reasoning in human language, not traces
LangSmith shows raw traces. Copilot Studio shows JSON rationale. Neither is designed for ops managers. The industry standard for "explainability" is still developer-oriented.

**Design direction:** Plain-language reasoning summaries. "I offered a 25% discount because the prospect mentioned competitor pricing and our playbook allows up to 30% for enterprise deals." Link to the specific data points and policies the agent referenced.

### Implication 5: Design for trust calibration, not just control
The research shows that too much oversight degrades both speed and quality. The goal isn't maximum control — it's appropriate control that evolves over time.

**Design direction:** Progressive autonomy. Start with "review everything," track correction rates, and surface when an agent has earned more autonomy for specific action types. Let ops managers graduate agents from supervised to semi-autonomous based on actual performance data.

---

## Appendix: Sources

- [Salesforce Agentforce — Human in the Loop (Salesforce Admins)](https://admin.salesforce.com/blog/2026/the-importance-of-human-in-the-loop-for-agentforce)
- [Salesforce Agentforce Reviews (G2)](https://www.g2.com/products/salesforce-agentforce/reviews)
- [Agentforce Reviews Analyzed (Oliv.ai)](https://www.oliv.ai/blog/salesforce-agentforce-reviews-analyzed)
- [Salesforce in 2026 (Intigris)](https://www.intigris.nl/blog-posts/salesforce-in-2026)
- [Agentforce 6-Month Review (Salesforce Ben)](https://www.salesforceben.com/agentforce-for-salesforce-help-6-month-review-and-whats-improved/)
- [Design Autonomous Agent Capabilities (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/autonomous-agents)
- [Multistage and AI Approvals in Agent Flows (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-advanced-approvals)
- [6 Core Capabilities for Agent Adoption 2026 (Microsoft)](https://www.microsoft.com/en-us/microsoft-copilot/blog/copilot-studio/6-core-capabilities-to-scale-agent-adoption-in-2026/)
- [Copilot Studio Brutally Honest Review (Ragnar Heil)](https://ragnarheil.de/the-good-the-bad-and-the-ugly-of-copilot-studio-a-brutally-honest-review-going-into-late-2025/)
- [LangChain Human-in-the-Loop Docs](https://docs.langchain.com/oss/python/langchain/human-in-the-loop)
- [LangSmith Observability](https://www.langchain.com/langsmith/observability)
- [LangSmith Reviews (Product Hunt)](https://www.producthunt.com/products/langsmith/reviews)
- [LangSmith Reviews (Slashdot)](https://slashdot.org/software/p/LangSmith/)
- [Relevance AI Approvals and Escalations (Docs)](https://relevanceai.com/docs/workforce/workforce-features/approvals-and-escalations)
- [Relevance AI Reviews (G2)](https://www.g2.com/products/relevance-ai/reviews)
- [CrewAI HITL Workflows (Docs)](https://docs.crewai.com/en/learn/human-in-the-loop)
- [A Missing Layer in Agentic Systems (CrewAI Blog)](https://blog.crewai.com/a-missing-layer-in-agentic-systems/)
- [Designing for Agentic AI (Smashing Magazine)](https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/)
- [HITL When to Use Agent Approval (Mastra)](https://mastra.ai/blog/human-in-the-loop-when-to-use-agent-approval)
- [HITL Best Practices (Permit.io)](https://www.permit.io/blog/human-in-the-loop-for-ai-agents-best-practices-frameworks-use-cases-and-demo)
- [Human-in-the-Loop Has Hit the Wall (SiliconANGLE)](https://siliconangle.com/2026/01/18/human-loop-hit-wall-time-ai-oversee-ai/)
- [Enterprise AI Agents Report (G2)](https://learn.g2.com/enterprise-ai-agents-report)
