# Project Brief: Co-Sign

## Definition
- **Problem:** Autonomous AI agents in sales and procurement make high-stakes errors (hallucinating terms, over-promising discounts, misquoting contracts) and current tools only offer binary control — fully autonomous or fully blocked. There's no middle ground where humans can review, correct, and steer agents without killing their autonomy entirely.
- **Target user:** Operations managers and team leads at mid-to-large B2B companies who oversee 5-20+ AI agents handling sales outreach, procurement negotiations, and contract workflows. They need oversight without becoming a bottleneck.
- **Scope:** Focus on the "Provisional Action Review" flow — the moment a high-risk agent action is staged for human review. In scope: risk scoring logic, provisional card UI, correction/steering interaction, agent learning from corrections. Out of scope: agent configuration, onboarding, analytics dashboards, billing.
- **Domain:** B2B SaaS — AI agent orchestration / human-in-the-loop oversight
- **Core interaction:** The "Provisional Card" — reviewing a staged agent action, seeing the agent's reasoning and confidence, identifying conflicts with company guardrails, and providing a correction prompt that steers the agent rather than just blocking it.

## Status
- [x] Research complete
- [ ] Domain validated
- [ ] Flows designed
- [ ] Case study drafted
- [ ] Review complete

## Research Summary
<!-- Written by ux-researcher. References research/teardown.md for full details. -->
- **No competitor offers a true "provisional state."** All 5 competitors analyzed (Salesforce Agentforce, Microsoft Copilot Studio, LangChain/LangSmith, Relevance AI, CrewAI) use binary approve/reject, full escalation, or freeform feedback. None provide a structured, editable preview of a staged agent action — Co-Sign's Provisional Card is a genuine differentiator.
- **Structured correction is an unmet need.** Only LangSmith allows editing action parameters (via API, not UI), and only CrewAI retries with feedback context. No competitor offers guided correction that shows guardrail conflicts and suggests alternatives — the gap between "approve/reject" and "take over entirely" is wide open.
- **Reviewer fatigue is the #1 scaling problem.** Industry research shows HITL has "hit the wall" — humans cannot review at machine speed, flat approval queues create bottlenecks, and research suggests poorly designed human intervention can actually degrade output quality. Risk-scored prioritization and progressive autonomy are critical.
- **Agent reasoning is shown for developers, not ops managers.** LangSmith shows raw traces; Copilot Studio shows JSON rationale. No competitor presents agent reasoning in plain language designed for the non-technical operations managers who actually approve actions.
- **No competitor closes the correction-to-learning loop.** Corrections are treated as one-time events everywhere. The opportunity is tracking correction patterns over time, surfacing trends, and recommending guardrail updates — turning human oversight into agent improvement.

## Domain Flags
<!-- Written by domain-expert. References design/domain-review.md for full details. -->

## Key Flows
<!-- Written by interaction-designer. References design/flows.md for full details. -->

## Narrative Direction
<!-- Written by case-study-writer. -->

## Review Notes
<!-- Written by content-strategist + hiring-manager. -->
