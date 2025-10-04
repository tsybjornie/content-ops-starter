// src/pages/api/webhook.js
import Stripe from "stripe";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false, // Needed for Stripe signature validation
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    const buf = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        resolve(Buffer.from(data));
      });
      req.on("error", (err) => reject(err));
    });

    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      await sgMail.send({
        to: session.customer_email,
        from: process.env.SENDER_EMAIL,
        subject: "Your LazyMonks Ebook Bundle",
        html: `
          <h2>Thank you for your purchase! 🙏</h2>
          <p>Here are your ebooks:</p>
          <ul>
            <li><a href="${process.env.SITE_BASE_URL}/ebooks/ebook1.pdf">Ebook 1</a></li>
            <li><a href="${process.env.SITE_BASE_URL}/ebooks/ebook2.pdf">Ebook 2</a></li>
            <li><a href="${process.env.SITE_BASE_URL}/ebooks/ebook3.pdf">Ebook 3</a></li>
            <li><a href="${process.env.SITE_BASE_URL}/ebooks/ebook4.pdf">Ebook 4</a></li>
          </ul>
        `,
      });
    } catch (emailErr) {
      console.error("Email send error:", emailErr);
    }
  }

  res.json({ received: true });
}
