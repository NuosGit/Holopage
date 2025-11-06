"use client"

import React, { useEffect, useState } from 'react'

type Channel = {
  id: string
  snippet?: {
    title?: string
    description?: string
    thumbnails?: Record<string, { url: string; width?: number; height?: number }>
  }
  statistics?: { subscriberCount?: string; viewCount?: string; videoCount?: string }
}

type ChannelResponse = {
  channel: Channel | null
}

type LiveStatus = {
  isLive: boolean
  isUpcoming: boolean
}

type Video = {
  id: string
  title?: string
  description?: string
  thumbnails?: Record<string, { url: string }>
  publishedAt?: string
  url?: string
}

type Props = {
  channelId?: string
  forUsername?: string
  className?: string
}

function formatNumber(n?: string) {
  if (!n) return ''
  try {
    return Number(n).toLocaleString()
  } catch {
    return n
  }
}

function Skeleton({ className }: { className?: string }) {
  // Skeleton mirrors the final card layout so dimensions don't shift when content loads.
  return (
    <div className={`backdrop-blur-md drop-shadow-2xl drop-shadow-red-900 bg-black/30 px-5 rounded-2xl w-126 h-80 ${className || ''}`}>
      {/* Header skeleton: avatar + title */}
      <div className="flex items-center gap-3 mt-2">
        {/* Avatar matches final: 72x72 */}
        <div className="w-[72px] h-[72px] rounded-full bg-gray-200" />
        <div className="flex-1">
          <div className="w-[220px] h-5 mb-2 rounded-md bg-gray-200" />
          <div className="w-[140px] h-3 rounded-md bg-gray-200" />
        </div>
      </div>

      {/* Description + latest thumbnail skeleton */}
      <div className="mt-3">
        <div className="mb-2.5 h-16 max-h-[72px] overflow-hidden rounded-md bg-gray-200" />

        <div className="flex gap-3 items-center">
          <div className="w-[120px] h-[68px] rounded-md bg-gray-200" />
          <div className="flex-1">
            <div className="w-[180px] h-4 mb-2 rounded-md bg-gray-200" />
            <div className="w-[120px] h-3 rounded-md bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Youtube({ channelId, forUsername, className }: Props) {
  const [channel, setChannel] = useState<Channel | null>(null)
  const [latest, setLatest] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<LiveStatus | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const q = new URLSearchParams()
        if (channelId) q.set('channelId', channelId)
        if (forUsername) q.set('forUsername', forUsername)

        // fetch channel profile
        const chUrl = `/api/youtube?${q.toString()}&mode=channel`
        // fetch latest upload
        const latestQ = new URLSearchParams(q.toString())
        latestQ.set('mode', 'uploads')
        latestQ.set('maxResults', '1')
        const latestUrl = `/api/youtube?${latestQ.toString()}`

        const [chRes, latestRes] = await Promise.all([fetch(chUrl), fetch(latestUrl)])
        if (!chRes.ok) throw new Error(`Channel API ${chRes.status}`)
        if (!latestRes.ok) throw new Error(`Latest API ${latestRes.status}`)

        const chJson: ChannelResponse = await chRes.json()
        const latestJson = await latestRes.json()

        if (!mounted) return
        setChannel(chJson.channel)
        const item = (latestJson.results && latestJson.results[0]) || null
        if (item) {
          setLatest({ id: item.id, title: item.title, thumbnails: item.thumbnails, publishedAt: item.publishedAt, url: item.url })
        } else {
          setLatest(null)
        }

        const fetchStatus = async () => {
          try {
            const res = await fetch(`/api/youtube?mode=live&channelId=${channelId}`)
            const data = await res.json()
            if (mounted) setStatus(data)
          } catch (error) {
            console.error("Error fetching YouTube status:", error)
          }
        }

        await fetchStatus()
      
      } catch (err: any) {
        if (!mounted) return
        setError(err?.message || 'Failed to load')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    if (channelId || forUsername) load()
    else setLoading(false)

    return () => {
      mounted = false
    }
  }, [channelId, forUsername])

  if (!channelId && !forUsername) {
    return <div className={className}>Please provide a channelId or forUsername.</div>
  }

  if (loading) return <Skeleton className={className} />
  if (error) return <Skeleton className={className} />
  if (!channel) return <Skeleton className={className} />

  const title = channel.snippet?.title || 'Unknown channel'
const thumb = channel.snippet?.thumbnails?.high?.url 
           || channel.snippet?.thumbnails?.medium?.url 
           || channel.snippet?.thumbnails?.default?.url 
           || '';
  const subs = formatNumber(channel.statistics?.subscriberCount)
  const description = channel.snippet?.description || ''

  return (
    <div className={`backdrop-blur-md drop-shadow-2xl drop-shadow-red-900 bg-black/30 px-5 rounded-2xl w-126 h-80 ${className || ''}`}>
      {/* Priority header: avatar + name */}
      <div className="flex items-center gap-3 mt-2">
        <img
          key={thumb}
          src={thumb}
          alt={`${title} avatar`}
          className="w-[72px] h-[72px] rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="text-lg font-bold">{title}</div>
          {subs ? <div className="text-sm text-gray-500">{subs} Subscribers</div> : null}
        </div>
      </div>

      {/* Other data below */}
      <div className="mt-3 text-white">
        {description ? (
          <div className="mb-2.5 text-white max-h-[72px] overflow-y-auto text-sm">{description}</div>
        ) : null}
        <div className="font-semibold mb-2 text-center">
          {status?.isLive ? (
            <>
              <img src="/living.svg" alt="completed" className="inline-block w-5 h-5 mr-2 mb-1 align-middle" />
              Live Streaming
              <img src="/living.svg" alt="completed" className="inline-block w-5 h-5 ml-2 mb-1 align-middle" />
            </>
          ) : status?.isUpcoming ? (
            <>
              <img src="/star.svg" alt="completed" className="inline-block w-5 h-5 mr-2 mb-1 align-middle" />
              Upcoming Live
              <img src="/star.svg" alt="completed" className="inline-block w-5 h-5 ml-2 mb-1 align-middle" />
            </>
          ) : (
            <>
              <img src="/completed.svg" alt="completed" className="inline-block w-5 h-5 mr-2 mb-1 align-middle" />
              Recently
              <img src="/completed.svg" alt="completed" className="inline-block w-5 h-5 ml-2 mb-1 align-middle" />
            </>
          )}
        </div>
        {latest ? (
          <a
            href={latest.url || `https://www.youtube.com/watch?v=${latest.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 items-center rounded-md p-1"
          >
            <img
              src={latest.thumbnails?.medium?.url || latest.thumbnails?.default?.url || ''}
              alt={latest.title}
              className="w-[120px] h-[68px] object-cover rounded-md"
            />
            <div>
              <div className="font-semibold text-white hover:underline">{latest.title}</div>
              <div className="text-xs text-gray-500">{latest.publishedAt ? new Date(latest.publishedAt).toLocaleString() : ''}</div>
            </div>
          </a>
        ) : (
          <div className="text-sm text-gray-500">No recent uploads found.</div>
        )}
      </div>
    </div>
  )
}
