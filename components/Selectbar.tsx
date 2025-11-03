"use client"

import React, { useState, useEffect } from "react"
import { channels } from "@/lib/hololiveData"
import { usernametoid } from "@/lib/usernametoid"

type Channel = { id: string; name: string; photo?: string | null }

export default function Selectbar({ onChannelChange }: { onChannelChange: (channelId: string) => void }) {
    const [selectedUser, setSelectedUser] = useState("sakuramiko")
    const [channelId, setChannelId] = useState(usernametoid("sakuramiko"))

    useEffect(() => {
        const id = usernametoid(selectedUser)
        setChannelId(id)
        onChannelChange(id) // send channelId to parent
    }, [selectedUser, onChannelChange])

    return (
        <div className="backdrop-blur-md drop-shadow-2xl drop-shadow-red-900 bg-black/30 px-5 rounded-2xl w-126 h-80">
            <a href="https://hololivepro.com/" className="w-full h-7/10 flex justify-center items-center">
                <img src="/Hologo.svg" alt="Hologo" className="max-w-full max-h-full" />
            </a>
            <div className="mt-3">
                <label htmlFor="hololive-select" className="block text-sm font-bold text-white">Select Holomem</label>
                <select
                    id="hololive-select"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="block w-full rounded-md border-gray-300 bg-black/60 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    {channels.map((c) => (
                    <option key={c.username} value={c.username}>
                        {c.displayName}
                    </option>
                    ))}
                </select>
            </div>
        </div>
    )
}