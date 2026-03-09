import { Check, Archive, Trash2 } from 'lucide-react'
import { sendToProducer, isProducerConfigured } from '../utils/producer'
import { toast } from './Toast'

export default function ActionButtons({ viewMode, segmentName, episodeId, episodeTitle, episodes, onPickEpisode }) {
  if (!isProducerConfigured()) return null

  const send = async (msg) => {
    const ok = await sendToProducer(msg)
    toast(ok ? 'Sent to @producer' : 'Failed to send')
  }

  const handleAccept = () => {
    if (viewMode === 'bank') {
      // Bank: need to pick target episode
      onPickEpisode?.((targetEpId) => {
        send(`@producer move "${segmentName}" from backlog to ${targetEpId} and finalize it`)
      })
    } else {
      // Prep: finalize in place
      send(`@producer finalize "${segmentName}" in ${episodeId}`)
    }
  }

  const handleMoveToBacklog = () => {
    send(`@producer move "${segmentName}" from ${episodeId} to backlog and set to proposed`)
  }

  const handleDelete = () => {
    if (!confirm(`Delete "${segmentName}" from ${episodeTitle || episodeId}?`)) return
    const source = viewMode === 'bank' ? 'backlog' : episodeId
    send(`@producer delete "${segmentName}" from ${source}`)
  }

  const btnClass = 'p-1 rounded hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-hint)] hover:text-[var(--text-secondary)]'

  return (
    <div className="flex items-center gap-0.5 ml-auto flex-shrink-0" onClick={(e) => e.stopPropagation()}>
      {/* Accept — Bank and Prep only (not Show) */}
      {(viewMode === 'bank' || viewMode === 'prep') && (
        <button onClick={handleAccept} className={btnClass} title="Accept">
          <Check size={12} className="text-green-400" />
        </button>
      )}

      {/* Move to Backlog — Prep and Show */}
      {(viewMode === 'prep' || viewMode === 'show') && (
        <button onClick={handleMoveToBacklog} className={btnClass} title="Move to Backlog">
          <Archive size={12} className="text-yellow-400" />
        </button>
      )}

      {/* Delete — Bank and Prep (not Show) */}
      {(viewMode === 'bank' || viewMode === 'prep') && (
        <button onClick={handleDelete} className={btnClass} title="Delete">
          <Trash2 size={12} className="text-red-400" />
        </button>
      )}
    </div>
  )
}
