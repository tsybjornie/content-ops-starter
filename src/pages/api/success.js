// success.js
import dotenv from "dotenv";
import fetch from "node-fetch";
import sgMail from "@sendgrid/mail";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async (req, res) => {
  try {
    const { email, items } = req.query;

    // Email content
    const message = {
      to: email,
      from: "hello@lazymonks.com",
      subject: "📚 Your LazyMonks Ebook Purchase is Complete!",
      html: `
        <h2>Hey there, monk-in-training 🧘</h2>
        <p>Thank you for your purchase! Here are your downloads:</p>
        <ul>
          ${items
            .split(",")
            .map(
              (item) =>
                `<li><a href="https://lazymonks.com/ebooks/${item}.pdf">${item}</a></li>`
            )
            .join("")}
        </ul>
        <p>Stay lazy, stay wise.<br/>– The LazyMonks Team</p>
      `,
    };

    await sgMail.send(message);
    return res.redirect("/thank-you");
  } catch (err) {
    console.error("Success.js error:", err);
    return res.status(500).send("Error delivering ebooks.");
  }
};
