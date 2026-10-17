# Stage 3 — follow-up formats

Load this when writing the follow-up. Default preset is **compact**; switch only
when the operator asks or the meeting's shape clearly demands it.

Templates below are in English. Translate the headings into the language the
operator chose at Stage 1 — the structure is what matters, not the wording.

## Contents

- Choosing a preset
- Preset A — compact (default)
- Preset B — by agenda
- Preset C — narrative
- Action-item phrasing
- Good and bad action items
- File layout

## Choosing a preset

| Preset | Use when | Switch away when |
|---|---|---|
| A — compact | Default. Working call, one team, ≤45 min, readers were present. | The meeting covered 4+ unrelated topics and the flat list loses the thread. |
| B — by agenda | Long or multi-topic meeting, agenda from Stage 1 had distinct blocks. | There were fewer than three topics — sections add weight for nothing. |
| C — narrative | The follow-up goes to someone who was **not** on the call: a client, an exec, a stakeholder who needs the reasoning, not just the outcome. | Readers were present — they do not need the story retold. |

State which preset you used and why, in one line, after the output.

## Preset A — compact (default)

```markdown
# Call: <topic> — <DD.MM.YYYY>

**Participants:** Anna, Mark, Dan
**Purpose:** <the Stage 1 agenda, in one line>

## Decisions

- Retries move to the worker side.
- Promo codes ship after release 2.4.

## Action items

- [ ] @Dan — build a retry prototype on the worker — by 24.10
- [ ] @Anna — confirm the vendor's rate limits — by 20.10
- [ ] @? — migration of legacy orders — owner not assigned, no date discussed

## Open questions

- Who owns the migration of legacy orders?
- Retry failure rate — no numbers were named on the call.
```

Hard limits: ≤7 decisions, ≤10 action items, no section longer than the screen.
Over the limit means Stage 2 kept noise or items need merging — fix that rather
than shipping a long follow-up.

Omit an empty section entirely, except **Open questions**: if there are none,
write "none" — its absence otherwise reads as "not looked for".

## Preset B — by agenda

Same elements, grouped under the Stage 1 agenda headings. Each section:

```markdown
## 1. Billing

**Context.** Payments fail on retries when the vendor returns a 500.
**Decision.** Retries move to the worker side.
**Actions.** @Dan — prototype — by 24.10
```

A topic that was raised and closed with no decision still gets a section with
`**Decision.** None — moved to open questions.` Silently dropping a discussed
topic makes the follow-up look like the topic never came up.

End with a single consolidated **Action items** checklist across all sections —
readers scan one list, not six.

## Preset C — narrative

Two to four paragraphs of connected prose: context, what was discussed, what was
concluded and why. Then one table:

```markdown
| # | Action | Owner | Due |
|---|---|---|---|
| 1 | Retry prototype on the worker | Dan | 24.10 |
```

The prose explains reasoning; it still may not contain anything absent from the
clean transcript. No invented rationale, however plausible.

## Action-item phrasing

- Shape: `@owner — <verb> <object> — by <date>`.
- One verb, one outcome. Split compound items.
- The verb must name a checkable act: "build a prototype", "confirm the limits",
  "send the invoice" — not "think about", "look into", "stay on top of".
- Dates absolute, `DD.MM`. A vague "by next week" from the transcript becomes a
  concrete date only if the operator confirms it; otherwise keep it verbatim and
  mark the deadline as not fixed.
- Owner must be a named participant who accepted the task. Someone volunteering
  someone absent is not acceptance — flag it: `@Dan (not on the call)`.
- Keep the owner's acceptance strength. An "I'll try if I get time" is a
  tentative item, marked as such, not a commitment.

## Good and bad action items

<examples>

<example name="vague-verb">
Transcript: "someone should probably look at the retry metrics at some point"

Bad: `- [ ] @Anna — look into retry metrics`
Good: `- [ ] @? — measure the retry failure rate — owner not assigned, no date discussed`

Nobody was named and nothing checkable was promised. Inventing Anna as the owner
manufactures a commitment; dropping the item loses a real gap. Listing it
unowned puts the decision back where it belongs, with the operator.
</example>

<example name="compound-item">
Transcript: "Dan will look at the worker and then rewrite the retry logic and
ship it by Friday"

Bad: `- [ ] @Dan — look at the worker and rewrite retry logic and ship — by Friday`
Good:
```
- [ ] @Dan — rewrite the retry logic on the worker — by 24.10
- [ ] @Dan — ship the retry change to production — by 24.10
```

Two outcomes with separate completion states. Merged, the item is half-done for
a week and nobody can say which half.
</example>

<example name="reassigned-owner">
Transcript: "let me take a look — actually no, better let Dan build the
prototype"

Bad: `- [ ] @Mark — prototype`
Good: `- [ ] @Dan (not on the call) — build the retry prototype on the worker — deadline not fixed ("by next week")`

The owner changed inside one turn, the final owner never accepted because he was
absent, and the deadline was relative. All three facts belong in the line.
</example>

<example name="decision-versus-idea">
Transcript: "we could probably move the cache to Redis at some point" / "yeah
that'd be nice"

Bad: under Decisions — "Cache moves to Redis"
Good: under Open questions — "Moving the cache to Redis was raised; no owner, no
decision."

Agreement that something would be pleasant is not a decision. Promoting it means
someone reads the follow-up and believes the work is scheduled.
</example>

</examples>

## File layout

Save to `./followups/YYYY-MM-DD-<slug>.md` — date of the **meeting**, slug from
the topic, lowercase ASCII (`2026-10-17-billing-esim.md`). Create the directory
if absent.

```markdown
<follow-up, per the chosen preset>

---

## Clean transcript

<Stage 2 output, including the uncertainty block>
```

Keeping both in one file makes every line of the follow-up checkable against
what was said, which is what lets a reader trust it without the recording.
