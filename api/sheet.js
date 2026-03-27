export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwS3C3dQl7AsCIh_kAluIn2avJt3mzF_Vhv2KNp8TVYjvXvDme24BGU_aUTuJqvjJXX/exec';

  try {
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    const response = await fetch(SHEET_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'text/plain' },
      body:    body,
    });

    const text = await response.text();
    return res.status(200).json({ success: true, response: text });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
