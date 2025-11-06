"use client"

import React from 'react'

export default function QA() {
  return (
    <div className="backdrop-blur-md drop-shadow-2xl drop-shadow-red-900 bg-black/30 px-5 rounded-2xl w-126 h-80">
        <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-1 items-center justify-center">
            <a href="https://classroom.google.com/u/1/">
                <img src="/classroom.svg" alt="Google Classroom" className="w-2/5 h-2/5 mx-auto transition-all duration-300 ease-in-out hover:scale-120" />
            </a>
            <a href="https://teams.microsoft.com/v2/">
                <img src="/Teams.svg" alt="Microsoft Teams" className="w-2/5 h-2/5 mx-auto transition-all duration-300 ease-in-out hover:scale-130" />
            </a>
            <a href="https://mail.google.com/mail/u/0/#inbox">
                <img src="/mail.svg" alt="Gmail" className="w-2/5 h-2/5 mx-auto transition-all duration-300 ease-in-out hover:scale-120" />
            </a>
            <a href="https://chatgpt.com/">
                <img src="/chatgpt.svg" alt="ChatGPT" className="w-2/5 h-2/5 mx-auto transition-all duration-300 ease-in-out hover:scale-120" />
            </a>
            <a href="https://www.japandict.com/">
                <img src="/dictionary.svg" alt="JapanDict" className="w-2/5 h-2/5 mx-auto transition-all duration-300 ease-in-out hover:scale-130" />
            </a>
            <a href="https://www.youtube.com/">
                <img src="/youtube.svg" alt="Youtube" className="w-2/5 h-2/5 mx-auto transition-all duration-300 ease-in-out hover:scale-130" />
            </a>
        </div>
    </div>
  )
}