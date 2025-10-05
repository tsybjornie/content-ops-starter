// momentum_guard.js
import dotenv from "dotenv";
import fs from "fs";
import fetch from "node-fetch";

dotenv.config();

const LOG_PATH = "./brotheros_log.json";
const GUARD_LOG = "./momentum_guard_log.json";

const ROI_MIN = 2.0;       // Minimum healthy ROI
const ROI_ALERT = 1.2;     // If ROI drops below this, throttle
const MAX_GROWTH_RATE = 1.8; // x-fold hourly growth that triggers cooldown

export default async (req, res) => {
  try {
    if (!fs.existsSync(LOG_PATH)) {
      return res.status(200).json({ message: "No sales data yet" });
    }

    const sales = JSON.parse(fs.readFileSync(LOG_PATH));
    if (sales.length < 5)
      return res.status(200).json({ message: "Not enough data to activate guard" });

    // 1. Calculate last 3 hours performance
    const now = Date.now();
    const recentSales = sales.filter((s) => now - s.timestamp < 3 * 3600 * 1000);
    const prevSales = sales.filter((s) => now - s.timestamp >= 3 * 3600 * 1000 && now - s.timestamp < 6 * 3600 * 1000);

    const recentRevenue = recentSales.reduce((a, b) => a + b.amount, 0);
    const prevRevenue = prevSales.reduce((a, b) => a + b.amount, 0);
    const growthRate = prevRevenue ? recentRevenue / prevRevenue : 1;

    // 2. Estimate ROI from total performance
    const totalRevenue = sales.reduce((a, b) => a + b.amount, 0);
    const avgOrder = totalRevenue / sales.length;
    const estSpend = totalRevenue / 3; // assumes 3x ROI target
    const roi = totalRevenue / estSpend;

    // 3. Guard decision
    let action = "normal";
    if (roi < ROI_ALERT || growthRate > MAX_GROWTH_RATE) {
      action = "cooldown";
    } else if (roi < ROI_MIN) {
      action = "reduce";
    }

    // 4. Log guard decision
    const logEntry = { timestamp: now, roi, growthRate, action };
    const existing = fs.existsSync(GUARD_LOG)
      ? JSON.parse(fs.readFileSync(GUARD_LOG))
      : [];
    existing.push(logEntry);
    fs.writeFileSync(GUARD_LOG, JSON.stringify(existing, null, 2));

    // 5. Push safety update to BrotherOS Hub
    await fetch(process.env.BROTHEROS_HUB + "/safety-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roi,
        growthRate,
        action,
        source: "LazyMonks",
        timestamp: now,
      }),
    });

    console.log(`🛡 Momentum Guard: ROI ${roi.toFixed(2)}, Growth ${growthRate.toFixed(2)}, Action → ${action}`);
    return res.status(200).json({ roi, growthRate, action });
  } catch (err) {
    console.error("Momentum Guard error:", err);
    return res.status(500).json({ error: err.message });
  }
};
