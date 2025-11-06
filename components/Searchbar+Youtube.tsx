"use client";

import { useState } from "react";
import Youtube from "@/components/Youtube";
import Selectbar from "@/components/Selectbar";

export default function SearchWithYT() {
  const [channelId, setChannelId] = useState("UC-hM6YJuNYVAmUWxeIr9FeA");
  const [selectedUser] = useState("sakuramiko")

  return (
    <>
        <Selectbar value={selectedUser} onChannelChange={setChannelId} />
        <Youtube key={channelId} channelId={channelId} />
    </>
  );
}
