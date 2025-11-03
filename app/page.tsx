import { Suspense } from "react";
import Youtube from "@/components/Youtube";
import Search from "@/components/Search";
import Selectbar from "@/components/Selectbar";
import Team from "@/components/Team";
import Logo from "@/components/Logo";
import Clock from "@/components/Clock";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 min-h-dvh overflow-scroll p-4 items-center justify-center font-sans relative max-w-full mx-auto z-10">
      <div className="flex items-start gap-6 mt-5 mb-5">
        <Logo />
        <div className="w-100 h-100  flex items-center justify-center text-6xl font-bold text-white">
          Nuos Search
        </div>
      </div>
      <Search />
      <div className="flex items-start gap-6">
        <Selectbar />
        <Youtube channelId="UC-hM6YJuNYVAmUWxeIr9FeA"/>
        <Team />
      </div>
    </div>
  );
}
