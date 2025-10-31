export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' })
  const topic = (req.query.topic || '').toString().trim()
  if (!topic) return res.status(400).json({ message: 'Missing topic' })

  try {
    // Try DuckDuckGo Instant Answer API (no key)
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(topic)}&format=json&no_html=1&skip_disambig=1`
    const r = await fetch(ddgUrl, { headers: { 'User-Agent': 'Instablood-FAQ/1.0' } })
    if (!r.ok) throw new Error('ddg fetch failed')
    const j = await r.json()

    function flatten(related) {
      const out = []
      for (const rt of related || []) {
        if (rt.Topics && Array.isArray(rt.Topics)) {
          for (const t of rt.Topics) out.push(t)
        } else if (rt.Text) {
          out.push(rt)
        }
      }
      return out
    }

    const candidates = flatten(j.RelatedTopics)
      .filter(x => x && x.Text)
      .slice(0, 12)

    const items = candidates.map(x => ({
      q: x.Text,
      a: x.Text + (x.FirstURL ? `\nSource: ${x.FirstURL}` : ''),
      source: x.FirstURL || null,
    }))

    if (items.length) return res.status(200).json({ items })
    // fallback to wikipedia
    throw new Error('no ddg items')
  } catch (e) {
    try {
      // Wikipedia search + summaries as fallback
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&format=json&utf8=1&srlimit=6`
      const s = await fetch(searchUrl, { headers: { 'User-Agent': 'Instablood-FAQ/1.0' } })
      const sj = await s.json()
      const pages = (sj?.query?.search || []).slice(0, 6)

      const items = []
      for (const p of pages) {
        const title = p.title
        const sumUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
        try {
          const sr = await fetch(sumUrl, { headers: { 'User-Agent': 'Instablood-FAQ/1.0' } })
          const sj2 = await sr.json()
          const extract = sj2?.extract || `About ${title}.`
          const url = sj2?.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`
          items.push({ q: `About ${title}`, a: extract + `\nSource: ${url}`, source: url })
        } catch {}
      }
      return res.status(200).json({ items })
    } catch {
      return res.status(200).json({ items: [] })
    }
  }
}
