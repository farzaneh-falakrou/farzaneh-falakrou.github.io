---
title: SplitSmart — artifact gaps (forward-look material)
date: 2026-05-17
type: note
status: identified
related:
  - .planning/notes/splitsmart-case-study-framing.md
  - C:/Users/farza/Desktop/workspace/expense_splitter/
---

# SplitSmart — artifact gaps

Gaps identified by reading the SplitSmart prototype against the locked case study thesis (*"the product problem isn't the math, it's the ask"*). These are not flaws to apologize for — they are the **honest forward-look** content that earns the case study its credibility (skeleton section 08).

Two paths forward for each gap:
- **Address before publishing the case study** — design the missing piece and include it as evidence.
- **Name it in the case study** — write it explicitly as "where this design doesn't yet go far enough."

## Gap 1 · The reminder copy is not designed

**The problem:** The thesis's strongest claim is *the system absorbs the social cost of the ask*. The artifact has a "Send reminder" button in at least three places (dashboard Needs-your-attention card; Friends list; Group-detail Debts tab). But the **content** of the reminder — what the friend actually receives — does not exist in the prototype.

This is the gap that most undermines the thesis if left unaddressed. The reminder *button* is just a button. The reminder *message* is where "the app takes the blame" actually happens. Without it, the case study claims something the artifact only gestures at.

**What would close it:**
- The reminder modal that opens when "Send reminder" is pressed: preview of the message, ability to add a personal note (optional), send button. The default copy must read as system-generated, not person-generated. ("SplitSmart auto-reminder: Mina, you have an open balance of £45.00 from Paris Trip and Work Lunch. Settle through the app whenever convenient.")
- The friend's receiving end: notification view, in-app inbox card, email template. Shows what Mina sees.
- Optionally: tone variations (gentle / direct / firm) chosen by the asker — a small lever that puts agency back in the user's hands without forcing them to write the words themselves.

**Recommendation:** Design the reminder modal before publishing. It is the single highest-leverage addition to the artifact. Even a static frame in the case study is enough — it doesn't need to be interactive.

## Gap 2 · Personal-finance widgets dilute the settlement focus

**The problem:** The dashboard contains four widgets that are textbook personal-finance dashboard moves but are off-thesis for an app whose whole pitch is "we are about settlement, not tracking":
- Spending over time (6-month bar chart)
- Monthly spend headline number (+12% lower than last month)
- By category donut (Accommodation / Food / Transport / Activities / Other)
- Insights ("Spending down 12%", "You cover 43% of Paris Trip", "Home Bills is 96% spent")

Of these, **Insights** is partly on-thesis ("Home Bills is 96% spent" is a nudge toward action). The others are conventional personal-finance affordances that any expense-tracker has. Their presence dilutes the "we lead with action, not numbers" claim.

**What would close it:**
- Cut the Spending-over-time chart and the By-category donut from the home view; relegate them to a separate Insights or Reports page. The home dashboard then has: Net position card · Needs your attention · Insights (action-oriented only) · Groups · Settled. Tighter; more aligned to thesis.
- Or: keep them but reframe them. The By-category donut could become "Where your shared spending goes" — i.e., still about group context, not personal habits.

**Recommendation:** Name this gap in the case study explicitly. Frame it as a designer's honest tradeoff: "We kept conventional personal-finance widgets to lower the unfamiliarity tax. A purer version of this thesis would cut them." This is more credible than silently shipping it as if it were fully aligned.

## Gap 3 · No edge or dispute states

**The problem:** The artifact shows the **happy path** for every flow. There are no:
- "I paid Luigi back in cash" — manual mark-as-settled without using the in-app payment
- "Mina disputed the dinner split — she only had the salad" — partial / itemized adjustment
- "This expense was already counted — duplicate" — error / merge
- "Luigi left the group with an outstanding balance" — orphaned-debt resolution
- Empty states (first-time user, empty group, settled group)
- Error states for failed payment, network issues, etc.

For an app whose thesis is about the **social contract**, the missing states are precisely where the social contract breaks down. They are also where most fintech UX actually lives, post-launch.

**What would close it:**
- Pick 1–2 of the most thesis-relevant edge cases (dispute resolution is highest-leverage) and design them as side-trips off the main flow.
- Include them in the case study as a separate subsection within Design Execution or as a callout.

**Recommendation:** Acknowledge in the case study without solving. Frame as: "This artifact shows the happy path. The next phase of this project would be the social-contract edges — disputes, partial settlements, in-cash payments. That is where the thesis would meet its hardest test."

## Lower-priority gaps (mention only if space permits)

- **Onboarding / first-time experience** — how does a new user understand the action-queue model? No empty dashboard shown.
- **Privacy / consent model around reminders** — can a friend mute reminders from you? Block? This is a real product question for a friendship-mediated tool.
- **Group archival / completion** — what happens to a Paris Trip group once everyone is settled? Disappears? Archives? The artifact doesn't say.
- **Mobile breakpoint design** — the artifact has responsive Tailwind classes but no dedicated mobile composition. For a fintech app that lives primarily on phones, this is structural.

## Process note

This gap analysis was conducted by reading the prototype HTML directly (not screenshots) against the locked thesis. The gaps are intentional surface area, not failures. Their inclusion in the case study is a strategic choice — they signal a designer who critiques their own work, which is more differentiating than a designer who pretends the artifact is finished.
