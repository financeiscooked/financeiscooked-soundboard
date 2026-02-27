import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
  FileText,
  ImageIcon,
  ChevronDown,
  Circle,
  CheckCircle2,
  Archive,
} from 'lucide-react'

const VIEW_MODES = [
  { id: 'show', label: 'Show', description: 'Final segments only' },
  { id: 'prep', label: 'Prep', description: 'All segments' },
  { id: 'bank', label: 'Proposed Bank', description: 'All proposed across episodes' },
]

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

function StatusDot({ status }) {
  if (status === 'final') {
    return <CheckCircle2 size={10} className="text-emerald-400 flex-shrink-0" />
  }
  return <Circle size={10} className="text-yellow-400 flex-shrink-0" />
}

function StatusBadge({ status }) {
  if (status === 'final') {
    return (
      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
        Final
      </span>
    )
  }
  return (
    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-yellow-500/15 text-yellow-400 border border-yellow-500/20">
      Proposed
    </span>
  )
}

// Proposed Bank — shows all proposed segments across all episodes
function ProposedBank({ episodes, onSelectSegment }) {
  const [allEpisodes, setAllEpisodes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (episodes.length === 0) return
    setLoading(true)
    Promise.all(
      episodes.map((ep) =>
        fetch(`/episodes/${ep.id}.json`)
          .then((r) => r.json())
          .catch(() => null)
      )
    ).then((results) => {
      setAllEpisodes(results.filter(Boolean))
      setLoading(false)
    })
  }, [episodes])

  const proposedSegments = useMemo(() => {
    const items = []
    for (const ep of allEpisodes) {
      for (const seg of ep.segments) {
        if (seg.status !== 'final') {
          items.push({ episode: ep, segment: seg })
        }
      }
    }
    return items
  }, [allEpisodes])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-white/30">
        Loading proposed segments...
      </div>
    )
  }

  if (proposedSegments.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-white/30 gap-3">
        <Archive size={40} className="text-white/15" />
        <p className="text-sm">No proposed segments across any episode</p>
        <p className="text-xs text-white/20">Segments added by agents will appear here as "proposed"</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Circle size={12} className="text-yellow-400" />
          <h2 className="text-white font-bold text-lg">Proposed Bank</h2>
          <span className="text-white/30 text-sm">
            {proposedSegments.length} segment{proposedSegments.length !== 1 ? 's' : ''} across all episodes
          </span>
        </div>
        <div className="space-y-3">
          {proposedSegments.map(({ episode, segment }) => (
            <button
              key={`${episode.id}-${segment.id}`}
              onClick={() => onSelectSegment(episode.id, segment.id)}
              className="w-full text-left bg-white/5 border border-yellow-500/10 hover:border-yellow-500/25 rounded-xl p-4 transition-all hover:bg-white/8 group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StatusDot status="proposed" />
                  <span className="text-white font-bold text-sm">{segment.name}</span>
                </div>
                <span className="text-white/20 text-xs font-mono bg-white/5 px-2 py-0.5 rounded">
                  {episode.title}
                </span>
              </div>
              <div className="flex items-center gap-4 text-white/30 text-xs">
                <span>{segment.slides.length} slide{segment.slides.length !== 1 ? 's' : ''}</span>
                <span>&#183;</span>
                <span>{segment.slides.map((s) => s.type).filter((v, i, a) => a.indexOf(v) === i).join(', ')}</span>
              </div>
              {segment.slides.length > 0 && (
                <div className="mt-2 text-white/20 text-xs truncate">
                  First slide: {segment.slides[0].title}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function EpisodeBoard() {
  const [episodes, setEpisodes] = useState([])
  const [currentEpId, setCurrentEpId] = useState(null)
  const [episode, setEpisode] = useState(null)
  const [activeSegmentIdx, setActiveSegmentIdx] = useState(0)
  const [activeSlideIdx, setActiveSlideIdx] = useState(0)
  const [epDropdownOpen, setEpDropdownOpen] = useState(false)
  const [viewMode, setViewMode] = useState('show')

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

  const allSegments = episode?.segments || []

  // Filter segments based on view mode
  const segments = useMemo(() => {
    if (viewMode === 'show') return allSegments.filter((s) => s.status === 'final')
    return allSegments // prep mode shows all
  }, [allSegments, viewMode])

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

  // Stats for the current episode
  const finalCount = allSegments.filter((s) => s.status === 'final').length
  const proposedCount = allSegments.filter((s) => s.status !== 'final').length

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

  // Jump to a specific episode + segment (used by Proposed Bank)
  const handleBankSelect = useCallback((epId, segId) => {
    setCurrentEpId(epId)
    setViewMode('prep')
    // Wait for episode to load, then find the segment
    const waitForEp = () => {
      fetch(`/episodes/${epId}.json`)
        .then((r) => r.json())
        .then((data) => {
          setEpisode(data)
          const idx = data.segments.findIndex((s) => s.id === segId)
          setActiveSegmentIdx(idx >= 0 ? idx : 0)
          setActiveSlideIdx(0)
        })
    }
    waitForEp()
  }, [])

  // Reset segment index when view mode changes (filtered list may be shorter)
  useEffect(() => {
    setActiveSegmentIdx(0)
    setActiveSlideIdx(0)
  }, [viewMode])

  // Keyboard navigation
  useEffect(() => {
    if (viewMode === 'bank') return // no keyboard nav in bank view
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
  }, [goNext, goPrev, viewMode])

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

        {/* View mode toggle */}
        <div className="p-2 border-b border-white/5">
          <div className="flex items-center gap-0.5 bg-white/5 rounded-lg p-0.5">
            {VIEW_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                title={mode.description}
                className={`flex-1 px-2 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all
                  ${viewMode === mode.id
                    ? 'bg-white/10 text-white shadow'
                    : 'text-white/30 hover:text-white/50'
                  }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
          {/* Status counts */}
          {viewMode !== 'bank' && (
            <div className="flex items-center gap-3 mt-2 px-1">
              <div className="flex items-center gap-1">
                <CheckCircle2 size={9} className="text-emerald-400" />
                <span className="text-[10px] text-white/30">{finalCount} final</span>
              </div>
              {proposedCount > 0 && (
                <div className="flex items-center gap-1">
                  <Circle size={9} className="text-yellow-400" />
                  <span className="text-[10px] text-white/30">{proposedCount} proposed</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Segment list (hidden in bank view) */}
        {viewMode !== 'bank' && (
          <div className="flex-1 overflow-y-auto py-2">
            {segments.length === 0 && (
              <div className="px-4 py-8 text-center text-white/20 text-xs">
                {viewMode === 'show' ? 'No final segments yet' : 'No segments'}
              </div>
            )}
            {segments.map((seg, idx) => {
              const isActive = idx === activeSegmentIdx
              const segStatus = seg.status || 'proposed'
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
                  <div className="flex items-center gap-1.5">
                    <StatusDot status={segStatus} />
                    <span className="block truncate flex-1">{seg.name}</span>
                  </div>
                  <span className="text-[10px] text-white/20 mt-0.5 block pl-4">
                    {seg.slides.length} slide{seg.slides.length !== 1 ? 's' : ''}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Placeholder for bank view sidebar */}
        {viewMode === 'bank' && (
          <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
            <Archive size={24} className="text-yellow-400/40 mb-2" />
            <p className="text-white/30 text-xs">
              Browsing proposed segments across all episodes
            </p>
          </div>
        )}
      </div>

      {/* Right area */}
      {viewMode === 'bank' ? (
        <ProposedBank episodes={episodes} onSelectSegment={handleBankSelect} />
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Slide header */}
          <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400 text-xs font-bold tracking-widest uppercase">
                    {currentSegment?.name}
                  </span>
                  {currentSegment && <StatusBadge status={currentSegment.status || 'proposed'} />}
                </div>
                <h2 className="text-white font-bold text-lg mt-0.5">
                  {currentSlide?.title}
                </h2>
              </div>
            </div>
            <span className="text-white/20 text-xs font-mono">
              {totalSlides > 0 ? `${globalSlideIdx + 1} / ${totalSlides}` : '0 / 0'}
            </span>
          </div>

          {/* Slide content */}
          <div className="flex-1 flex items-center justify-center p-6">
            {currentSlide ? (
              <SlideRenderer slide={currentSlide} />
            ) : (
              <div className="text-white/20 text-sm">
                {segments.length === 0 ? 'No segments to display in this view' : 'No slides in this segment'}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="px-6 py-3 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={goPrev}
              disabled={globalSlideIdx === 0 || totalSlides === 0}
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
              disabled={globalSlideIdx === totalSlides - 1 || totalSlides === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold
                         bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all
                         disabled:opacity-20 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
