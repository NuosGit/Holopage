import { NextResponse } from 'next/server'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('mode')
  const channelId = searchParams.get('channelId')
  const forUsername = searchParams.get('forUsername')
  const maxResults = searchParams.get('maxResults') || '5'

  try {
    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ error: 'Missing YouTube API key' }, { status: 500 })
    }

    // ---------- CHANNEL INFO ----------
    if (mode === 'channel') {
      let id = channelId

      // Find channel ID by username if necessary
      if (!id && forUsername) {
        const findRes = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${forUsername}&key=${YOUTUBE_API_KEY}`
        )
        const findJson = await findRes.json()
        id = findJson.items?.[0]?.id
      }

      if (!id) {
        return NextResponse.json({ error: 'Missing channelId or forUsername' }, { status: 400 })
      }

      // ✅ FIX: always check the raw response, don't assume items[0] exists
      const apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${id}&key=${YOUTUBE_API_KEY}`
      const res = await fetch(apiUrl)
      const json = await res.json()

      if (!json.items || json.items.length === 0) {
        console.error('YouTube API returned empty:', json)
        return NextResponse.json({ channel: null })
      }

      const item = json.items[0]
      const channel = {
        id: item.id,
        snippet: item.snippet,
        statistics: item.statistics,
      }

      return NextResponse.json({ channel })
    }

    // ---------- LATEST UPLOADS ----------
    if (mode === 'uploads') {
      let id = channelId

      if (!id && forUsername) {
        const findRes = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${forUsername}&key=${YOUTUBE_API_KEY}`
        )
        const findJson = await findRes.json()
        id = findJson.items?.[0]?.id
      }

      if (!id) {
        return NextResponse.json({ error: 'Missing channelId or forUsername' }, { status: 400 })
      }

      // Get upload playlist safely
      const detailsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${id}&key=${YOUTUBE_API_KEY}`
      )
      const detailsJson = await detailsRes.json()
      console.log('Channel contentDetails:', detailsJson)

      const uploadsId = detailsJson.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
      if (!uploadsId) {
        console.error('No uploads playlist found for channel:', id)
        return NextResponse.json({ results: [] })
      }

      // Fetch latest video
      const videosRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
      )
      const videosJson = await videosRes.json()
      console.log('Playlist items:', videosJson)

      const results = videosJson.items?.map((v: any) => ({
        id: v.snippet.resourceId.videoId,
        title: v.snippet.title,
        description: v.snippet.description,
        thumbnails: v.snippet.thumbnails,
        publishedAt: v.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${v.snippet.resourceId.videoId}`,
      })) || []

      return NextResponse.json({ results })
    }

    // Invalid mode
    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
  } catch (err: any) {
    console.error('YouTube API error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
export const runtime = 'edge'