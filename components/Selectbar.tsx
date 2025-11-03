"use client"

import React, { useEffect, useState } from 'react'

type Channel = { id: string; name: string; photo?: string | null }

export default function Selectbar() {
    const [channels, setChannels] = useState<Channel[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let mounted = true
        async function load() {
            setLoading(true)
            setError(null)
            try {
                const res = await fetch('/api/holodex/channels?org=Hololive&limit=200')
                if (!res.ok) throw new Error(`status ${res.status}`)
                const json = await res.json()
                if (!mounted) return
                setChannels(json || [])
            } catch (err: any) {
                if (!mounted) return
                setError(err?.message || String(err))
            } finally {
                if (mounted) setLoading(false)
            }
        }
        load()
        return () => { mounted = false }
    }, [])

    return (
        <div className="backdrop-blur-md px-5 rounded-2xl border-2 border-border w-126 h-80">
            <div className="w-full h-7/10 flex justify-center items-center">
                <img src="/Hologo.svg" alt="Hologo" className="max-w-full max-h-full" />
            </div>

            <div className="mt-3">
                <label htmlFor="hololive-select" className="block text-sm font-bold text-white">Select Holomem</label>
                {loading ? (
                    <div className="mt-2 text-sm text-white">Loading channels…</div>
                ) : error ? (
                    <div className="mt-2 text-sm text-red-500">Error: {error}</div>
                ) : (
                    <select id="hololive-select" className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                        <option value="">— choose a channel —</option>
                        {channels.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                )}
            </div>
        </div>
    )
}
