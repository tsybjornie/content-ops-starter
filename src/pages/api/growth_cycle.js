// growth_cycle.js
import fs from "fs";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const LOG_PATH = "./brotheros_log.json";
const MODEL_PATH = "./recommender_model.json";
const ARCHIVE_PATH = "./archive/";
const MAX_LOG_ENTRIES = 5000;

export default async (req, res) => {
  try {
    if (!fs.existsSync(LOG_PATH)) {
      return res.status(200).json({ message: "No logs found" });
    }

    const logs = JSON.parse(fs.readFileSync(LOG_PATH));

    // 1️⃣ Archive old logs
    if (logs.length > MAX_LOG_ENTRIES) {
      if (!fs.existsSync(ARCHIVE_PATH)) fs.mkdirSync(ARCHIVE_PATH);
      const timestamp = new Date().toISOString().split("T")[0];
      fs.writeFileSync(`${ARCHIVE_PATH}/sales_${timestamp}.json`, JSON.stringify(logs, null, 2));
      fs.writeFileSync(LOG_PATH, JSON.stringify(logs.slice(-1000), null, 2));
      console.log(`📦 Archived ${logs.length - 1000} old logs`);
    }

    // 2️⃣ Refresh recommender model
    if (fs.existsSync(MODEL_PATH)) {
      const model = JSON.parse(fs.readFileSync(MODEL_PATH));
      model.updated = Date.now();
      fs.writeFileSync(MODEL_PATH, JSON.stringify(model, null, 2));
      console.log("🔁 Recommender model timestamp refreshed");
    }

    // 3️⃣ Health ping to BrotherOS hub
    await fetch(process.env.BROTHEROS_HUB + "/daily-health", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system: "LazyMonks",
        status: "healthy",
        logs: fs.existsSync(LOG_PATH) ? fs.statSync(LOG_PATH).size : 0,
        modelUpdated: fs.existsSync(MODEL_PATH),
        timestamp: Date.now(),
      }),
    });

    console.log("🌅 Growth cycle complete");
    return res.status(200).json({ message: "Growth cycle complete" });
  } catch (err) {
    console.error("Growth cycle error:", err);
    return res.status(500).json({ error: err.message });
  }
};
