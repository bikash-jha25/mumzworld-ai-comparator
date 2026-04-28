// server/evals/run_evals.js
// Run with: node evals/run_evals.js

import { extractProduct } from "../services/extractor.js";
import { compareProducts } from "../services/comparator.js";
import { generateVerdict } from "../services/generator.js";

// ─────────────────────────────────────────
// TEST CASES
// ─────────────────────────────────────────
const TEST_CASES = [
  {
    id: 1,
    name: "Normal case — full data both products",
    inputs: [
      "Joie stroller, 9kg, 799 AED, suitable from birth",
      "Chicco stroller, 7kg, 549 AED, suitable from 6 months",
    ],
    expect: {
      bothExtracted: true,
      noMissingPrice: true,
      confidenceAbove: 0.5,
    },
  },
  {
    id: 2,
    name: "Missing data — vague descriptions",
    inputs: ["Lightweight stroller", "Premium baby stroller"],
    expect: {
      bothExtracted: true,
      hasMissingFields: true,
      confidenceBelow: 0.6,
    },
  },
  {
    id: 3,
    name: "Partial data — one has price, one has weight",
    inputs: ["Joie stroller 799 AED", "Chicco stroller 7kg"],
    expect: {
      bothExtracted: true,
      hasMissingFields: true,
    },
  },
  {
    id: 4,
    name: "Garbage input — should fail gracefully",
    inputs: ["asdfghjkl", "random text nothing"],
    expect: {
      bothExtracted: true, // fallback kicks in
      lowConfidence: true,
    },
  },
  {
    id: 5,
    name: "Conflicting data — heavy vs light labels",
    inputs: ["Stroller 5kg heavy duty", "Stroller 12kg ultra light"],
    expect: {
      bothExtracted: true,
      verdictMentionsWeight: true,
    },
  },
  {
    id: 6,
    name: "High price difference",
    inputs: [
      "Babyzen YOYO stroller, 5.5kg, 2500 AED, from birth",
      "Generic stroller, 8kg, 199 AED, from 6 months",
    ],
    expect: {
      bothExtracted: true,
      verdictMentionsPrice: true,
      confidenceAbove: 0.5,
    },
  },
  {
    id: 7,
    name: "Identical products",
    inputs: [
      "Chicco stroller, 7kg, 549 AED, from 6 months",
      "Chicco stroller, 7kg, 549 AED, from 6 months",
    ],
    expect: {
      bothExtracted: true,
      noError: true,
    },
  },
  {
    id: 8,
    name: "Arabic input",
    inputs: [
      "عربة أطفال شيكو، 7 كيلو، 549 درهم",
      "عربة أطفال جوي، 9 كيلو، 799 درهم",
    ],
    expect: {
      bothExtracted: true,
      noError: true,
    },
  },
  {
    id: 9,
    name: "Missing age range only",
    inputs: [
      "Maxi-Cosi stroller, 6.5kg, 899 AED",
      "Graco stroller, 8kg, 699 AED",
    ],
    expect: {
      bothExtracted: true,
      ageRangeMissing: true,
    },
  },
  {
    id: 10,
    name: "Very long detailed description",
    inputs: [
      "The UPPAbaby VISTA V2 is a premium full-size stroller weighing 11.5kg, priced at 3200 AED, suitable from birth, featuring all-terrain wheels, reversible seat, and extendable canopy",
      "The Bugaboo Fox 3 is a luxury stroller at 9.9kg, costs 3800 AED, from birth, with adjustable suspension and one-hand fold",
    ],
    expect: {
      bothExtracted: true,
      confidenceAbove: 0.7,
      verdictMentionsPrice: true,
    },
  },
];

// ─────────────────────────────────────────
// RUNNER
// ─────────────────────────────────────────
async function runEval(testCase) {
  const result = {
    id: testCase.id,
    name: testCase.name,
    checks: [],
    passed: 0,
    failed: 0,
    error: null,
  };

  try {
    // Extract both products
    const [p1, p2] = await Promise.all(
      testCase.inputs.map((desc) => extractProduct(desc))
    );

    const products = [p1, p2].filter(Boolean);

    // Get verdict
    const verdictResult = await generateVerdict(products);
    const verdict = verdictResult?.verdict || "";
    const confidence = verdictResult?.confidence || 0;

    // ── Run checks ──
    const { expect } = testCase;

    if (expect.bothExtracted !== undefined) {
      const ok = products.length === 2;
      result.checks.push({ check: "Both products extracted", pass: ok, detail: `Got ${products.length}/2` });
      ok ? result.passed++ : result.failed++;
    }

    if (expect.noMissingPrice) {
      const ok = products.every((p) => p.price && p.price !== "Not specified");
      result.checks.push({ check: "No missing prices", pass: ok, detail: products.map((p) => p.price).join(", ") });
      ok ? result.passed++ : result.failed++;
    }

    if (expect.hasMissingFields) {
      const ok = products.some(
        (p) =>
          p.price === "Not specified" ||
          p.weight === "Not specified" ||
          p.age_range === "Not specified"
      );
      result.checks.push({ check: "Missing fields detected", pass: ok, detail: "System correctly shows 'Not specified'" });
      ok ? result.passed++ : result.failed++;
    }

    if (expect.confidenceAbove !== undefined) {
      const ok = confidence > expect.confidenceAbove;
      result.checks.push({ check: `Confidence > ${expect.confidenceAbove}`, pass: ok, detail: `Got ${confidence.toFixed(2)}` });
      ok ? result.passed++ : result.failed++;
    }

    if (expect.confidenceBelow !== undefined) {
      const ok = confidence < expect.confidenceBelow;
      result.checks.push({ check: `Confidence < ${expect.confidenceBelow}`, pass: ok, detail: `Got ${confidence.toFixed(2)}` });
      ok ? result.passed++ : result.failed++;
    }

    if (expect.lowConfidence) {
      const ok = confidence < 0.5;
      result.checks.push({ check: "Low confidence on garbage input", pass: ok, detail: `Got ${confidence.toFixed(2)}` });
      ok ? result.passed++ : result.failed++;
    }

    if (expect.verdictMentionsWeight) {
      const ok = verdict.toLowerCase().includes("kg") || verdict.toLowerCase().includes("weight") || verdict.toLowerCase().includes("light") || verdict.toLowerCase().includes("heavy");
      result.checks.push({ check: "Verdict mentions weight", pass: ok, detail: ok ? "✓ found weight reference" : "✗ no weight mention" });
      ok ? result.passed++ : result.failed++;
    }

    if (expect.verdictMentionsPrice) {
      const ok = verdict.toLowerCase().includes("aed") || verdict.toLowerCase().includes("price") || verdict.toLowerCase().includes("cost") || verdict.toLowerCase().includes("expensive") || verdict.toLowerCase().includes("cheaper");
      result.checks.push({ check: "Verdict mentions price", pass: ok, detail: ok ? "✓ found price reference" : "✗ no price mention" });
      ok ? result.passed++ : result.failed++;
    }

    if (expect.ageRangeMissing) {
      const ok = products.some((p) => !p.age_range || p.age_range === "Not specified");
      result.checks.push({ check: "Age range correctly marked missing", pass: ok, detail: products.map((p) => p.age_range).join(", ") });
      ok ? result.passed++ : result.failed++;
    }

    if (expect.noError) {
      result.checks.push({ check: "No crash or error", pass: true, detail: "System handled gracefully" });
      result.passed++;
    }

  } catch (err) {
    result.error = err.message;
    result.failed++;
    result.checks.push({ check: "No crash", pass: false, detail: err.message });
  }

  return result;
}

// ─────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────
async function main() {
  console.log("\n🧪 Running Mumzworld AI Evals...\n");
  console.log("=".repeat(60));

  const allResults = [];
  let totalPassed = 0;
  let totalFailed = 0;

  for (const tc of TEST_CASES) {
    process.stdout.write(`\nTest ${tc.id}: ${tc.name} ... `);
    const result = await runEval(tc);
    allResults.push(result);

    const status = result.failed === 0 ? "✅ PASS" : "❌ FAIL";
    console.log(status);

    result.checks.forEach((c) => {
      const icon = c.pass ? "  ✓" : "  ✗";
      console.log(`${icon} ${c.check} — ${c.detail}`);
    });

    if (result.error) {
      console.log(`  ⚠ Error: ${result.error}`);
    }

    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // ── SUMMARY ──
  console.log("\n" + "=".repeat(60));
  console.log("📊 EVAL SUMMARY");
  console.log("=".repeat(60));

  const passedTests = allResults.filter((r) => r.failed === 0).length;
  const totalTests = allResults.length;

  allResults.forEach((r) => {
    const icon = r.failed === 0 ? "✅" : "❌";
    console.log(`${icon} Test ${r.id}: ${r.name} (${r.passed}/${r.passed + r.failed} checks)`);
  });

  console.log(`\nTests passed: ${passedTests}/${totalTests}`);
  console.log(`Total checks: ${totalPassed} passed, ${totalFailed} failed`);
  console.log(`Overall score: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(0)}%`);
  console.log("\n" + "=".repeat(60));

  // ── SAVE RESULTS TO FILE ──
  const fs = await import("fs");
  const output = {
    run_at: new Date().toISOString(),
    summary: {
      tests_passed: passedTests,
      tests_total: totalTests,
      checks_passed: totalPassed,
      checks_failed: totalFailed,
      score_pct: ((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(0) + "%",
    },
    results: allResults,
  };

  fs.writeFileSync("evals/results.json", JSON.stringify(output, null, 2));
  console.log("\n💾 Full results saved to evals/results.json");
}

main().catch(console.error);