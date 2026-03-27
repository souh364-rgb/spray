const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwS3C3dQl7AsCIh_kAluIn2avJt3mzF_Vhv2KNp8TVYjvXvDme24BGU_aUTuJqvjJXX/exec';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Safely stringify whatever Vercel gives us
    let body;
    if (typeof req.body === 'string') {
      body = req.body;
    } else if (req.body && typeof req.body === 'object') {
      body = JSON.stringify(req.body);
    } else {
      body = '{}';
    }

    // Forward to Google Apps Script
    const gRes = await fetch(SHEET_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'text/plain' },
      body:    body,
    });

    // Google Apps Script always returns 200 even on error
    const text = await gRes.text();

    let parsed;
    try { parsed = JSON.parse(text); } catch(_) { parsed = { raw: text }; }

    return res.status(200).json({ ok: true, google: parsed });

  } catch (err) {
    return res.status(200).json({ ok: false, error: err.message });
  }
}
