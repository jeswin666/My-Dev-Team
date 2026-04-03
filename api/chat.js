const https = require("https");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey)
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });

  try {
    const { system, messages, max_tokens } = req.body;

    const payload = JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: max_tokens || 1000,
      system,
      messages,
    });

    const response = await new Promise((resolve, reject) => {
      const options = {
        hostname: "api.anthropic.com",
        path: "/v1/messages",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Length": Buffer.byteLength(payload),
        },
      };

      const reqAnth = https.request(options, (r) => {
        let data = "";
        r.on("data", (chunk) => (data += chunk));
        r.on("end", () => {
          try {
            resolve({ status: r.statusCode, body: JSON.parse(data) });
          } catch (e) {
            reject(new Error("Invalid JSON from Anthropic"));
          }
        });
      });

      reqAnth.on("error", reject);
      reqAnth.write(payload);
      reqAnth.end();
    });

    return res.status(response.status).json(response.body);
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: err.message });
  }
};
