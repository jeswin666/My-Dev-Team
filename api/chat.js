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
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured. Add it in Vercel → Settings → Environment Variables." });

  try {
    const { system, messages, max_tokens } = req.body;

    const payload = JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: max_tokens || 1500,
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
          "anthropic-beta": "pdfs-2024-09-25",
          "Content-Length": Buffer.byteLength(payload),
        },
      };

      const reqAnth = https.request(options, (r) => {
        let data = "";
        r.on("data", (chunk) => (data += chunk));
        r.on("end", () => {
          try {
            const body = JSON.parse(data);
            // Extract clean error message if Anthropic returned an error
            if (body.error) {
              const msg = body.error.message || JSON.stringify(body.error);
              resolve({ status: r.statusCode, body: { error: msg } });
            } else {
              resolve({ status: r.statusCode, body });
            }
          } catch (e) {
            reject(new Error("Invalid JSON from Anthropic: " + data.slice(0, 200)));
          }
        });
      });

      reqAnth.on("error", (e) => reject(new Error("Network error: " + e.message)));
      reqAnth.write(payload);
      reqAnth.end();
    });

    return res.status(response.status).json(response.body);
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: err.message });
  }
};
