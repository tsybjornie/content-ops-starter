// src/pages/index.js
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>LazyMonks - Ebooks for a Simpler Life</title>
        <meta
          name="description"
          content="LazyMonks offers simple, powerful ebooks to help you chill, grow, and earn with less effort."
        />
      </Head>

      <main style={{ fontFamily: "Arial, sans-serif", padding: "2rem" }}>
        <h1 style={{ textAlign: "center", fontSize: "3rem", marginBottom: "1rem" }}>
          🧘 Welcome to LazyMonks
        </h1>
        <p style={{ textAlign: "center", fontSize: "1.2rem", marginBottom: "2rem" }}>
          4 ebooks to help you relax, grow, and profit — built for modern monks of leisure.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
          }}
        >
          {/* Ebook 1 */}
          <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem" }}>
            <h2>The Lazy Monk’s Guide to Productivity</h2>
            <p>Work less, achieve more. A simple system to focus only on what matters.</p>
            <a
              href="https://www.paypal.com/buy?hosted_button_id=XXXX" // replace XXXX with your PayPal button ID
              style={{
                display: "inline-block",
                background: "#0070f3",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                textDecoration: "none",
              }}
            >
              Buy Now - $29
            </a>
          </div>

          {/* Ebook 2 */}
          <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem" }}>
            <h2>The Digital Monk: Earn Online with Ease</h2>
            <p>Learn effortless ways to monetize your skills and passions online.</p>
            <a
              href="https://www.paypal.com/buy?hosted_button_id=XXXX"
              style={{
                display: "inline-block",
                background: "#0070f3",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                textDecoration: "none",
              }}
            >
              Buy Now - $29
            </a>
          </div>

          {/* Ebook 3 */}
          <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem" }}>
            <h2>Mindful Wealth: The Monk’s Guide to Money</h2>
            <p>Financial freedom with a calm mind — balance money, health, and peace.</p>
            <a
              href="https://www.paypal.com/buy?hosted_button_id=XXXX"
              style={{
                display: "inline-block",
                background: "#0070f3",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                textDecoration: "none",
              }}
            >
              Buy Now - $29
            </a>
          </div>

          {/* Ebook 4 */}
          <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem" }}>
            <h2>The Monk’s Guide to Inner Peace</h2>
            <p>Simple meditations and habits for a stress-free, joyful life.</p>
            <a
              href="https://www.paypal.com/buy?hosted_button_id=XXXX"
              style={{
                display: "inline-block",
                background: "#0070f3",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                textDecoration: "none",
              }}
            >
              Buy Now - $29
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
