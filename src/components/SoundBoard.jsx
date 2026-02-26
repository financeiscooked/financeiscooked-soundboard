import React, { useState, useEffect, useCallback, useRef } from 'react'
import { StopCircle } from 'lucide-react'
import SoundButton from './SoundButton'
import EditModal from './EditModal'
import { DEFAULT_SOUNDS } from '../sounds/synthesizer'
import {
  saveCustomSound,
  getAllCustomSounds,
  deleteCustomSound,
  saveButtonConfig,
  getAllButtonConfigs,
} from '../utils/storage'

export default function SoundBoard() {
  const [slots, setSlots] = useState([])
  const [editingSlot, setEditingSlot] = useState(null)
  const [stopAllSignal, setStopAllSignal] = useState(0)

  useEffect(() => {
    async function loadSlots() {
      const customSounds = await getAllCustomSounds()
      const configs = await getAllButtonConfigs()

      const customMap = {}
      customSounds.forEach((s) => (customMap[s.id] = s))
      const configMap = {}
      configs.forEach((c) => (configMap[c.id] = c))

      const loadedSlots = DEFAULT_SOUNDS.map((defaultSound, index) => {
        const slotId = defaultSound.id
        const custom = customMap[slotId]
        const config = configMap[slotId]

        if (custom) {
          const blob = new Blob([custom.data], { type: custom.type })
          const url = URL.createObjectURL(blob)
          return {
            index,
            id: slotId,
            name: config?.name || custom.name,
            color: config?.color || defaultSound.color,
            customAudioUrl: url,
            isCustom: true,
            originalFileName: custom.originalName,
            defaultSound,
          }
        }

        return {
          index,
          id: slotId,
          name: config?.name || defaultSound.name,
          color: config?.color || defaultSound.color,
          customAudioUrl: null,
          isCustom: false,
          defaultSound,
        }
      })

      setSlots(loadedSlots)
    }

    loadSlots()
  }, [])

  const handleEdit = useCallback((slot) => {
    setEditingSlot(slot)
  }, [])

  const handleSave = useCallback(
    async ({ name, file }) => {
      const slot = editingSlot
      if (!slot) return

      if (file) {
        await saveCustomSound(slot.id, file)
      }

      if (name !== slot.name) {
        await saveButtonConfig(slot.id, { name })
      }

      const customSounds = await getAllCustomSounds()
      const configs = await getAllButtonConfigs()
      const customMap = {}
      customSounds.forEach((s) => (customMap[s.id] = s))
      const configMap = {}
      configs.forEach((c) => (configMap[c.id] = c))

      setSlots((prev) =>
        prev.map((s) => {
          if (s.id !== slot.id) return s
          const custom = customMap[s.id]
          const config = configMap[s.id]
          const defaultSound = DEFAULT_SOUNDS.find((d) => d.id === s.id)

          if (custom) {
            if (s.customAudioUrl) URL.revokeObjectURL(s.customAudioUrl)
            const blob = new Blob([custom.data], { type: custom.type })
            const url = URL.createObjectURL(blob)
            return {
              ...s,
              name: config?.name || custom.name,
              customAudioUrl: url,
              isCustom: true,
              originalFileName: custom.originalName,
            }
          }

          return {
            ...s,
            name: config?.name || defaultSound.name,
          }
        })
      )

      setEditingSlot(null)
    },
    [editingSlot]
  )

  const handleReset = useCallback(async () => {
    if (!editingSlot) return
    await deleteCustomSound(editingSlot.id)

    setSlots((prev) =>
      prev.map((s) => {
        if (s.id !== editingSlot.id) return s
        const defaultSound = DEFAULT_SOUNDS.find((d) => d.id === s.id)
        if (s.customAudioUrl) URL.revokeObjectURL(s.customAudioUrl)
        return {
          ...s,
          name: defaultSound.name,
          color: defaultSound.color,
          customAudioUrl: null,
          isCustom: false,
          originalFileName: null,
        }
      })
    )

    setEditingSlot(null)
  }, [editingSlot])

  return (
    <>
      {/* Stop All button */}
      <div className="absolute top-4 right-6 z-10">
        <button
          onClick={() => setStopAllSignal((s) => s + 1)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors text-xs font-bold tracking-wider uppercase"
          title="Stop all sounds"
        >
          <StopCircle size={16} />
          Stop All
        </button>
      </div>

      {/* Sound Grid */}
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="grid grid-cols-4 gap-3 w-full max-w-4xl" style={{ gridAutoRows: '1fr' }}>
          {slots.map((slot) => (
            <SoundButton
              key={slot.id}
              slot={slot}
              onEdit={handleEdit}
              stopAllSignal={stopAllSignal}
            />
          ))}
        </div>
      </div>

      {/* Footer hint */}
      <footer className="px-6 py-2 border-t border-white/5 text-center">
        <p className="text-white/15 text-xs">
          Hover a button and click the pencil to swap in your own sounds
        </p>
      </footer>

      {editingSlot && (
        <EditModal
          slot={editingSlot}
          onSave={handleSave}
          onReset={handleReset}
          onClose={() => setEditingSlot(null)}
        />
      )}
    </>
  )
}
