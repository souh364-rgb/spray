export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

  const API_ID    = '79897418727982696563';
  const API_TOKEN = 'uZHYgiUtaLA51SQcxoB0qKyCIER9zvGlJwTDjMdnhk6f2P3mspWO4b7VNFX8re';
  const HEADERS   = { 'X-API-ID': API_ID, 'X-API-TOKEN': API_TOKEN };
  const BASE_URL  = 'https://api.guepex.app/v1/communes/';

  async function fetchPage(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    try {
      const r = await fetch(url, { headers: HEADERS, signal: controller.signal });
      clearTimeout(timer);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch(e) { clearTimeout(timer); throw e; }
  }

  try {
    // Page 1
    const first    = await fetchPage(BASE_URL);
    const allItems = [...(first.data || [])];

    // Use meta if available for parallel fetch
    const lastPage = first.meta?.last_page || 1;

    if (lastPage > 1) {
      // Parallel fetch all remaining pages
      const pageUrls = [];
      for (let p = 2; p <= lastPage; p++) pageUrls.push(`${BASE_URL}?page=${p}`);
      const results = await Promise.allSettled(pageUrls.map(url => fetchPage(url)));
      for (const r of results) {
        if (r.status === 'fulfilled' && Array.isArray(r.value?.data)) {
          allItems.push(...r.value.data);
        }
      }
    } else {
      // No meta — follow next links sequentially (capped at 60 pages)
      let nextUrl = first.links?.next || null;
      let safety  = 0;
      while (nextUrl && safety < 60) {
        const page = await fetchPage(nextUrl).catch(() => null);
        if (!page) break;
        allItems.push(...(page.data || []));
        nextUrl = page.links?.next || null;
        safety++;
      }
    }

    const communes = allItems.map(c => ({
      id:            c.id,
      name:          c.name,
      wilaya_id:     c.wilaya_id,
      has_stop_desk: !!c.has_stop_desk,
    }));

    return res.status(200).json({ communes, total: communes.length });

  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch communes', detail: err.message });
  }
}
