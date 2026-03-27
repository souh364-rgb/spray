export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const API_ID    = '79897418727982696563';
  const API_TOKEN = 'uZHYgiUtaLA51SQcxoB0qKyCIER9zvGlJwTDjMdnhk6f2P3mspWO4b7VNFX8re';

  try {
    const payload = req.body;

    const response = await fetch('https://api.guepex.app/v1/parcels/', {
      method: 'POST',
      headers: {
        'X-API-ID':     API_ID,
        'X-API-TOKEN':  API_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    return res.status(response.status).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
