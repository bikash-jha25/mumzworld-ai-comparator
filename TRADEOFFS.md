# TRADEOFFS.md

## Why This Problem

Mumzworld sells thousands of products across overlapping categories. A mom landing on the strollers
page faces a wall of options — similar names, similar specs, no easy way to compare. The decision
is high-stakes (strollers are expensive, safety-critical, and used daily) and the buyer is often
time-poor.

I considered several problems from the brief before picking this one:

| Problem considered                  | Why I rejected it                                                       |
| ----------------------------------- | ----------------------------------------------------------------------- |
| Voice memo → shopping list          | Requires audio input pipeline; too much infrastructure for 5 hours      |
| Customer service email triage       | Lower visual impact; harder to demo end-to-end in a Loom                |
| Gift finder                         | Fun, but output quality is hard to evaluate — too subjective            |
| Review synthesizer ("Moms Verdict") | Strong idea, but requires scraping or a large review dataset            |
| **Product comparison generator**    | ✅ Real use case, demonstrable output, evaluatable, bilingual by design |

The comparison generator won because it sits at the intersection of real engineering (extraction,
validation, structured output) and genuine user value. A mom can select two strollers and get a
publish-ready bilingual verdict in under 5 seconds. That felt like the most honest answer to
"what would Mumzworld actually ship?"

---

## Architecture Choices

### Extraction → Compare → Generate pipeline

I split the system into three discrete services rather than one monolithic prompt. This was a
deliberate tradeoff:

**Why:** Each stage has a different failure mode. Extraction fails when input is ambiguous.
Comparison fails when fields are missing. Generation fails when the model hallucinates. Keeping
them separate means I can test, debug, and swap each stage independently.

**Cost:** Three LLM calls per comparison instead of one. At Groq's speed (~500ms per call) this
adds ~1 second of latency. Acceptable for a prototype; in production I would batch or cache
extraction results.

### Groq + LLaMA 3.3 70B

I chose Groq over OpenAI/Anthropic for two reasons: it is free at prototype scale, and its
inference speed (tokens/second) is significantly faster than most hosted alternatives — important
for a product where the user is waiting on-screen.

LLaMA 3.3 70B was the strongest free model available on OpenRouter/Groq at the time of building.
It handles Arabic reasonably well and follows structured JSON instructions reliably at
`temperature: 0.2–0.4`.

**Known weakness:** The model occasionally bleeds non-Arabic Unicode characters (Vietnamese
diacritics, Gothic glyphs) into Arabic output. I added a post-processing sanitizer in
`generator.js` that strips these characters while preserving Arabic script, English product
names, and standard punctuation.

### Zod schema validation

I added Zod validation on the extracted product schema rather than trusting raw LLM output.
This catches silent failures — empty strings passed off as valid data, missing required fields,
wrong types. The brief explicitly penalises "malformed JSON or fields filled with empty strings
to pass" — Zod is the direct answer to that.

### Confidence scores

Every verdict includes a confidence score (0.0–1.0). This is not a post-hoc decoration — it is
returned by the model as part of the structured output and reflects how much usable data was
available. Low confidence on garbage input, high confidence on rich structured input. The
frontend renders this as a labeled progress bar (High / Medium / Low) so the user always knows
how much to trust the output.

---

## What I Cut

| Feature                                                         | Why I cut it                                                            | What would make me reconsider                 |
| --------------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------- |
| Image input (multimodal)                                        | Would require product images in the dataset; out of scope for mock data | Real Mumzworld catalog with image URLs        |
| More product attributes (safety rating, fold type, canopy size) | Mock data only has price, weight, age range                             | A richer product feed or scraping alternative |
| Storing comparisons in a database                               | Not needed for a prototype demo                                         | Any multi-user or history feature             |
| Fine-tuning on Mumzworld copy                                   | Requires labeled data and GPU budget                                    | A dataset of existing Mumzworld blog posts    |
| Streaming responses                                             | Would improve perceived latency                                         | Moving to a streaming-capable frontend setup  |
| Voice input                                                     | Interesting but outside core comparison use case                        | A "describe what you need" entry point        |

---

## Handling Uncertainty

The system never invents data. If a field is missing from the input, it is marked `"Not specified"`
rather than guessed. The verdict prompt explicitly instructs the model to mention missing
information rather than paper over it. Warnings are surfaced to the user ("Missing price for
Product X") so they know what the comparison is and is not based on.

This is a deliberate product decision, not just a safety measure. A mom reading a verdict that
says "we couldn't find durability data for this stroller" trusts the system more than one that
confidently fills in a number it made up.

---

## What I Would Build Next

1. **Expand attributes** — fold mechanism, weight capacity, compatibility with car seats, safety
   certifications. The pipeline supports any structured field; the bottleneck is data richness.

2. **Real product catalog integration** — replace mock data with a live or cached Mumzworld
   product feed. The extraction layer already handles free-text descriptions; connecting it to
   real PDPs is mostly a data plumbing problem.

3. **Multimodal input** — let the user photograph a product tag or packaging. The extraction
   prompt is already designed to handle unstructured input; adding vision is an API parameter
   change.

4. **Evaluation on Arabic fluency** — current evals check extraction and confidence numerically.
   Arabic output quality is assessed manually. A proper eval would use a native Arabic speaker
   rubric or an LLM-as-judge prompt graded against Gulf-market copy standards.

5. **Comparison history** — save past comparisons so a mom can return to a comparison she ran
   last week without re-running the AI call.
