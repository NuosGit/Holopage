"use client";

import React, { useState, FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Search() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    const url = `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
    window.location.href = url;
  };

  return (
    <div className="w-7/10 flex flex-row gap-5 backdrop-blur-md px-5 rounded-2xl border-2 border-border">
      <FontAwesomeIcon widthAuto icon={faMagnifyingGlass} className="w-15 h-15 my-auto" />
      <form onSubmit={handleSubmit} className="flex-grow">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="py-4 w-full text-xl focus:outline-none"
          placeholder="Just Search Like A Good Boy :)"
          aria-label="Search"
        />
      </form>
    </div>
  );
}