const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwS3C3dQl7AsCIh_kAluIn2avJt3mzF_Vhv2KNp8TVYjvXvDme24BGU_aUTuJqvjJXX/exec';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    console.log('[sheet] forwarding:', body.slice(0, 200));

    const response = await fetch(SHEET_URL, {
      method:   'POST',
      headers:  { 'Content-Type': 'text/plain;charset=utf-8' },
      body:     body,
      redirect: 'follow',
    });

    const text = await response.text();
    console.log('[sheet] google status:', response.status, '| body:', text.slice(0, 300));

    let parsed;
    try { parsed = JSON.parse(text); } catch(_) { parsed = { raw: text }; }

    return res.status(200).json({ success: true, google: parsed });

  } catch (err) {
    console.error('[sheet] error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwS3C3dQl7AsCIh_kAluIn2avJt3mzF_Vhv2KNp8TVYjvXvDme24BGU_aUTuJqvjJXX/exec';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    console.log('[sheet] forwarding:', body.slice(0, 200));

    const response = await fetch(SHEET_URL, {
      method:   'POST',
      headers:  { 'Content-Type': 'text/plain;charset=utf-8' },
      body:     body,
      redirect: 'follow',
    });

    const text = await response.text();
    console.log('[sheet] google status:', response.status, '| body:', text.slice(0, 300));

    let parsed;
    try { parsed = JSON.parse(text); } catch(_) { parsed = { raw: text }; }

    return res.status(200).json({ success: true, google: parsed });

  } catch (err) {
    console.error('[sheet] error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}
