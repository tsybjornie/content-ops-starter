// scaling_loop.js
import dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";

dotenv.config();

const LOG_PATH = "./brotheros_log.json";
const MIN_SPEND = 1000;  // minimum ad budget per cycle (USD)
const MAX_SPEND = 100000; // max allowed per cycle
const ROI_TARGET = 3.0; // target 3x return

export default async (req, res) => {
  try {
    const sales = fs.existsSync(LOG_PATH)
      ? JSON.parse(fs.readFileSync(LOG_PATH))
      : [];

    if (sales.length < 3)
      return res.status(200).json({ message: "Not enough data yet" });

    // Compute performance
    const totalRevenue = sales.reduce((a, b) => a + b.amount, 0);
    const avgOrder = totalRevenue / sales.length;
    const roi = totalRevenue / (sales.length * avgOrder * 0.33);

    // Dynamic spend allocation logic
    let newBudget = avgOrder * sales.length * 0.4;
    newBudget = Math.min(Math.max(newBudget, MIN_SPEND), MAX_SPEND);

    // ROI adjustment
    if (roi < ROI_TARGET) newBudget *= 0.8;
    else if (roi > ROI_TARGET * 1.2) newBudget *= 1.2;

    // Platform split — fetched from BrotherOS engine
    const bestPlatformResponse = await fetch(
      process.env.BROTHEROS_HUB + "/current-best"
    );
    const bestPlatformData = await bestPlatformResponse.json();
    const bestPlatform = bestPlatformData.bestPlatform || "meta";

    // Push update to BrotherOS central brain
    await fetch(process.env.BROTHEROS_HUB + "/update-budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform: bestPlatform,
        budget: newBudget,
        avgOrder,
        roi,
        timestamp: Date.now(),
      }),
    });

    console.log(
      `⚡ Auto-Scaling: ${bestPlatform} | Budget: $${newBudget.toFixed(
        2
      )} | ROI: ${roi.toFixed(2)}`
    );

    return res.status(200).json({
      message: "Scaling loop executed",
      platform: bestPlatform,
      budget: newBudget,
      roi,
    });
  } catch (err) {
    console.error("Scaling loop error:", err);
    return res.status(500).json({ error: err.message });
  }
};
