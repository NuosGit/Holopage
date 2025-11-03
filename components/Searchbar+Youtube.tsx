"use client";

import { useState } from "react";
import Youtube from "@/components/Youtube";
import Selectbar from "@/components/Selectbar";

export default function HomeClient() {
  const [channelId, setChannelId] = useState("UC-hM6YJuNYVAmUWxeIr9FeA");

  return (
    <>
        <Selectbar onChannelChange={setChannelId} />
        <Youtube channelId={channelId} />
    </>
  );
}
