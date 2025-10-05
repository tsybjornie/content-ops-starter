// recommender_trainer.js
import dotenv from "dotenv";
import fs from "fs";
import fetch from "node-fetch";

dotenv.config();

const LOG_PATH = "./brotheros_log.json";
const MODEL_PATH = "./recommender_model.json";

export default async (req, res) => {
  try {
    // 1. Load past sales
    if (!fs.existsSync(LOG_PATH)) {
      return res.status(200).json({ message: "No sales data yet" });
    }

    const sales = JSON.parse(fs.readFileSync(LOG_PATH));
    if (sales.length < 3) {
      return res
        .status(200)
        .json({ message: "Not enough data to train recommender yet" });
    }

    // 2. Count product frequencies
    const productCounts = {};
    sales.forEach((s) => {
      s.products.split(",").forEach((p) => {
        productCounts[p] = (productCounts[p] || 0) + 1;
      });
    });

    // 3. Identify top-performers
    const topProducts = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([p]) => p);

    // 4. Generate simple correlation matrix for bundle suggestion
    const correlations = {};
    sales.forEach((s) => {
      const items = s.products.split(",");
      items.forEach((a) => {
        items.forEach((b) => {
          if (a !== b) {
            correlations[a] = correlations[a] || {};
            correlations[a][b] = (correlations[a][b] || 0) + 1;
          }
        });
      });
    });

    // 5. Save recommender model
    const model = { topProducts, correlations, updated: Date.now() };
    fs.writeFileSync(MODEL_PATH, JSON.stringify(model, null, 2));

    // 6. Push to BrotherOS Hub for live update
    await fetch(process.env.BROTHEROS_HUB + "/update-recommender", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(model),
    });

    console.log("🤖 Recommender retrained → top:", topProducts);
    return res.status(200).json({
      message: "Recommender retrained",
      topProducts,
      sample: correlations[topProducts[0]],
    });
  } catch (err) {
    console.error("Recommender Trainer Error:", err);
    return res.status(500).json({ error: err.message });
  }
};
