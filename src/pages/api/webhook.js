// webhook.js
import Stripe from "stripe";
import fetch from "node-fetch";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Send event to BrotherOS Engine
      await fetch(process.env.BROTHEROS_ENDPOINT + "/record-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "LazyMonks",
          email: session.customer_details.email,
          amount: session.amount_total / 100,
          products: session.metadata.products,
          timestamp: Date.now(),
        }),
      });

      console.log("✅ Payment verified & logged to BrotherOS");
    }

    res.status(200).send("Webhook received");
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
