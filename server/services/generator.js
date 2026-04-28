import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ SAFE ARABIC SANITIZER (does NOT break English product names)
function sanitizeArabic(text) {
  if (!text) return text;

  return (
    text
      // Allow Arabic + English + numbers + basic punctuation
      .replace(
        /[^\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\s.,():\-•]/g,
        "",
      )
      .replace(/\s{2,}/g, " ")
      .trim()
  );
}

// 🔥 AI VERDICT FUNCTION (UNCHANGED — already good)
export async function generateVerdict(products) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `
You are an expert product reviewer for moms.

Compare these products and give a clear, practical verdict.

STRICT RULES:
- Use ONLY given data
- DO NOT hallucinate
- Mention:
  • strengths
  • weaknesses
  • missing data
- Keep it concise

Products:
${JSON.stringify(products, null, 2)}

Return ONLY VALID JSON:

{
  "verdict": "",
  "confidence": 0.0
}
          `,
        },
      ],
      temperature: 0.3,
    });

    let output = response.choices[0].message.content;

    // Clean markdown
    if (output.includes("```")) {
      const parts = output.split("```");
      output = parts.find((p) => p.trim().startsWith("{")) || output;
    }

    return JSON.parse(output.trim());
  } catch (err) {
    console.error("Verdict Error:", err.message);
    return {
      verdict: "Insufficient data to make a confident recommendation",
      confidence: 0.2,
    };
  }
}

// 🔥 BLOG GENERATION FUNCTION (FULLY FIXED)
export async function generateBlog(products, table, verdict) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `
You are a professional content writer for a mom-focused e-commerce platform like Mumzworld.

Write TWO high-quality blog posts comparing these products:

1. English version
2. Arabic version (write natively, NOT a translation)

Products:
${JSON.stringify(products, null, 2)}

Comparison table:
${JSON.stringify(table, null, 2)}

Verdict:
${verdict}

========================
STRICT GLOBAL RULES:
========================
- Use ONLY given data
- DO NOT hallucinate
- Mention missing information clearly

========================
ENGLISH RULES:
========================
- Structured and easy to read
- Keep tone friendly for moms
- Use bullet points

========================
PRODUCT NAME RULE:
========================
- ALWAYS keep full product names EXACTLY as given
- NEVER translate or modify names
- Example: "Chicco Lightweight Stroller" must stay EXACT

========================
ARABIC STYLE REQUIREMENTS (CRITICAL):
========================
- Write in natural, fluent Modern Standard Arabic
- Do NOT translate word-for-word from English
- Use a friendly, conversational tone suitable for mothers
- Avoid robotic or repetitive sentences
- Keep it simple, clear, and human-like

========================
ARABIC SCRIPT RULES:
========================
- Use Arabic script only
- NO mixed languages (except product names)
- NO random Unicode characters
- Numbers can be 123 or ١٢٣

========================
ARABIC FORMAT:
========================
- Title
- Short introduction (2–3 lines)
- Bullet comparison using "•"
- Clear final verdict

========================
OUTPUT FORMAT (STRICT JSON):
========================

{
  "blog_en": "",
  "blog_ar": ""
}

NO markdown.
NO explanations.
ONLY JSON.
          `,
        },
      ],
      temperature: 0.4,
    });

    let output = response.choices[0].message.content;

    // Clean markdown if exists
    if (output.includes("```")) {
      const parts = output.split("```");
      output = parts.find((p) => p.trim().startsWith("{")) || output;
    }

    output = output.trim();

    try {
      const parsed = JSON.parse(output);

      // ✅ SANITIZE Arabic safely
      let cleanArabic = sanitizeArabic(parsed.blog_ar);

      // ✅ Fallback if Arabic looks broken
      if (!cleanArabic || cleanArabic.length < 40) {
        cleanArabic = "المحتوى غير كافٍ لتوليد مقارنة دقيقة.";
      }

      return {
        blog_en: parsed.blog_en,
        blog_ar: cleanArabic,
      };
    } catch (parseError) {
      console.error("JSON Parse Failed:", output);

      return {
        blog_en: "Parsing failed — model returned invalid JSON",
        blog_ar: "فشل تحليل البيانات",
      };
    }
  } catch (err) {
    console.error("Blog Error:", err.message);

    return {
      blog_en: "Failed to generate blog",
      blog_ar: "فشل إنشاء المقال",
    };
  }
}

// import dotenv from "dotenv";
// import Groq from "groq-sdk";

// dotenv.config();

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// // 🔥 AI VERDICT FUNCTION
// export async function generateVerdict(products) {
//   try {
//     const response = await groq.chat.completions.create({
//       model: "llama-3.3-70b-versatile",
//       messages: [
//         {
//           role: "user",
//           content: `
// You are an expert product reviewer for moms.

// Compare these products and give a clear, practical verdict.

// STRICT RULES:
// - Use ONLY given data
// - DO NOT hallucinate
// - Mention:
//   • strengths
//   • weaknesses
//   • missing data
// - Keep it concise

// Products:
// ${JSON.stringify(products, null, 2)}

// Return ONLY VALID JSON:

// {
//   "verdict": "",
//   "confidence": 0.0
// }
//           `,
//         },
//       ],
//       temperature: 0.3,
//     });

//     let output = response.choices[0].message.content;

//     // ✅ CLEAN RESPONSE
//     if (output.includes("```")) {
//       const parts = output.split("```");
//       output = parts.find((p) => p.trim().startsWith("{")) || output;
//     }

//     output = output.trim();

//     return JSON.parse(output);
//   } catch (err) {
//     console.error("Verdict Error:", err.message);
//     return {
//       verdict: "Insufficient data to make a confident recommendation",
//       confidence: 0.2,
//     };
//   }
// }

// // 🔥 BLOG GENERATION FUNCTION (FINAL FIXED VERSION)
// export async function generateBlog(products, table, verdict) {
//   try {
//     const response = await groq.chat.completions.create({
//       model: "llama-3.3-70b-versatile",
//       messages: [
//         {
//           role: "user",
//           content: `
// You are a professional content writer for a mom-focused e-commerce platform like Mumzworld.

// Write TWO high-quality blog posts comparing these products:

// 1. English version
// 2. Arabic version (write natively, NOT translation)

// Products:
// ${JSON.stringify(products, null, 2)}

// Comparison table:
// ${JSON.stringify(table, null, 2)}

// Verdict:
// ${verdict}

// STRICT RULES:
// - Use ONLY given data
// - DO NOT hallucinate
// - Mention missing information clearly
// - English must be structured and readable

// - For product names, keep the FULL original English name exactly as provided.
// - NEVER translate, transliterate, modify, or split product names.
// - Brand and product names must remain in English even in Arabic output.
// - Example: "Babyzen YOYO" must remain exactly "Babyzen YOYO"

// ARABIC STRICT RULES:
// - Use ONLY Arabic language
// - DO NOT mix any other language
// - DO NOT include English, symbols, or foreign scripts
// - EXCEPTION: Product and brand names MUST remain in English exactly as given
// - Write naturally and fluently for Gulf audience
// - If unsure, simplify instead of mixing languages

// FORMAT:

// ENGLISH BLOG:
// - Title
// - Short intro
// - Bullet comparison
// - Final verdict

// ARABIC BLOG:
// - Title
// - Intro
// - Comparison
// - Verdict

// Return ONLY VALID JSON.
// No explanations. No markdown.

// {
//   "blog_en": "",
//   "blog_ar": ""
// }
//           `,
//         },
//       ],
//       temperature: 0.4,
//     });

//     let output = response.choices[0].message.content;

//     // ✅ CLEAN RESPONSE
//     if (output.includes("```")) {
//       const parts = output.split("```");
//       output = parts.find((p) => p.trim().startsWith("{")) || output;
//     }

//     output = output.trim();

//     // ✅ SAFE PARSING
//     try {
//       return JSON.parse(output);
//     } catch (parseError) {
//       console.error("JSON Parse Failed:", output);

//       return {
//         blog_en: "Parsing failed — model returned invalid JSON",
//         blog_ar: "فشل تحليل البيانات",
//       };
//     }
//   } catch (err) {
//     console.error("Blog Error:", err.message);

//     return {
//       blog_en: "Failed to generate blog",
//       blog_ar: "فشل إنشاء المقال",
//     };
//   }
// }
