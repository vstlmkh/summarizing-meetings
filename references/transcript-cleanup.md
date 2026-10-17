# Stage 2 — cleaning a transcript

Load this when running Stage 2. It covers how ASR actually fails, how to decide
between reconstructing and flagging, and the shape of the output.

Examples here are in English for readability; the cleaned transcript itself is
written in the language the operator chose at Stage 1.

## Contents

- Preprocess
- Ground the rewrite in the raw lines
- ASR failure patterns
- The reconstruct-or-flag decision
- Rewriting into paragraphs
- Removing noise and profanity
- The uncertainty block
- Worked examples (five cases)

## Preprocess

Before reading for meaning, normalize the raw text:

- Strip timestamps and cue indices (`.vtt`, `.srt`), then **re-join sentences
  across cue boundaries** — ASR cues split mid-clause and reading them as lines
  produces fragmented, wrong meaning.
- Collapse consecutive lines from the same speaker into one block.
- Map speaker labels (`Speaker 1`, `Me`, `Them`, `SPEAKER_00`) to the real names
  from Stage 1. Record the mapping explicitly; an unmappable label stays
  unmapped — never assign a name by vibe.
- Note the transcript's length. For anything over ~500 lines, work through it in
  ordered sections and keep a running list of resolved terms, so a term resolved
  in section 1 is applied in section 7.

## Ground the rewrite in the raw lines

Work line by line against the raw text rather than from a remembered gist of the
call. Keep the raw line in view while writing its cleaned version, and when a
sentence feels like it needs a word the audio does not contain, that is the
signal to flag rather than to supply it. The cleaned transcript is what Stage 3
quotes from, so anything smuggled in here is invisible from that point on.

## ASR failure patterns

These are the errors worth actively hunting; they are not evenly distributed.

| Pattern | Example | How to handle |
|---|---|---|
| Dropped negation | "we are not shipping" → "we are shipping" | Verify against surrounding context any sentence that states a decision. A reversed decision is the most damaging error possible here. |
| Product / company names | a brand rendered phonetically, differently each time | Resolve once against the agenda, apply the same fix everywhere, record as one reconstruction. |
| Numbers and units | "twenty four" vs "24", "three percent" vs "30%" | Keep verbatim. Never normalize a number you are not sure of — flag it. |
| Ticket keys and IDs | "E S M fifteen four ten" → `ESM-15410` | Reconstruct only when the format is unambiguous; otherwise flag. |
| Homophone terms | "retry" / "retreat", "deploy" / "employ" | The agenda decides. If it does not, flag. |
| Code-switched terms | native-language speech with English tech words | Keep the term as spoken; do not translate it. |
| Merged speakers | one paragraph containing a question and its answer | Split by content; if the split point is unclear, mark the block as unattributed. |
| Crosstalk / overlap | interleaved half-sentences | Keep what is coherent, drop what is not, flag the gap. |

## The reconstruct-or-flag decision

Reconstruct a garbled token **only** when at least one holds:

- The agenda or participant list names it exactly.
- The same token appears elsewhere in the transcript correctly.
- The sentence is grammatically determined (only one word fits, and it changes
  nothing material).

Flag — `[?word]` or `[inaudible]` — in every other case, and **always** when the
token is a number, date, name, ticket key, URL, metric, or the verb of a
decision. For those, a plausible guess is worse than a visible gap: the operator
can fill a gap, but will not notice a confident error.

Never:

- Fill a gap from general knowledge of how such meetings usually go.
- Smooth over a gap by rewriting the sentence to not need the missing word.
- Infer an unstated owner, date or decision because it "follows logically".

## Rewriting into paragraphs

The output is readable prose, attributed by speaker — not a cleaned-up list of
utterances.

- One paragraph per connected thought, not per turn. A speaker who was
  interrupted three times while making one point gets one paragraph.
- Keep the speaker's register and hedging strength. "We probably should" must
  not become "we decided". Hedges carry the difference between a decision and an
  idea, which Stage 3 depends on.
- Short Q&A exchanges stay as an exchange — flattening them into prose loses who
  asked and who committed.
- Keep chronological order. Do not regroup by topic; that is the by-agenda
  follow-up preset's job, and reordering here hides when something was decided.
- Preserve unresolved disagreement explicitly.

## Removing noise and profanity

Remove, without comment: profanity and crude language (drop it — no asterisks,
no paraphrase of the insult, keep the substance of the sentence), personal jabs
with no content, filler and discourse padding, false starts, repeated words,
backchannel, greetings, audio troubleshooting ("can you hear me?"), and
off-agenda small talk.

Keep: anything carrying a fact, a commitment, a constraint, an objection, a
number, or a name — including when it was said casually or at the very end of
the call, where decisions often hide.

## The uncertainty block

End the Stage 2 output with this, then stop and wait for the operator.

```markdown
### Needs confirmation

**Reconstructed (please verify):**
- line 42: "e sim plus" → eSIM Plus
- line 97: "E S M fifteen four ten" → ESM-15410

**Unresolved:**
- line 58: "...a limit of [?] requests per minute" — number not recognized
- line 120: speaker unidentified (Granola: `Them`) — who promised the prototype?

**Meaning in doubt:**
- line 73: a negation may be missing — "we are (not) shipping this week"
```

If the block is empty, say so explicitly — an absent block reads as "not
checked", not as "nothing to check".

## Worked examples

Five cases covering the failure modes that recur most. Read them before the
first cleanup of a new transcript; they are what the rules above look like in
practice.

<examples>

<example name="full-cleanup">
Raw (Granola, speakers `Me` / `Them`):

```
Them: uh so can everyone hear me? yeah ok
Me: yeah you're fine
Them: so billing is a complete [expletive] mess payments are failing
Them: failing on ret... on retries yeah when the vendor returns five hundred
Me: uh-huh. and what is that as a percentage
Them: around [inaudible] percent probably need to check the metric properly
Me: ok. let me take a look. actually no better let Dan build a prototype
Them: yeah ok let's say by next week he frees up then
```

Cleaned:

```markdown
**Anna.** Billing payments are failing on retries, when the vendor returns a 500.

**Mark.** What is that as a percentage?

**Anna.** Around [?] percent — I need to check the metric properly.

**Mark.** Let's have Dan build a prototype instead.

**Anna.** Agreed, by next week.
```

What survived and why: the hedge "I need to check properly" (it keeps the number
out of the decisions list), the reassignment from Mark to Dan (the owner changed
mid-sentence), and the vague "by next week" (left vague rather than converted to
a date). The greeting, the audio check, the expletive and the false start are
gone; the substance of the expletive sentence is kept.
</example>

<example name="dropped-negation">
Raw:

```
Me: so we're shipping promo codes this week right
Them: we're shipping promo codes this week only after release two point four
```

The second line is self-contradictory: "this week" and "only after release 2.4"
cannot both hold. ASR dropped a negation.

Cleaned:

```markdown
**Mark.** Are we shipping promo codes this week?

**Anna.** [?] — the line reads "we're shipping promo codes this week only after
release 2.4". Most likely "we are *not* shipping this week; only after 2.4".
```

Flag it rather than picking the reading that sounds fluent. A reversed decision
is the most expensive error this skill can make, and the operator resolves it in
one word at Gate 2.
</example>

<example name="hedge-versus-commitment">
Raw:

```
Them: i mean we could probably move the cache to redis at some point
Me: yeah that'd be nice
```

Cleaned:

```markdown
**Anna.** We could probably move the cache to Redis at some point.

**Mark.** That would be nice.
```

Do not tighten this into "decided to move the cache to Redis". Nobody committed,
no date was named, and no objection was raised either — that combination is an
open question at Stage 3, not a decision. Preserving "probably", "at some point"
and "would be nice" is what makes that classification possible later.
</example>

<example name="unidentified-speaker">
Raw (Granola, three people on the call, two collapsed into `Them`):

```
Them: i can take the migration piece
Them: wait no i thought you were on the vendor call that week
```

Two different people are speaking under one label: the second line answers the
first. Split by content, attribute neither.

Cleaned:

```markdown
**Unidentified participant.** I can take the migration piece.

**Unidentified participant (different speaker).** You were on the vendor call
that week, weren't you?
```

Then in the uncertainty block: `line 88: who volunteered for the migration?` An
action item cannot be written from this until the operator answers.
</example>

<example name="garbled-identifiers">
Raw:

```
Me: so on e s m fifteen four ten we need the limit raised to uh thirty per minute
Them: thirteen? or thirty
Me: [inaudible]
```

Cleaned:

```markdown
**Mark.** On ESM-15410 we need the rate limit raised to [?] per minute.

**Anna.** Thirteen or thirty?

**Mark.** [inaudible]
```

`ESM-15410` is reconstructed — the format is unambiguous and the agenda names
the ticket — and listed as a reconstruction. The limit is not reconstructed: the
participants themselves could not agree whether it was 13 or 30, so no reading is
available to pick. Writing either number would invent a requirement.
</example>

</examples>
