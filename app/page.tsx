import { Suspense } from "react";
import Youtube from "@/components/Youtube";
import Search from "@/components/Search";
import Selectbar from "@/components/Selectbar";
import Team from "@/components/Team";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 min-h-dvh overflow-scroll p-4 items-center justify-center font-sans relative max-w-full mx-auto z-10">
      <Search />
      <div className="flex items-start gap-6">
        <Selectbar />
        <Youtube channelId="UC-hM6YJuNYVAmUWxeIr9FeA"/>
        <Team />
      </div>
    </div>
  );
}
