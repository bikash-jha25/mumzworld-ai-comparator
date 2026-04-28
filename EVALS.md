# EVALS.md

## How to Run

```bash
cd server
node evals/run_evals.js
```

Results are printed to console and saved to `server/evals/results.json`.

---

## Rubric

Each test case is scored on these checks:

| Criterion | What we check |
|---|---|
| Extraction accuracy | Did both products extract name, price, weight, age_range correctly? |
| Missing field handling | Are missing fields marked "Not specified" rather than hallucinated? |
| Confidence calibration | Is confidence high for rich data, low for garbage/vague input? |
| Verdict relevance | Does the verdict mention the most important differentiators? |
| Graceful failure | Does the system crash, or handle bad input cleanly? |
| JSON validity | Is the output always valid, parseable JSON? |

---

## Test Cases & Results

> Run `node evals/run_evals.js` You can paste the result from your console to here .

Test 1: Normal case — full data both products ... ✅ PASS
  ✓ Both products extracted — Got 2/2
  ✓ No missing prices — 799 AED, 549 AED
  ✓ Confidence > 0.5 — Got 0.80

Test 2: Missing data — vague descriptions ... ✅ PASS
  ✓ Both products extracted — Got 2/2
  ✓ Missing fields detected — System correctly shows 'Not specified'
  ✓ Confidence < 0.6 — Got 0.00

Test 3: Partial data — one has price, one has weight ... ✅ PASS
  ✓ Both products extracted — Got 2/2
  ✓ Missing fields detected — System correctly shows 'Not specified'

Test 4: Garbage input — should fail gracefully ... ✅ PASS
  ✓ Both products extracted — Got 2/2
  ✓ Low confidence on garbage input — Got 0.00

Test 5: Conflicting data — heavy vs light labels ... ✅ PASS
  ✓ Both products extracted — Got 2/2
  ✓ Verdict mentions weight — ✓ found weight reference

Test 6: High price difference ... ✅ PASS
  ✓ Both products extracted — Got 2/2
  ✓ Confidence > 0.5 — Got 0.80
  ✓ Verdict mentions price — ✓ found price reference

Test 7: Identical products ... ✅ PASS
  ✓ Both products extracted — Got 2/2
  ✓ No crash or error — System handled gracefully

Test 8: Arabic input ... ✅ PASS
  ✓ Both products extracted — Got 2/2
  ✓ No crash or error — System handled gracefully

Test 9: Missing age range only ... ✅ PASS
  ✓ Both products extracted — Got 2/2
  ✓ Age range correctly marked missing — Not specified, Not specified

Test 10: Very long detailed description ... ❌ FAIL
  ✓ Both products extracted — Got 2/2
  ✗ Confidence > 0.7 — Got 0.50
  ✓ Verdict mentions price — ✓ found price reference

============================================================
📊 EVAL SUMMARY
============================================================
✅ Test 1: Normal case — full data both products (3/3 checks)
✅ Test 2: Missing data — vague descriptions (3/3 checks)
✅ Test 3: Partial data — one has price, one has weight (2/2 checks)
✅ Test 4: Garbage input — should fail gracefully (2/2 checks)
✅ Test 5: Conflicting data — heavy vs light labels (2/2 checks)
✅ Test 6: High price difference (3/3 checks)
✅ Test 7: Identical products (2/2 checks)
✅ Test 8: Arabic input (2/2 checks)
✅ Test 9: Missing age range only (2/2 checks)
❌ Test 10: Very long detailed description (2/3 checks)

Tests passed: 9/10
Total checks: 23 passed, 1 failed
Overall score: 96%

============================================================



---

## Failure Modes Found

- **Test 10 (Long detailed description):** Confidence came back at 0.50 instead of
  the expected >0.70. The model had all the data it needed (weight, price, age range,
  features) but still returned a cautious mid-range confidence score. This suggests
  the model under-calibrates confidence on feature-rich inputs. Not a hallucination
  or extraction failure — the verdict and comparison were correct.

---

## What the Evals Don't Cover

- **Arabic fluency quality** — assessed manually by reading output, not automated
- **Blog readability** — subjective, reviewed by eye
- **Latency** — not measured, Groq API is consistently fast (~2–3s)
- **Schema validation failures** — Zod catches these at runtime; no separate eval needed

---

## Honest Assessment

The system handles structured inputs well and degrades gracefully on bad inputs. The main weakness is that extraction quality depends heavily on input formatting — free-form descriptions with no clear delimiters (commas, units) sometimes miss fields. This is a known limitation documented in TRADEOFFS.md.