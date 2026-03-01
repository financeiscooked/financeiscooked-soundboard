import React, { useState, useMemo } from 'react'
import { Volume2, Image, Tv, Sun, Moon } from 'lucide-react'
import SoundBoard from './components/SoundBoard'
import MemeBoard from './components/MemeBoard'
import EpisodeBoard from './components/EpisodeBoard'
import { useTheme } from './ThemeContext'

const TABS = [
  { id: 'sounds', label: 'Soundboard', icon: Volume2 },
  { id: 'memes', label: 'Meme Board', icon: Image },
  { id: 'episodes', label: 'Episodes', icon: Tv },
]

// Check if launched in pop-out live mode via ?mode=live
function useIsPopout() {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('mode') === 'live'
  }, [])
}

export default function App() {
  const isPopout = useIsPopout()
  const [activeTab, setActiveTab] = useState(isPopout ? 'episodes' : 'sounds')
  const { theme, toggleTheme } = useTheme()

  // Pop-out mode: just the EpisodeBoard, no header/tabs
  if (isPopout) {
    return (
      <div className="h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden">
        <EpisodeBoard forceViewMode="live" />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-4">
          {/* Logo / ON AIR indicator */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#D94E2A] animate-pulse shadow-lg shadow-[#D94E2A]/50" />
            <span className="text-[#D94E2A] text-xs font-bold tracking-widest uppercase">
              On Air
            </span>
          </div>

          <div className="w-px h-6 bg-[var(--divider-px)]" />

          <h1 className="font-russo text-xl tracking-wide">
            <span className="text-[var(--text-primary)]">finance</span>
            <span className="text-[#D94E2A]">is</span>
            <span className="text-[#F0A030]">cooked</span>
          </h1>

          <div className="w-px h-6 bg-[var(--divider-px)]" />

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-[var(--bg-subtle)] rounded-xl p-1">
            {TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all
                    ${activeTab === tab.id
                      ? 'bg-[var(--bg-hover)] text-[var(--text-primary)] shadow-lg'
                      : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                    }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
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
