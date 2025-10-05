// ad_generator.js
import fs from "fs";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const MODEL_PATH = "./recommender_model.json";
const OUTPUT_PATH = "./ads_generated.json";

export default async (req, res) => {
  try {
    if (!fs.existsSync(MODEL_PATH)) {
      return res.status(200).json({ message: "No recommender data yet" });
    }

    const model = JSON.parse(fs.readFileSync(MODEL_PATH));
    const topProducts = model.topProducts || ["Monk Focus", "Zen Workflow"];

    // simple prompt for headline generation
    const prompt = `Create 3 viral ad variations for ebooks: ${topProducts.join(
      ", "
    )}. Each ad should have:
      - Headline (max 40 chars)
      - Body copy (max 80 chars)
      - CTA (short, action-oriented)
    Tone: calm, witty, LazyMonks style.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "No response";

    fs.writeFileSync(
      OUTPUT_PATH,
      JSON.stringify({ generated: Date.now(), content }, null, 2)
    );

    // Optionally push to BrotherOS hub for live rotation
    await fetch(process.env.BROTHEROS_HUB + "/update-ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "LazyMonks", ads: content }),
    });

    console.log("🪄 AI Ad Generator updated ads successfully");
    return res.status(200).json({ message: "Ad generation complete" });
  } catch (err) {
    console.error("Ad Generator error:", err);
    return res.status(500).json({ error: err.message });
  }
};
