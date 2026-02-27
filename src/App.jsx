import React, { useState } from 'react'
import { Volume2, Image, Tv } from 'lucide-react'
import SoundBoard from './components/SoundBoard'
import MemeBoard from './components/MemeBoard'
import EpisodeBoard from './components/EpisodeBoard'

const TABS = [
  { id: 'sounds', label: 'Soundboard', icon: Volume2 },
  { id: 'memes', label: 'Meme Board', icon: Image },
  { id: 'episodes', label: 'Episodes', icon: Tv },
]

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
            {TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all
                    ${activeTab === tab.id
                      ? 'bg-white/10 text-white shadow-lg'
                      : 'text-white/35 hover:text-white/60'
                    }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Active Board */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'sounds' && <SoundBoard />}
        {activeTab === 'memes' && <MemeBoard />}
        {activeTab === 'episodes' && <EpisodeBoard />}
      </div>
    </div>
  )
}
