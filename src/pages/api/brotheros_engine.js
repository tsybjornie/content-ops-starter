// brotheros_engine.js
import dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";

dotenv.config();

const LOG_PATH = "./brotheros_log.json";
const AD_PLATFORMS = ["meta", "tiktok", "google"];

export default async (req, res) => {
  try {
    if (req.method === "POST") {
      const { email, amount, products, timestamp } = req.body;

      // 1. Record sale locally for intelligence loop
      const record = { email, amount, products, timestamp };
      const existing = fs.existsSync(LOG_PATH)
        ? JSON.parse(fs.readFileSync(LOG_PATH))
        : [];
      existing.push(record);
      fs.writeFileSync(LOG_PATH, JSON.stringify(existing, null, 2));

      // 2. Update short-term performance metrics
      const totalRevenue = existing.reduce((a, b) => a + b.amount, 0);
      const avgOrder = totalRevenue / existing.length;

      console.log("💰 New sale logged:", amount, " | AOV:", avgOrder.toFixed(2));

      // 3. Hourly budget allocation (example weights)
      const bestPlatform =
        avgOrder > 25
          ? "meta"
          : avgOrder > 20
          ? "tiktok"
          : "google";

      const budgetMap = {
        meta: bestPlatform === "meta" ? 0.5 : 0.25,
        tiktok: bestPlatform === "tiktok" ? 0.5 : 0.25,
        google: bestPlatform === "google" ? 0.5 : 0.25,
      };

      // 4. Push live scaling data to BrotherOS central brain
      await fetch(process.env.BROTHEROS_HUB + "/update-scaling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "LazyMonks",
          metrics: {
            totalRevenue,
            avgOrder,
            bestPlatform,
            budgetMap,
            timestamp,
          },
        }),
      });

      console.log("🧠 BrotherOS scaling updated →", bestPlatform);
      return res.status(200).json({ status: "success", bestPlatform, avgOrder });
    }

    // For GET requests → show current engine status
    if (req.method === "GET") {
      const existing = fs.existsSync(LOG_PATH)
        ? JSON.parse(fs.readFileSync(LOG_PATH))
        : [];
      const totalRevenue = existing.reduce((a, b) => a + b.amount, 0);
      const avgOrder = totalRevenue / (existing.length || 1);

      return res.status(200).json({
        message: "BrotherOS Engine Active",
        totalSales: existing.length,
        totalRevenue,
        avgOrder,
      });
    }
  } catch (err) {
    console.error("BrotherOS Engine error:", err);
    return res.status(500).json({ error: "Engine failure", details: err.message });
  }
};
