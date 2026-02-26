import React, { useState, useRef } from 'react'
import { X, Upload, RotateCcw, Check, Image } from 'lucide-react'

export default function MemeEditModal({ slot, onSave, onReset, onClose }) {
  const [name, setName] = useState(slot.name)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const fileRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped && dropped.type.startsWith('image/')) {
      setFile(dropped)
      setPreview(URL.createObjectURL(dropped))
    }
  }

  const handleFileSelect = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
    }
  }

  const handleSave = () => {
    onSave({ name: name.toUpperCase(), file })
  }

  const currentImage = preview || slot.customImageUrl || slot.placeholder

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1a1a2e] rounded-2xl p-6 w-full max-w-md mx-4 border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Image size={18} className="text-white/50" />
            Edit Meme
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current preview */}
        {currentImage && (
          <div className="mb-5 flex justify-center">
            <div className="w-32 h-32 rounded-xl overflow-hidden border border-white/10">
              <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* Name input */}
        <div className="mb-5">
          <label className="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">
            Button Label
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-semibold
                       focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all uppercase"
            placeholder="Meme name..."
          />
        </div>

        {/* Image upload */}
        <div className="mb-6">
          <label className="block text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">
            Meme Image
          </label>
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
              ${dragOver ? 'border-purple-400 bg-purple-400/10' : 'border-white/15 hover:border-white/30 hover:bg-white/5'}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="mx-auto mb-2 text-white/30" size={24} />
            {file ? (
              <p className="text-green-400 text-sm font-semibold">{file.name}</p>
            ) : slot.isCustom ? (
              <p className="text-white/40 text-sm">
                Current: <span className="text-white/60 font-semibold">{slot.originalFileName || 'custom image'}</span>
                <br />
                <span className="text-xs mt-1 inline-block">Drop a new image or click to replace</span>
              </p>
            ) : (
              <p className="text-white/40 text-sm">
                Drop image here or click to browse
                <br />
                <span className="text-xs text-white/25">.png, .jpg, .gif, .webp</span>
              </p>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {slot.isCustom && (
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                         bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold
                       bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold
                       bg-purple-500 hover:bg-purple-400 text-white transition-all"
          >
            <Check size={14} />
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
