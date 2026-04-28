import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { extractProduct } from "./services/extractor.js";
import { compareProducts } from "./services/comparator.js";
import { generateVerdict } from "./services/generator.js";
import { generateBlog } from "./services/generator.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});

// 🔹 EXTRACT ROUTE
app.post("/extract", async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    const result = await extractProduct(description);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 🔥 FINAL COMPARE ROUTE (COMPLETE VERSION)
app.post("/compare", async (req, res) => {
  try {
    const { descriptions } = req.body;

    if (!descriptions || descriptions.length < 2) {
      return res.status(400).json({ error: "At least 2 products required" });
    }

    console.log("🔍 Comparing products...");

    // 🚀 PARALLEL EXTRACTION
    const results = await Promise.all(
      descriptions.map((desc) => extractProduct(desc))
    );

    const validResults = results.filter(Boolean);

    if (validResults.length < 2) {
      return res.status(400).json({
        error: "Not enough valid products after extraction",
      });
    }

    // 🔥 SMART WARNINGS
    const warnings = [];
    const allKeys = new Set();

    validResults.forEach((p) => {
      Object.keys(p.attributes || {}).forEach((key) => {
        allKeys.add(key);
      });
    });

    if (allKeys.size < 2) {
      warnings.push("Limited product data available for comparison");
    }

    validResults.forEach((p) => {
      if (!p.price || p.price === "Not specified") {
        warnings.push(`${p.name}: Missing price`);
      }
    });

    if (allKeys.size < 3) {
      warnings.push(
        "Missing attributes like features, durability, and safety across products"
      );
    }

    // ✅ comparison
    const comparison = compareProducts(validResults);

    // ✅ verdict
    const aiVerdict = (await generateVerdict(validResults)) || {
      verdict: "Insufficient data to make a confident recommendation",
      confidence: 0.2,
    };

    // ✅ blog
    const blog = (await generateBlog(
      validResults,
      comparison.table,
      aiVerdict.verdict
    )) || {
      blog_en: "Blog generation failed",
      blog_ar: "فشل إنشاء المقال",
    };

    res.json({
      success: true,
      products: validResults,
      table: comparison.table,
      verdict: aiVerdict.verdict,
      ai_confidence: aiVerdict.confidence,
      warnings,
      blog_en: blog.blog_en,
      blog_ar: blog.blog_ar,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Comparison failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
