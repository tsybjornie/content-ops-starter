// src/pages/api/coinbase_webhook.js
import crypto from "crypto";

export default async function handler(req, res) {
  const secret = process.env.COINBASE_WEBHOOK_SECRET;

  if (req.method === "POST") {
    const signature = req.headers["x-cc-webhook-signature"];
    const payload = JSON.stringify(req.body);
    const computed = crypto
      .createHmac("sha256", secret)
      .update(payload, "utf8")
      .digest("hex");

    if (computed !== signature) {
      console.error("Invalid Coinbase webhook signature");
      return res.status(400).send("Invalid signature");
    }

    // ✅ Handle successful charge event
    if (req.body.event && req.body.event.type === "charge:confirmed") {
      const charge = req.body.event.data;
      console.log("💰 Coinbase Payment Confirmed:", charge.code);
      // You can trigger order fulfillment or email delivery here
    }

    return res.status(200).send("ok");
  }

  return res.status(405).send("Method not allowed");
}
