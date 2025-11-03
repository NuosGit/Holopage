import { NextResponse } from 'next/server'

const API_BASE = 'https://www.googleapis.com/youtube/v3/'

function buildApiUrl(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const url = new URL(path, API_BASE)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null) continue
      url.searchParams.set(k, String(v))
    }
  }
  return url.toString()
}

function cacheHeaders() {
  // short server cache, allow CDN to cache slightly longer
  return {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
  }
}

async function fetchJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Upstream error ${res.status}: ${text}`)
  }
  return res.json()
}

async function resolveChannelIdByUsername(username: string, apiKey: string) {
  const url = buildApiUrl('channels', { part: 'id', forUsername: username, key: apiKey })
  const data = await fetchJson(url)
  if (data.items && data.items[0] && data.items[0].id) return data.items[0].id
  throw new Error('channel not found for username')
}

/**
 * GET handler
 * Query params:
 * - channelId (preferred) or forUsername
 * - mode: upcoming | live | uploads | latest (default: upcoming)
 * - maxResults: number (default 5)
 */
export async function GET(req: Request) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing YOUTUBE_API_KEY in server environment' }, { status: 500 })
    }

    const url = new URL(req.url)
    const qs = url.searchParams
    let channelId = qs.get('channelId')
    const forUsername = qs.get('forUsername')
    const mode = (qs.get('mode') || 'upcoming').toLowerCase()
    const maxResults = Math.min(50, Number(qs.get('maxResults') || '5'))

    if (!channelId && forUsername) {
      channelId = await resolveChannelIdByUsername(forUsername, apiKey)
    }

    // If caller passed a handle or username in `channelId` (e.g. @MrBeast or MrBeast),
    // normalize and attempt to resolve to a real channelId using the username resolution.
    if (channelId) {
      // strip leading @ for handles
      if (channelId.startsWith('@')) channelId = channelId.slice(1)

      // If this doesn't look like a canonical channel id (starts with 'UC'), try resolving
      // it as a username/handle. This handles common cases where callers pass 'MrBeast' or '@MrBeast'.
      if (!channelId.startsWith('UC')) {
        try {
          channelId = await resolveChannelIdByUsername(channelId, apiKey)
        } catch (resolveErr) {
          // leave channelId as-is; we will return an error below if it's invalid
          // but include the resolve error in logs by throwing a clearer message
          throw new Error(`failed to resolve channel identifier: ${String(resolveErr)}`)
        }
      }
    }

    if (!channelId) {
      return NextResponse.json({ error: 'Missing channelId or forUsername parameter' }, { status: 400 })
    }

    // If the caller only wants the channel profile/info, fetch channels endpoint
    if (mode === 'channel') {
      const channelsUrl = buildApiUrl('channels', {
        part: 'snippet,statistics,brandingSettings',
        id: channelId,
        key: apiKey,
      })
      const channelData = await fetchJson(channelsUrl)
      const channel = (channelData.items || [])[0] || null
      return NextResponse.json({ channel, requestedAt: new Date().toISOString() }, { status: 200, headers: cacheHeaders() })
    }

    // Build search query depending on mode
    const searchParams: Record<string, string | number | boolean> = {
      part: 'snippet',
      channelId,
      maxResults,
      key: apiKey,
    }
    if (mode === 'upcoming') {
      Object.assign(searchParams, { type: 'video', eventType: 'upcoming', order: 'date' })
    } else if (mode === 'live') {
      Object.assign(searchParams, { type: 'video', eventType: 'live', order: 'date' })
    } else if (mode === 'uploads' || mode === 'latest') {
      Object.assign(searchParams, { type: 'video', order: 'date' })
    } else {
      Object.assign(searchParams, { type: 'video', order: 'date' })
    }

    const searchUrl = buildApiUrl('search', searchParams)
    const searchData = await fetchJson(searchUrl)

    const videoIds = (searchData.items || [])
      .map((it: any) => it.id && (it.id.videoId || it.id))
      .filter(Boolean)
      .slice(0, maxResults)

    let videosData: any = { items: [] }
    if (videoIds.length) {
      const ids = videoIds.join(',')
      const videosUrl = buildApiUrl('videos', {
        part: 'snippet,contentDetails,liveStreamingDetails,statistics',
        id: ids,
        key: apiKey,
      })
      videosData = await fetchJson(videosUrl)
    }

    const out = {
      channelId,
      mode,
      requestedAt: new Date().toISOString(),
      results: (videosData.items || []).map((v: any) => ({
        id: v.id,
        title: v.snippet?.title,
        description: v.snippet?.description,
        thumbnails: v.snippet?.thumbnails,
        publishedAt: v.snippet?.publishedAt,
        url: `https://www.youtube.com/watch?v=${v.id}`,
        liveStreamingDetails: v.liveStreamingDetails || null,
        statistics: v.statistics || null,
        contentDetails: v.contentDetails || null,
      })),
    }

    return NextResponse.json(out, { status: 200, headers: cacheHeaders() })
  } catch (err: any) {
    const message = err?.message || 'unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export const runtime = 'edge'
