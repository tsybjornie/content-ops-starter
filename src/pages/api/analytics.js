// analytics.js
import fs from "fs";

const LOG_PATH = "./brotheros_log.json";
const GUARD_LOG = "./momentum_guard_log.json";

export default async (req, res) => {
  try {
    // Load datasets
    const sales = fs.existsSync(LOG_PATH)
      ? JSON.parse(fs.readFileSync(LOG_PATH))
      : [];
    const guards = fs.existsSync(GUARD_LOG)
      ? JSON.parse(fs.readFileSync(GUARD_LOG))
      : [];

    if (!sales.length)
      return res.status(200).json({ message: "No sales data yet" });

    const totalRevenue = sales.reduce((a, b) => a + b.amount, 0);
    const totalSales = sales.length;
    const avgOrder = totalRevenue / totalSales;

    // ROI estimation (assume avg ad cost = 1/3 revenue target)
    const estSpend = totalRevenue / 3;
    const roi = totalRevenue / estSpend;

    const lastGuard = guards.length
      ? guards[guards.length - 1]
      : { action: "normal", roi: 0, growthRate: 0 };

    return res.status(200).json({
      message: "LazyMonks analytics summary",
      totalRevenue,
      totalSales,
      avgOrder,
      roi,
      lastGuard,
      updated: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Analytics error:", err);
    return res.status(500).json({ error: err.message });
  }
};
