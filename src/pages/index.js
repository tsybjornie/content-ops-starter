import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout(provider, item) {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider, // "stripe" or "paypal"
          items: [item],
        }),
      });

      const data = await res.json();

      // Stripe returns checkout URL
      if (data.url) {
        window.location.href = data.url;
      }

      // PayPal returns ID
      if (data.id) {
        window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${data.id}`;
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>LazyMonks – Ebooks for a Simpler Life</title>
        <meta
          name="description"
          content="LazyMonks offers simple, powerful ebooks to help you chill, grow, and earn with less effort."
        />
      </Head>

      <main style={{ fontFamily: "Arial, sans-serif", padding: "2rem" }}>
        <h1 style={{ textAlign: "center", fontSize: "3rem", marginBottom: "1rem" }}>
          Welcome to LazyMonks
        </h1>
        <p style={{ textAlign: "center", fontSize: "1.2rem", marginBottom: "2rem" }}>
          4 ebooks to help you relax, grow, and profit – built for modern monks of leisure.
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
            <h2>Passive Hustle</h2>
            <p>Kickstart your income streams with minimal effort.</p>
            <button
              onClick={() =>
                handleCheckout("stripe", {
                  name: "Passive Hustle",
                  price: 9,
                  quantity: 1,
                  file: "/assets/ebooks/e1-passive-hustle.pdf",
                })
              }
              disabled={loading}
              style={{
                padding: "0.8rem",
                background: "#635bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {loading ? "Loading..." : "Buy $9"}
            </button>
          </div>

          {/* Ebook 2 */}
          <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem" }}>
            <h2>Creator OS</h2>
            <p>The ultimate system for digital creators to scale.</p>
            <button
              onClick={() =>
                handleCheckout("stripe", {
                  name: "Creator OS",
                  price: 12,
                  quantity: 1,
                  file: "/assets/ebooks/e2-creator-os.pdf",
                })
              }
              disabled={loading}
              style={{
                padding: "0.8rem",
                background: "#635bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {loading ? "Loading..." : "Buy $12"}
            </button>
          </div>

          {/* Ebook 3 */}
          <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem" }}>
            <h2>Freedom Starter</h2>
            <p>Step-by-step to break free and work on your own terms.</p>
            <button
              onClick={() =>
                handleCheckout("stripe", {
                  name: "Freedom Starter",
                  price: 15,
                  quantity: 1,
                  file: "/assets/ebooks/e3-freedom-starter.pdf",
                })
              }
              disabled={loading}
              style={{
                padding: "0.8rem",
                background: "#635bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {loading ? "Loading..." : "Buy $15"}
            </button>
          </div>

          {/* Ebook 4 */}
          <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem" }}>
            <h2>Micro SaaS</h2>
            <p>Launch profitable software products as a solopreneur.</p>
            <button
              onClick={() =>
                handleCheckout("stripe", {
                  name: "Micro SaaS",
                  price: 19,
                  quantity: 1,
                  file: "/assets/ebooks/e4-micro-saas.pdf",
                })
              }
              disabled={loading}
              style={{
                padding: "0.8rem",
                background: "#635bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {loading ? "Loading..." : "Buy $19"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

