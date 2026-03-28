export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyoFhXEz8IDwJUsoaKwjmLw48fsVVtMcNk7qTeNNIvEQLeOCL4-Lq2eca7ifKY8iEzw/exec';

  try {
    const body = JSON.stringify(req.body);

    const response = await fetch(SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: body,
      redirect: 'follow',
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(200).json({ success: false, error: err.message });
  }
}
