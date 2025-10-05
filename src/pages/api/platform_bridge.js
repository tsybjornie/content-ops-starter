// platform_bridge.js
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export async function updateAdPlatform(platform, adData) {
  let url = "";
  let headers = {};

  if (platform === "meta") {
    url = `https://graph.facebook.com/v19.0/${process.env.META_AD_ACCOUNT_ID}/ads`;
    headers = { Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}` };
  } else if (platform === "tiktok") {
    url = `https://business-api.tiktok.com/open_api/v1.3/ad/create/`;
    headers = { "Access-Token": process.env.TIKTOK_ACCESS_TOKEN };
  }

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(adData),
  });

  return await resp.json();
}
