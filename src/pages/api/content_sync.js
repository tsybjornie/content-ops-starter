// content_sync.js
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const MODEL_PATH = "./recommender_model.json";
const ADS_PATH = "./ads_generated.json";
const CONTENT_PATH = "./homepage_content.json";

export default async (req, res) => {
  try {
    const model = fs.existsSync(MODEL_PATH)
      ? JSON.parse(fs.readFileSync(MODEL_PATH))
      : { topProducts: ["Monk Focus"] };

    const ads = fs.existsSync(ADS_PATH)
      ? JSON.parse(fs.readFileSync(ADS_PATH))
      : { content: "Find your calm today." };

    const top = model.topProducts[0];
    const heroText = `Discover ${top} — the ebook that everyone's quietly talking about.`;
    const banner = ads.content.split("\n")[0] || "Stay Lazy. Stay Sharp.";

    const content = {
      hero: heroText,
      banner,
      updated: new Date().toISOString(),
    };

    fs.writeFileSync(CONTENT_PATH, JSON.stringify(content, null, 2));
    console.log("🌄 Homepage content refreshed:", heroText);

    return res.status(200).json({ message: "Content sync complete", content });
  } catch (err) {
    console.error("Content sync error:", err);
    return res.status(500).json({ error: err.message });
  }
};
