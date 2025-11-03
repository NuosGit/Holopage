"use client"

import React, { useState } from "react"
import { channels } from "@/lib/hololiveData"
import { usernametoid } from "@/lib/usernametoid"

import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Channel = { id: string; name: string; photo?: string | null }

export default function Selectbar() {
    const [selectedUser, setSelectedUser] = useState("")
    const [channelId, setChannelId] = useState("")

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const username = e.target.value
        setSelectedUser(username)
        setChannelId(usernametoid(username))
    }
    return (
        <div className="backdrop-blur-md drop-shadow-2xl drop-shadow-red-900 bg-black/30 px-5 rounded-2xl w-126 h-80">
            <a href="https://hololivepro.com/" className="w-full h-7/10 flex justify-center items-center">
                <img src="/Hologo.svg" alt="Hologo" className="max-w-full max-h-full" />
            </a>
            <div className="mt-3">
                <label htmlFor="hololive-select" className="block text-sm font-bold text-white">Select Holomem</label>
                <select id="hololive-select" className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    <option value="">— choose a channel —</option>
                </select>
            </div>
        </div>
    )
}