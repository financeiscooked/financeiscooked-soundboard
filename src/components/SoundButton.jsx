import React, { useState, useRef, useCallback } from 'react'
import { Pencil } from 'lucide-react'

export default function SoundButton({ slot, onEdit }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const btnRef = useRef(null)
  const audioRef = useRef(null)

  const handlePlay = useCallback(() => {
    // Stop any currently playing audio from this button
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    setIsPlaying(true)

    if (slot.customAudioUrl) {
      // Play uploaded audio file
      const audio = new Audio(slot.customAudioUrl)
      audioRef.current = audio
      audio.play()
      audio.onended = () => setIsPlaying(false)
    } else if (slot.defaultSound?.play) {
      // Play synthesized sound
      slot.defaultSound.play()
      setTimeout(() => setIsPlaying(false), 300)
    }

    // Button press animation
    if (btnRef.current) {
      btnRef.current.classList.remove('btn-press', 'glow-playing')
      void btnRef.current.offsetWidth // force reflow
      btnRef.current.classList.add('btn-press', 'glow-playing')
    }
  }, [slot])

  const handleEdit = (e) => {
    e.stopPropagation()
    onEdit(slot)
  }

  const color = slot.color || '#666'

  return (
    <div
      ref={btnRef}
      className="sound-btn flex flex-col items-center justify-center gap-2 p-3"
      style={{
        background: `linear-gradient(145deg, ${color}22, ${color}11)`,
        '--glow-color': `${color}88`,
      }}
      onClick={handlePlay}
    >
      {/* Edit button */}
      <div className="edit-overlay z-10">
        <button
          onClick={handleEdit}
          className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white/60 hover:text-white transition-colors"
        >
          <Pencil size={14} />
        </button>
      </div>

      {/* Color indicator bar */}
      <div
        className="w-10 h-1 rounded-full mb-1"
        style={{ background: color }}
      />

      {/* Sound name */}
      <span
        className="text-sm font-bold text-center leading-tight tracking-wide"
        style={{ color: color }}
      >
        {slot.name}
      </span>

      {/* Playing indicator */}
      {isPlaying && (
        <div className="flex gap-1 items-end h-3">
          {[0, 1, 2, 0, 1].map((d, i) => (
            <div
              key={i}
              className="w-0.5 rounded-full animate-pulse"
              style={{
                background: color,
                height: `${6 + Math.random() * 8}px`,
                animationDelay: `${d * 100}ms`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
