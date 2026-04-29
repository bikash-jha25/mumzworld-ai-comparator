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

// ✅ ROBUST JSON EXTRACTOR — handles multiline blog content reliably
function extractBlogJSON(raw) {
  // Step 1: strip markdown fences
  let text = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // Step 2: try direct parse first
  try {
    return JSON.parse(text);
  } catch (_) {}

  // Step 3: extract blog_en and blog_ar using regex on raw string
  // This handles cases where newlines inside values break JSON.parse
  const enMatch = text.match(
    /"blog_en"\s*:\s*"([\s\S]*?)(?<!\\)",\s*"blog_ar"/,
  );
  const arMatch = text.match(/"blog_ar"\s*:\s*"([\s\S]*?)(?<!\\)"\s*\}/);

  if (enMatch && arMatch) {
    return {
      blog_en: enMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"'),
      blog_ar: arMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"'),
    };
  }

  // Step 4: try fixing unescaped newlines inside JSON strings
  const fixed = text.replace(
    /("blog_en"\s*:\s*")([\s\S]*?)("(?:\s*,\s*"blog_ar"))/,
    (_, open, content, close) =>
      open + content.replace(/\n/g, "\\n").replace(/"/g, '\\"') + close,
  );
  try {
    return JSON.parse(fixed);
  } catch (_) {}

  // Step 5: give up gracefully
  return null;
}

// 🔥 BLOG GENERATION FUNCTION
export async function generateBlog(products, table, verdict) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `
You are a professional content writer for a mom-focused e-commerce platform like Mumzworld.
 
Write TWO blog posts comparing these products.
 
Products:
${JSON.stringify(products, null, 2)}
 
Comparison table:
${JSON.stringify(table, null, 2)}
 
Verdict: ${verdict}
 
========================
RULES:
========================
- Use ONLY given data. DO NOT hallucinate.
- Keep product names EXACTLY as given — never translate them.
- English: friendly tone, bullet points, clear verdict.
- Arabic: natural Gulf Arabic, NOT a translation. Product names stay in English.
- Arabic script only — no mixed Unicode garbage characters.
 
========================
OUTPUT — RETURN ONLY THIS JSON, NO MARKDOWN:
========================
{"blog_en": "your english blog here", "blog_ar": "your arabic blog here"}
 
CRITICAL: The entire response must be a single line of valid JSON.
Do NOT use actual newlines inside the JSON string values — use \\n instead.
          `,
        },
      ],
      temperature: 0.4,
    });

    const raw = response.choices[0].message.content;
    console.log("Blog raw output length:", raw.length);

    const parsed = extractBlogJSON(raw);

    if (!parsed) {
      console.error("Blog parse failed. Raw:", raw.substring(0, 300));
      return {
        blog_en: "Blog generation failed — please try again.",
        blog_ar: "فشل إنشاء المقال — يرجى المحاولة مرة أخرى.",
      };
    }

    // Sanitize Arabic
    let cleanArabic = sanitizeArabic(parsed.blog_ar);
    if (!cleanArabic || cleanArabic.length < 40) {
      cleanArabic = "المحتوى غير كافٍ لتوليد مقارنة دقيقة.";
    }

    return {
      blog_en: parsed.blog_en || "Blog generation failed.",
      blog_ar: cleanArabic,
    };
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
