// /src/pages/api/refresh_instagram_token.js
export default async function handler(req, res) {
  try {
    const longLivedToken = process.env.INSTAGRAM_LONG_LIVED_TOKEN;
    const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${longLivedToken}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.access_token) {
      console.log('✅ Refreshed Token:', data.access_token);
      res.status(200).json({ success: true, token: data.access_token });
    } else {
      console.error('❌ Refresh failed:', data);
      res.status(400).json({ success: false, error: data });
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
