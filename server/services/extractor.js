import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function extractProduct(description) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `
Extract product information from this description.

Description:
"${description}"

IMPORTANT:
- The product name is usually the FIRST part of the sentence
- Extract a meaningful product name
- Example:
  "Joie stroller, 9kg, 799 AED" → name = "Joie stroller"

Return ONLY VALID JSON:

{
  "name": "",
  "price": "",
  "weight": "",
  "age_range": "",
  "confidence": 0.0
}

Rules:
- If any field is missing → "Not specified"
- Do NOT add explanations
- Output MUST be valid JSON
          `,
        },
      ],
      temperature: 0.2,
    });

    let output = response.choices[0].message.content;

    // ✅ CLEAN RESPONSE (remove markdown if exists)
    if (output.includes("```")) {
      const parts = output.split("```");
      output = parts.find((p) => p.trim().startsWith("{")) || output;
    }

    output = output.trim();

    // ✅ SAFE JSON PARSE
    let parsed;
    try {
      parsed = JSON.parse(output);
    } catch (parseError) {
      console.error("❌ JSON Parse Failed:", output);

      // fallback
      return {
        name: description.split(",")[0],
        price: "Not specified",
        weight: "Not specified",
        age_range: "Not specified",
        confidence: 0,
      };
    }

    // 🔥 IMPORTANT FIX: Ensure name is always present
    if (!parsed.name || parsed.name === "Not specified") {
      parsed.name = description.split(",")[0];
    }

    return parsed;

  } catch (err) {
    console.error("❌ Extraction Error:", err.message);

    return {
      name: description.split(",")[0],
      price: "Not specified",
      weight: "Not specified",
      age_range: "Not specified",
      confidence: 0,
    };
  }
}