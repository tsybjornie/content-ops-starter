// cancel.js
export default async (req, res) => {
  try {
    return res.redirect("/?cancelled=true");
  } catch (err) {
    console.error("Cancel.js error:", err);
    return res.status(500).send("Redirect failed");
  }
};
