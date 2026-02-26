import React, { useState } from 'react'
import { Volume2, Image } from 'lucide-react'
import SoundBoard from './components/SoundBoard'
import MemeBoard from './components/MemeBoard'

export default function App() {
  const [activeTab, setActiveTab] = useState('sounds')

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f] text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          {/* Logo / ON AIR indicator */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50" />
            <span className="text-red-400 text-xs font-bold tracking-widest uppercase">
              On Air
            </span>
          </div>

          <div className="w-px h-6 bg-white/10" />

          <h1 className="font-russo text-xl tracking-wide">
            <span className="text-white">finance</span>
            <span className="text-red-400">is</span>
            <span className="text-white">cooked</span>
          </h1>

          <div className="w-px h-6 bg-white/10" />

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('sounds')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all
                ${activeTab === 'sounds'
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-white/35 hover:text-white/60'
                }`}
            >
              <Volume2 size={14} />
              Soundboard
            </button>
            <button
              onClick={() => setActiveTab('memes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all
                ${activeTab === 'memes'
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-white/35 hover:text-white/60'
                }`}
            >
              <Image size={14} />
              Meme Board
            </button>
          </div>
        </div>
      </header>

      {/* Active Board */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'sounds' ? <SoundBoard /> : <MemeBoard />}
      </div>
    </div>
  )
}
