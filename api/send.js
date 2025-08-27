import fetch

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  try {
    const { content, username } = req.body || {};
    const webhookUrl = process.env.WEBHOOK_URL;

    if (!webhookUrl) {
      throw new Error("WEBHOOK_URL 환경변수가 설정되지 않았습니다.");
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: content || "빈 메시지",
        username: username || "Roblox Bot",
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Webhook 전송 실패: ${text}`);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
