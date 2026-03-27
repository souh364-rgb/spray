export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

  const API_ID    = '79897418727982696563';
  const API_TOKEN = 'uZHYgiUtaLA51SQcxoB0qKyCIER9zvGlJwTDjMdnhk6f2P3mspWO4b7VNFX8re';

  try {
    const response = await fetch('https://api.guepex.app/v1/wilayas/', {
      headers: {
        'X-API-ID':    API_ID,
        'X-API-TOKEN': API_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
