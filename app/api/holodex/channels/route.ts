import { NextResponse } from 'next/server'

const BASE = process.env.HOLODEX_BASE ?? 'https://holodex.net/api/v2'
const API_KEY = process.env.HOLODEX_API_KEY ?? process.env.HOLODEX_KEY ?? ''

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const url = new URL(path, BASE)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null) continue
      url.searchParams.set(k, String(v))
    }
  }
  return url.toString()
}

export const runtime = 'edge'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    // allow overriding org or limit via query params
    const org = url.searchParams.get('org') || 'Hololive'
    const limit = url.searchParams.get('limit') || '200'

    const target = buildUrl('channels', { org, limit })
    const headers: Record<string, string> = {}
    if (API_KEY) headers['X-APIKEY'] = API_KEY

    const res = await fetch(target, { headers })
    if (!res.ok) {
      const txt = await res.text()
      return NextResponse.json({ error: txt }, { status: res.status })
    }
    const data = await res.json()

    // normalize to a small payload for client: id, name, photo
    const items = (Array.isArray(data) ? data : data?.items || [])
    const out = items.map((c: any) => ({ id: c.id, name: c.name || c.title || c.display_name, photo: c.photo || c.thumbnail || null }))

    return NextResponse.json(out, { status: 200, headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
