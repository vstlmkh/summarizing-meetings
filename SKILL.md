---
name: summarizing-meetings
description: >
  Turn a raw meeting transcript (Granola, Zoom, Meet, any ASR text) into a clean
  readable record and a compact follow-up with action items. Runs three gated
  stages: the operator states the agenda, the transcript is repaired and
  rewritten into clean paragraphs with ASR gaps flagged rather than invented,
  then decisions, action items and open questions are extracted into a short
  follow-up saved as Markdown. Every claim is grounded in a quote from the
  transcript. Use when the user has a call transcript, Granola note or recording
  text and wants a follow-up, meeting notes, summary, minutes, action items or
  "what did we decide on the call" — in any language the operator writes in. Not
  for live note-taking during a call and not for summarizing documents or chat
  threads.
license: MIT
---

# summarizing-meetings

A transcript is not a document: ASR drops words, mangles names and terms, merges
speakers, and records thinking-out-loud that was never a decision. Summarizing it
in one pass produces confident fiction — invented action items, owners who never
agreed, decisions that were only ideas. This skill forces three gated stages so
each failure mode is caught where it is cheap: **agenda → clean transcript →
follow-up**.

## Contents

- Workflow (Stage 1 agenda, Stage 2 clean transcript, Stage 3 follow-up)
- Grounding rule
- Working with long transcripts
- Scope and safety
- Gotchas
- References

## Workflow

Copy this checklist and tick each item as you go. **Each stage ends with a gate:
show the result and wait for the operator before moving on.** Never run all three
stages silently in one reply — the gates exist because a wrong reading of the
transcript is cheap to fix at Stage 2 and expensive to fix after the follow-up
has been sent to the team.

```
- [ ] Stage 1: Agenda & intake  — collect agenda, participants, date, language, source
- [ ] Gate 1: operator confirms or corrects the agenda
- [ ] Stage 2: Clean transcript — repair gaps, cut noise, rewrite as paragraphs
- [ ] Gate 2: operator resolves the [?] list and confirms
- [ ] Stage 3: Follow-up      — decisions, action items, open questions → file
- [ ] Gate 3: operator approves before anything leaves the file (Jira, chat, wiki)
```

Write every stage's output in the language the operator chose at Stage 1, which
is often not the language of this skill file. Address the operator in the
language they write in.

### Stage 1 — Agenda & intake

Ask the operator, in one short message, only for what is missing:

1. **Agenda / purpose** — what the call was about, in their words. This is the
   spine of Stage 2: it is what lets a garbled token be reconstructed as a real
   product term instead of a guess.
2. **Participants** — names and roles. Needed to map `Speaker 1` / `Me` / `Them`
   onto real people and to validate action-item owners.
3. **Meeting date** — for the filename and the header; transcripts are often
   processed days later, so today's date is usually wrong.
4. **Language** — of the cleaned transcript and of the follow-up, asked
   separately. A team often speaks one language and reports in another.
5. **Transcript** — pasted text or a file path (`.md`, `.txt`, `.vtt`, `.srt`,
   `.json`). Read the file end to end before starting; a decision reversed in the
   last two minutes of a call is the single most common thing a partial read
   misses.

Also capture anything the operator says about **what matters** (a decision they
are waiting on, a stakeholder the follow-up is for). Record it — it ranks the
Stage 3 output.

When the operator pastes material inline, hold it in tagged form so instructions
and source are never confused with each other:

```xml
<agenda>…the operator's agenda…</agenda>
<participants>…names and roles…</participants>
<transcript source="granola" date="2026-10-17">
…raw transcript…
</transcript>
```

If the operator gives no agenda, derive a provisional one from the transcript,
present it as a 3–5 bullet list, and ask them to confirm. That confirmation **is**
Gate 1.

### Stage 2 — Clean transcript

Produce a readable rewrite of what was actually said. Rules, in priority order:

- **Write a marker where a word is unrecoverable.** Put `[?word]` for a token you
  can partially hear and `[inaudible]` where nothing survives. Reconstruct only
  when the agenda, surrounding sentences or a later repetition make the word
  unambiguous, and list every reconstruction in the uncertainty block so the
  operator can veto it. A visible gap costs the operator five seconds; a
  confident wrong word ships to the whole team unnoticed.
- **Drop profanity and crude language, keep the substance of the sentence.** Write
  the point that was being made, without the expletive and without a paraphrase
  of the insult — the follow-up's readers include people who were not on the call.
  The same applies to personal jabs that carry no content.
- **Drop filler**: hesitation sounds, false starts, repeated words, backchannel,
  greetings, audio troubleshooting, and small talk unrelated to the agenda.
- **Write paragraphs, not utterance lines.** Group a speaker's connected thought
  into one coherent paragraph attributed by real name. Keep the register as
  spoken: a hedge stays a hedge, because Stage 3 decides decision-versus-idea
  purely from that strength.
- **Copy every number, date, name, ticket key, URL and metric verbatim.** If one
  is garbled, flag it — these are the parts a wrong guess damages most.
- **Show disagreement that stayed unresolved**, rather than writing the version
  that sounds settled.

End Stage 2 with an **uncertainty block** — reconstructions you made and gaps
still unresolved, each with a line reference. Then stop and ask the operator to
fill or confirm them. That is Gate 2.

Procedure, ASR failure patterns and worked examples:
[references/transcript-cleanup.md](references/transcript-cleanup.md).

### Stage 3 — Follow-up

Write the follow-up from the **cleaned** transcript, in the language chosen at
Stage 1. Default format is compact `Decisions → Action items → Open questions`;
the presets and full templates are in
[references/followup-formats.md](references/followup-formats.md).

Extraction rules:

- **Record as a decision only what was agreed.** "Let's do X" + no objection + the
  conversation moves on = decision. "We could do X" with no closure = open
  question. When the transcript leaves it genuinely ambiguous, put it under Open
  questions — an over-listed open question costs one line, a fabricated decision
  costs a sprint.
- **Give every action item an owner, an action and a due date.** Where the
  transcript has no owner or no date, write `@? — owner not assigned` or
  `no date discussed`, so the gap is visible to the people who can close it.
- **One verb, one outcome per item.** Split compound commitments in two.
- **Keep it to a screen: ≤7 decisions, ≤10 action items.** Going over means Stage
  2 kept noise or items need merging — fix that rather than shipping a long
  follow-up. Readers who skim a long follow-up miss their own action item, which
  defeats the artifact.
- **Ground every line in the transcript** — see the grounding rule below.

Save to `./followups/YYYY-MM-DD-<slug>.md` (create the directory if needed; the
date is the meeting's date), then print the follow-up in the reply. Attach the
clean transcript below a `---` separator in the same file, so any claim is
checkable without the recording.

## Grounding rule

Before writing any decision, action item or open question, locate the exact
transcript lines that support it and hold them in `<quotes>` tags as you work.
Each follow-up line must trace to at least one quote; drop anything that does
not. Quoting first is what keeps attention on what was actually said instead of
on what a meeting like this usually concludes — it is the main defense against a
fluent, plausible, invented follow-up.

The quotes are working material, not output: they stay in the clean transcript,
and the follow-up stays compact. Surface a quote in the reply only when the
operator questions a specific line.

## Working with long transcripts

For anything over roughly 500 lines or 20k tokens:

- Keep the transcript at the top of your working context, above the agenda and
  the instructions — reasoning placed after the data is measurably more accurate
  on long inputs.
- Work through it in ordered sections and maintain a running glossary of resolved
  terms, so a term resolved in section 1 is applied identically in section 7.
- Re-read the final minutes of the call before writing the follow-up; decisions
  and reversals cluster there, after the formal agenda is done.

## Scope and safety

Produce exactly two artifacts: the follow-up file and the reply that shows it.
Skip extra scaffolding — a separate action-items file, a tracker export, a
template for next time — unless the operator asks. If you write a temporary file
while working, delete it before finishing.

Editing and re-reading local files under `./followups/` is reversible; act
freely there. Anything that other people can see — creating Jira issues,
publishing to Confluence or the wiki, sending the follow-up to a chat or by
email — happens only after the operator approves that specific step, and only
after you show exactly what will be created and where. A follow-up sent to the
wrong channel cannot be recalled, and a Jira issue created from a misread
commitment assigns work nobody agreed to.

## Gotchas

- **Granola's note is not the transcript.** The default Granola view is an
  AI-enhanced summary; summarizing it gives a summary of a summary with errors
  baked in. Ask for the raw transcript (Granola: note → transcript tab → copy, or
  export). If the operator supplies only the enhanced note, say so and proceed
  under that caveat rather than treating it as source material.
- **Granola speaker labels are `Me` / `Them`.** A multi-person call collapses
  every other participant into `Them`. Attribute a line only when its content
  makes the speaker certain; otherwise mark the speaker as unidentified and put
  the attribution question in the Gate 2 uncertainty list.
- **ASR mangles product and company names consistently**, not randomly: the same
  wrong token recurs. Resolve it once against the agenda, apply the same fix
  everywhere, and record it as one reconstruction rather than twenty.
- **ASR drops negation.** "we will not ship" → "we will ship" is a common,
  catastrophic error, and inflected languages make it likelier because the
  negation is a short unstressed particle. Re-read every decision sentence
  against the surrounding turns before it enters the follow-up.
- **Timestamps in `.vtt` / `.srt` split sentences mid-thought.** Strip timestamps
  and re-join across cue boundaries before reading for meaning.
- **"I'll take a look" is not an action item** unless it has an object and a
  deadline. Soft commitments inflate the list and kill trust in it.
- **An owner volunteered in absentia has not accepted.** Transcripts routinely
  assign work to someone who was not on the call. List the item and mark the
  owner as absent so the operator notifies them — an unflagged item looks agreed
  and silently never starts.

## References

- [references/transcript-cleanup.md](references/transcript-cleanup.md) — Stage 2
  procedure: ASR failure patterns, reconstruct-or-flag rules, the uncertainty
  block format, and five worked examples. Load it when running Stage 2.
- [references/followup-formats.md](references/followup-formats.md) — the three
  follow-up presets (compact, by-agenda, narrative), action-item phrasing with
  good/bad pairs, and the file layout. Load it when running Stage 3.
