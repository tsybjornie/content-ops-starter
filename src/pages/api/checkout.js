// src/pages/api/checkout.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Example: sell 4 ebooks
    const items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "LazyMonks Ebook Bundle",
            description: "4 ebooks to help you relax, grow, and profit.",
          },
          unit_amount: 900, // $9.00
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items,
      mode: "payment",
      success_url: `${process.env.SITE_BASE_URL}/success`,
      cancel_url: `${process.env.SITE_BASE_URL}/cancel`,
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
