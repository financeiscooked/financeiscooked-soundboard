import React, { useState, useEffect, useCallback, useRef } from 'react'
import { StopCircle } from 'lucide-react'
import SoundButton from './SoundButton'
import EditModal from './EditModal'
import { DEFAULT_SOUNDS, EXTRA_SOUNDS } from '../sounds/synthesizer'
import {
  saveCustomSound,
  getAllCustomSounds,
  deleteCustomSound,
  saveButtonConfig,
  getAllButtonConfigs,
} from '../utils/storage'

const ALL_DEFAULTS = [...DEFAULT_SOUNDS, ...EXTRA_SOUNDS]

function buildSlots(defaults, customSounds, configs) {
  const customMap = {}
  customSounds.forEach((s) => (customMap[s.id] = s))
  const configMap = {}
  configs.forEach((c) => (configMap[c.id] = c))

  return defaults.map((defaultSound, index) => {
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
}

export default function SoundBoard() {
  const [slots, setSlots] = useState([])
  const [editingSlot, setEditingSlot] = useState(null)
  const [stopAllSignal, setStopAllSignal] = useState(0)

  useEffect(() => {
    async function loadSlots() {
      const customSounds = await getAllCustomSounds()
      const configs = await getAllButtonConfigs()
      setSlots(buildSlots(ALL_DEFAULTS, customSounds, configs))
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

      setSlots((prev) => {
        // Revoke old blob URLs
        prev.forEach((s) => {
          if (s.id === slot.id && s.customAudioUrl) {
            URL.revokeObjectURL(s.customAudioUrl)
          }
        })
        return buildSlots(ALL_DEFAULTS, customSounds, configs)
      })

      setEditingSlot(null)
    },
    [editingSlot]
  )

  const handleReset = useCallback(async () => {
    if (!editingSlot) return
    await deleteCustomSound(editingSlot.id)

    setSlots((prev) => {
      const s = prev.find((s) => s.id === editingSlot.id)
      if (s?.customAudioUrl) URL.revokeObjectURL(s.customAudioUrl)

      return prev.map((slot) => {
        if (slot.id !== editingSlot.id) return slot
        const defaultSound = ALL_DEFAULTS.find((d) => d.id === slot.id)
        return {
          ...slot,
          name: defaultSound.name,
          color: defaultSound.color,
          customAudioUrl: null,
          isCustom: false,
          originalFileName: null,
        }
      })
    })

    setEditingSlot(null)
  }, [editingSlot])

  const mainSlots = slots.slice(0, 16)
  const extraSlots = slots.slice(16)

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

      {/* Scrollable content */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col items-center gap-6">
        {/* Main Sound Grid */}
        <div className="grid grid-cols-4 gap-3 w-full max-w-4xl" style={{ gridAutoRows: '1fr' }}>
          {mainSlots.map((slot) => (
            <SoundButton
              key={slot.id}
              slot={slot}
              onEdit={handleEdit}
              stopAllSignal={stopAllSignal}
            />
          ))}
        </div>

        {/* Divider */}
        {extraSlots.length > 0 && (
          <div className="w-full max-w-4xl flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/20 text-xs font-bold tracking-widest uppercase">
              Movies & Classics
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
        )}

        {/* Extra Sound Grid */}
        {extraSlots.length > 0 && (
          <div className="grid grid-cols-4 gap-3 w-full max-w-4xl" style={{ gridAutoRows: '1fr' }}>
            {extraSlots.map((slot) => (
              <SoundButton
                key={slot.id}
                slot={slot}
                onEdit={handleEdit}
                stopAllSignal={stopAllSignal}
              />
            ))}
          </div>
        )}
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
