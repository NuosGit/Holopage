import { NextResponse } from 'next/server'
import resolveHolodexYoutubeId from '@/lib/holodex'

export const runtime = 'edge'

export async function GET(req: Request) {
  try {
	const url = new URL(req.url)
	const username = url.searchParams.get('username') || url.searchParams.get('handle')
	if (!username) return NextResponse.json({ error: 'missing username query parameter' }, { status: 400 })

	const youtubeId = await resolveHolodexYoutubeId(username)
	if (!youtubeId) return NextResponse.json({ error: 'not found' }, { status: 404 })
	return NextResponse.json({ youtubeId })
  } catch (err: any) {
	return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

