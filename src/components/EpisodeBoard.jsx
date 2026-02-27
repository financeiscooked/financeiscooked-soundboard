import React, { useState, useEffect, useCallback } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
  FileText,
  ImageIcon,
  ChevronDown,
} from 'lucide-react'

function SlideRenderer({ slide }) {
  if (slide.type === 'image') {
    return (
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="max-h-[60vh] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
          <img
            src={slide.src}
            alt={slide.title}
            className="max-h-[60vh] max-w-full object-contain"
            draggable={false}
          />
        </div>
        {slide.notes && (
          <p className="text-white/40 text-sm max-w-xl text-center">{slide.notes}</p>
        )}
      </div>
    )
  }

  if (slide.type === 'link') {
    return (
      <div className="max-w-2xl w-full">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex items-start gap-3 mb-4">
            <LinkIcon size={20} className="text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-white text-xl font-bold leading-tight">{slide.title}</h3>
              <a
                href={slide.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400/60 text-xs hover:text-blue-400 transition-colors break-all mt-1 block"
              >
                {slide.url}
              </a>
            </div>
          </div>
          {slide.notes && (
            <p className="text-white/60 text-base leading-relaxed mt-4 pl-8">
              {slide.notes}
            </p>
          )}
        </div>
      </div>
    )
  }

  if (slide.type === 'text') {
    return (
      <div className="max-w-2xl w-full">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {slide.bullets && (
            <ul className="space-y-3">
              {slide.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-red-400 mt-1.5 text-xs">&#9679;</span>
                  <span className="text-white/80 text-lg leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
          )}
          {slide.notes && (
            <p className="text-white/40 text-sm mt-6">{slide.notes}</p>
          )}
        </div>
      </div>
    )
  }

  return null
}

export default function EpisodeBoard() {
  const [episodes, setEpisodes] = useState([])
  const [currentEpId, setCurrentEpId] = useState(null)
  const [episode, setEpisode] = useState(null)
  const [activeSegmentIdx, setActiveSegmentIdx] = useState(0)
  const [activeSlideIdx, setActiveSlideIdx] = useState(0)
  const [epDropdownOpen, setEpDropdownOpen] = useState(false)

  // Load episode list
  useEffect(() => {
    fetch('/episodes/index.json')
      .then((r) => r.json())
      .then((list) => {
        setEpisodes(list)
        if (list.length > 0) setCurrentEpId(list[list.length - 1].id)
      })
  }, [])

  // Load episode data
  useEffect(() => {
    if (!currentEpId) return
    fetch(`/episodes/${currentEpId}.json`)
      .then((r) => r.json())
      .then((data) => {
        setEpisode(data)
        setActiveSegmentIdx(0)
        setActiveSlideIdx(0)
      })
  }, [currentEpId])

  const segments = episode?.segments || []
  const currentSegment = segments[activeSegmentIdx]
  const slides = currentSegment?.slides || []
  const currentSlide = slides[activeSlideIdx]

  // Total slide count and current global position
  const totalSlides = segments.reduce((sum, seg) => sum + seg.slides.length, 0)
  let globalSlideIdx = 0
  for (let i = 0; i < activeSegmentIdx; i++) {
    globalSlideIdx += segments[i].slides.length
  }
  globalSlideIdx += activeSlideIdx

  const goNext = useCallback(() => {
    if (activeSlideIdx < slides.length - 1) {
      setActiveSlideIdx((i) => i + 1)
    } else if (activeSegmentIdx < segments.length - 1) {
      setActiveSegmentIdx((i) => i + 1)
      setActiveSlideIdx(0)
    }
  }, [activeSlideIdx, activeSegmentIdx, slides.length, segments.length])

  const goPrev = useCallback(() => {
    if (activeSlideIdx > 0) {
      setActiveSlideIdx((i) => i - 1)
    } else if (activeSegmentIdx > 0) {
      const prevSegment = segments[activeSegmentIdx - 1]
      setActiveSegmentIdx((i) => i - 1)
      setActiveSlideIdx(prevSegment.slides.length - 1)
    }
  }, [activeSlideIdx, activeSegmentIdx, segments])

  const jumpToSegment = useCallback((idx) => {
    setActiveSegmentIdx(idx)
    setActiveSlideIdx(0)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev])

  if (!episode) {
    return (
      <div className="flex-1 flex items-center justify-center text-white/30">
        Loading episode...
      </div>
    )
  }

  const currentEp = episodes.find((e) => e.id === currentEpId)

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left sidebar — segments */}
      <div className="w-56 flex-shrink-0 border-r border-white/5 flex flex-col">
        {/* Episode picker */}
        <div className="p-3 border-b border-white/5 relative">
          <button
            onClick={() => setEpDropdownOpen(!epDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-bold tracking-wider transition-colors"
          >
            <span className="truncate">{currentEp?.title || 'Select Episode'}</span>
            <ChevronDown size={14} className="text-white/40 flex-shrink-0" />
          </button>
          {epDropdownOpen && (
            <div className="absolute top-full left-3 right-3 mt-1 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-2xl z-20 overflow-hidden">
              {episodes.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => {
                    setCurrentEpId(ep.id)
                    setEpDropdownOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors
                    ${ep.id === currentEpId ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
                >
                  {ep.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Segment list */}
        <div className="flex-1 overflow-y-auto py-2">
          {segments.map((seg, idx) => {
            const isActive = idx === activeSegmentIdx
            return (
              <button
                key={seg.id}
                onClick={() => jumpToSegment(idx)}
                className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-all border-l-2
                  ${isActive
                    ? 'bg-white/8 text-white border-red-400'
                    : 'text-white/35 hover:text-white/60 hover:bg-white/3 border-transparent'
                  }`}
              >
                <span className="block truncate">{seg.name}</span>
                <span className="text-[10px] text-white/20 mt-0.5 block">
                  {seg.slides.length} slide{seg.slides.length !== 1 ? 's' : ''}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Right area — slide viewer */}
      <div className="flex-1 flex flex-col">
        {/* Slide header */}
        <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between">
          <div>
            <span className="text-red-400 text-xs font-bold tracking-widest uppercase">
              {currentSegment?.name}
            </span>
            <h2 className="text-white font-bold text-lg mt-0.5">
              {currentSlide?.title}
            </h2>
          </div>
          <span className="text-white/20 text-xs font-mono">
            {globalSlideIdx + 1} / {totalSlides}
          </span>
        </div>

        {/* Slide content */}
        <div className="flex-1 flex items-center justify-center p-6">
          {currentSlide && <SlideRenderer slide={currentSlide} />}
        </div>

        {/* Navigation */}
        <div className="px-6 py-3 border-t border-white/5 flex items-center justify-between">
          <button
            onClick={goPrev}
            disabled={globalSlideIdx === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold
                       bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all
                       disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
            Prev
          </button>

          {/* Slide dots for current segment */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlideIdx(i)}
                className={`w-2 h-2 rounded-full transition-all
                  ${i === activeSlideIdx ? 'bg-red-400 w-4' : 'bg-white/15 hover:bg-white/30'}`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={globalSlideIdx === totalSlides - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold
                       bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all
                       disabled:opacity-20 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
