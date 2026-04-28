# Mumzworld AI Product Comparator

**Track A — AI Engineering Intern**

An AI-powered product comparison engine for Mumzworld. A mom selects two strollers, the system extracts structured specs from free-text descriptions, generates a bilingual verdict with a confidence score, and produces a publish-ready blog post in English and Arabic — in under 5 seconds.

---

## One-Paragraph Summary

This prototype solves the product comparison problem on Mumzworld: a mom browsing strollers faces dozens of similar-looking options with no easy way to evaluate them side by side. The system takes two free-text product descriptions, extracts structured data (price, weight, age range) using LLaMA 3.3 70B via Groq, compares them across a feature table, generates an AI verdict with a calibrated confidence score, and produces a native bilingual blog post in English and Arabic. Missing data is surfaced explicitly as warnings rather than papered over. The output is grounded strictly in the input — the model says "Not specified" or "I couldn't find this information" when data is absent, never invents it.

---

## Setup — Under 5 Minutes

### Prerequisites
- Node.js v18+
- A free [Groq API key](https://console.groq.com) (no credit card required)

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/mumzworld-ai-comparator.git
cd mumzworld-ai-comparator
```

### 2. Set up the server

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```bash
cp .env.example .env
```

Open `.env` and add your Groq key:

```
GROQ_API_KEY=your_groq_api_key_here
```

Start the server:

```bash
node index.js
```

Server runs on `http://localhost:5000`. You should see:
```
Server running on port 5000
```

### 3. Set up the frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

### 4. Use it

- Open `http://localhost:5173`
- Click any two strollers to select them
- Hit **Compare These**
- Get extraction, comparison table, AI verdict, confidence score, warnings, and bilingual blog post

**Total time from clone to first output: ~3 minutes.**

---

## Project Structure

```
mumzworld-ai-comparator/
├── client/                        # React + Vite frontend
│   └── src/
│       ├── App.jsx                # Main app, language toggle, results rendering
│       ├── components/
│       │   ├── ProductCard.jsx    # Selectable product card
│       │   └── Shimmer.jsx        # Loading skeleton
│       └── data/
│           └── products.js        # Mock stroller catalog
│
├── server/                        # Node.js + Express backend
│   ├── index.js                   # Express app, /extract and /compare routes
│   ├── services/
│   │   ├── extractor.js           # LLM-powered structured data extraction
│   │   ├── comparator.js          # Feature table builder
│   │   └── generator.js           # Verdict + bilingual blog generation
│   ├── schemas/
│   │   └── productSchema.js       # Zod validation schema
│   └── evals/
│       ├── run_evals.js           # Automated eval runner
│       └── results.json           # Last eval run output
│
├── EVALS.md
├── TRADEOFFS.md
└── README.md
```

---

## API Endpoints

### `POST /extract`
Extracts structured product data from a free-text description.

**Input:**
```json
{
  "description": "Joie stroller, 9kg, 799 AED, suitable from birth"
}
```

**Output:**
```json
{
  "name": "Joie stroller",
  "price": "799 AED",
  "weight": "9kg",
  "age_range": "from birth",
  "confidence": 0.9
}
```

### `POST /compare`
Full pipeline: extract → compare → verdict → bilingual blog.

**Input:**
```json
{
  "descriptions": [
    "Joie stroller, 9kg, 799 AED, suitable from birth",
    "Chicco stroller, 7kg, 549 AED, suitable from 6 months"
  ]
}
```

**Output includes:**
- `products` — structured extraction for each product
- `table` — feature comparison rows
- `verdict` — AI-generated recommendation
- `ai_confidence` — float 0.0–1.0
- `warnings` — array of missing data alerts
- `blog_en` — English blog post
- `blog_ar` — Arabic blog post (sanitized, native Gulf copy)

---

## Features

- **Structured extraction** — LLM parses free-text into typed fields; missing data is `"Not specified"`, never guessed
- **Zod validation** — output schema enforced at runtime; malformed or empty responses are caught explicitly
- **Confidence scores** — every verdict carries a 0.0–1.0 confidence value based on data richness
- **Warnings system** — missing price, weight, or age range surfaces as a user-visible warning
- **Bilingual output** — English and Arabic blog posts generated natively, not translated; Arabic sanitized to strip Unicode artifacts from mixed-script LLM outputs
- **Language toggle** — frontend switches between EN and AR UI with proper RTL layout and Arabic font (Noto Kufi Arabic)
- **Graceful failure** — garbage input returns low confidence and fallback values, never crashes

---

## Evals

See [EVALS.md](./EVALS.md) for the full rubric, 10 test cases, and results.

**Summary: 9/10 tests passing, 96% checks passed.**

Run them yourself:

```bash
cd server
node evals/run_evals.js
```

---

## Tradeoffs

See [TRADEOFFS.md](./TRADEOFFS.md) for:
- Why this problem over the other options in the brief
- Architecture decisions and what they cost
- What was cut and why
- What gets built next

---

## Tooling

### Models
- **LLaMA 3.3 70B via Groq** — used for all three AI stages: extraction, verdict generation, and bilingual blog generation. Chosen for speed (Groq's inference is ~5–10x faster than most hosted APIs), cost (free tier sufficient for all development and evals), and strong instruction-following for structured JSON output. Temperature set to 0.2 for extraction (needs determinism), 0.3 for verdicts, 0.4 for blog generation (needs some creative variation).

### AI Coding Assistants
- **Claude (Anthropic)** — used for pair-coding throughout. Specifically: scaffolding the three-service pipeline architecture, writing the Zod schema, debugging the JSON cleaning logic (the markdown fence stripping in extractor.js and generator.js), and iterating on the Arabic prompt rules after observing Unicode bleed artifacts in early outputs.
- **Prompt iteration** — the Arabic generation prompt went through four versions. The key changes were: (1) adding explicit product name preservation rules after "ROLLER" appeared mid-Arabic-word, (2) adding Unicode range restrictions (`U+0600–U+06FF`) after Gothic and Vietnamese characters appeared, (3) adding the post-processing `sanitizeArabic()` function as a safety net independent of what the model does.

### What worked
- Groq's speed made the iteration loop fast — running a comparison end-to-end takes ~3–4 seconds, which meant prompt changes could be tested quickly
- Splitting extraction, comparison, and generation into separate services made debugging straightforward — each failure mode was isolatable
- Claude was useful for explaining *why* a prompt was failing (e.g. why the model was splitting "Stroller" into "ست" + "ROLLER") not just patching it

### What didn't work
- Early versions used a single prompt for extraction + verdict + blog. The output was inconsistent and hard to validate. Splitting into three calls added latency but made each stage reliable and testable independently
- The model at `temperature: 0.0` for blog generation produced noticeably robotic Arabic. Bumping to 0.4 improved naturalness significantly
- Asked the model to return confidence as a percentage (0–100) in early versions — it would return strings like "80%" instead of floats. Switched to explicit float instructions and the `0.0` example format in the schema

### Key prompts
The most important prompt is in `server/services/generator.js` — the Arabic blog generation prompt. The critical lines that shaped output quality:

```
- For product names, keep the FULL original English name exactly as provided
- NEVER translate, transliterate, modify, or split product names
- Write ONLY in Arabic Unicode characters (U+0600–U+06FF range)
- DO NOT include Vietnamese, Thai, Latin diacritics, Gothic letters, or any special Unicode symbols
```

These four rules eliminated the two main Arabic failure modes (name corruption, Unicode bleed) that appeared in early runs.

---

## Time Log

| Phase | Time spent |
|---|---|
| Problem selection + scoping | ~30 min |
| Backend pipeline (extractor, comparator, generator) | ~90 min |
| Prompt iteration (especially Arabic) | ~60 min |
| Zod validation + error handling | ~30 min |
| Frontend (React UI, RTL, language toggle) | ~60 min |
| Evals (writing test cases + running) | ~30 min |
| README, EVALS.md, TRADEOFFS.md | ~30 min |
| **Total** | **~5.5 hours** |

Went slightly over 5 hours on documentation. The Arabic prompt iteration took longer than expected — tracking down and fixing the Unicode bleed issue added ~20 minutes that wasn't in the original plan.

---

## AI Usage Note

- **Groq + LLaMA 3.3 70B** — all three AI pipeline stages (extraction, verdict, blog)
- **Claude (Anthropic)** — pair-coding, architecture scaffolding, prompt debugging, documentation
- **Vite + React** — frontend scaffolded with Vite, styled with Tailwind CSS
- No code was submitted without being read, understood, and in several cases rewritten by hand
- All prompts are committed in the codebase and documented above

---

## Known Limitations

- Extraction quality scales with input formatting — richly structured descriptions ("Joie stroller, 9kg, 799 AED") extract reliably; vague inputs ("lightweight stroller") return mostly "Not specified"
- Arabic output quality is assessed manually, not by automated eval — a proper production system would use an LLM-as-judge graded against Gulf-market copy standards
- Mock product data only includes price, weight, and age range — a real integration would expose safety ratings, fold type, car seat compatibility, and more
- The system compares exactly 2 products; the brief mentions 2–5 product comparison as a future direction