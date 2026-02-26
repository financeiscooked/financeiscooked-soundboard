// Web Audio API sound synthesizer for default soundboard sounds

let audioCtx = null

function getCtx() {
  if (!audioCtx) audioCtx = new AudioContext()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

// Helper: play noise burst
function noiseBuffer(ctx, duration) {
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }
  return buffer
}

export const DEFAULT_SOUNDS = [
  {
    id: 'airhorn',
    name: 'AIR HORN',
    color: '#ef4444',
    play: () => {
      const ctx = getCtx()
      const t = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const osc2 = ctx.createOscillator()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(400, t)
      osc.frequency.linearRampToValueAtTime(600, t + 0.05)
      osc.frequency.setValueAtTime(600, t + 0.05)
      osc2.type = 'sawtooth'
      osc2.frequency.setValueAtTime(402, t)
      osc2.frequency.linearRampToValueAtTime(602, t + 0.05)
      gain.gain.setValueAtTime(0.4, t)
      gain.gain.setValueAtTime(0.4, t + 0.6)
      gain.gain.linearRampToValueAtTime(0, t + 0.8)
      osc.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc2.start(t)
      osc.stop(t + 0.8)
      osc2.stop(t + 0.8)
    },
  },
  {
    id: 'foghorn',
    name: 'FOGHORN',
    color: '#f97316',
    play: () => {
      const ctx = getCtx()
      const t = ctx.currentTime
      const osc = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(80, t)
      osc2.type = 'sawtooth'
      osc2.frequency.setValueAtTime(81, t)
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.35, t + 0.1)
      gain.gain.setValueAtTime(0.35, t + 1.2)
      gain.gain.linearRampToValueAtTime(0, t + 1.5)
      osc.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc2.start(t)
      osc.stop(t + 1.5)
      osc2.stop(t + 1.5)
    },
  },
  {
    id: 'rimshot',
    name: 'RIMSHOT',
    color: '#eab308',
    play: () => {
      const ctx = getCtx()
      const t = ctx.currentTime
      // Hi-hat
      const noise = ctx.createBufferSource()
      noise.buffer = noiseBuffer(ctx, 0.05)
      const hpf = ctx.createBiquadFilter()
      hpf.type = 'highpass'
      hpf.frequency.value = 7000
      const g1 = ctx.createGain()
      g1.gain.setValueAtTime(0.3, t)
      g1.gain.exponentialRampToValueAtTime(0.01, t + 0.05)
      noise.connect(hpf).connect(g1).connect(ctx.destination)
      noise.start(t)
      // Snare body
      const osc = ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(200, t)
      osc.frequency.exponentialRampToValueAtTime(50, t + 0.1)
      const g2 = ctx.createGain()
      g2.gain.setValueAtTime(0.5, t)
      g2.gain.exponentialRampToValueAtTime(0.01, t + 0.15)
      osc.connect(g2).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.15)
    },
  },
  {
    id: 'sadtrombone',
    name: 'SAD TROMBONE',
    color: '#22c55e',
    play: () => {
      const ctx = getCtx()
      const t = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      const notes = [311, 293, 277, 200]
      osc.frequency.setValueAtTime(notes[0], t)
      osc.frequency.setValueAtTime(notes[1], t + 0.35)
      osc.frequency.setValueAtTime(notes[2], t + 0.7)
      osc.frequency.linearRampToValueAtTime(notes[3], t + 1.4)
      gain.gain.setValueAtTime(0.2, t)
      gain.gain.setValueAtTime(0.2, t + 1.2)
      gain.gain.linearRampToValueAtTime(0, t + 1.6)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 1.6)
    },
  },
  {
    id: 'cashregister',
    name: 'CHA-CHING',
    color: '#3b82f6',
    play: () => {
      const ctx = getCtx()
      const t = ctx.currentTime
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(2000 + i * 500, t + i * 0.06)
        gain.gain.setValueAtTime(0.25, t + i * 0.06)
        gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.06 + 0.15)
        osc.connect(gain).connect(ctx.destination)
        osc.start(t + i * 0.06)
        osc.stop(t + i * 0.06 + 0.15)
      }
      // Bell ring
      const bell = ctx.createOscillator()
      const bg = ctx.createGain()
      bell.type = 'sine'
      bell.frequency.value = 3500
      bg.gain.setValueAtTime(0.2, t + 0.2)
      bg.gain.exponentialRampToValueAtTime(0.01, t + 0.8)
      bell.connect(bg).connect(ctx.destination)
      bell.start(t + 0.2)
      bell.stop(t + 0.8)
    },
  },
  {
    id: 'buzzer',
    name: 'WRONG!',
    color: '#a855f7',
    play: () => {
      const ctx = getCtx()
      const t = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'square'
      osc.frequency.setValueAtTime(90, t)
      gain.gain.setValueAtTime(0.3, t)
      gain.gain.setValueAtTime(0.3, t + 0.6)
      gain.gain.linearRampToValueAtTime(0, t + 0.7)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.7)
    },
  },
  {
    id: 'ding',
    name: 'DING!',
    color: '#ec4899',
    play: () => {
      const ctx = getCtx()
      const t = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = 1800
      gain.gain.setValueAtTime(0.35, t)
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.6)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.6)
    },
  },
  {
    id: 'applause',
    name: 'APPLAUSE',
    color: '#06b6d4',
    play: () => {
      const ctx = getCtx()
      const t = ctx.currentTime
      for (let i = 0; i < 4; i++) {
        const noise = ctx.createBufferSource()
        noise.buffer = noiseBuffer(ctx, 2.0)
        const bpf = ctx.createBiquadFilter()
        bpf.type = 'bandpass'
        bpf.frequency.value = 1000 + Math.random() * 3000
        bpf.Q.value = 0.5
        const gain = ctx.createGain()
        gain.gain.setValueAtTime(0, t)
        gain.gain.linearRampToValueAtTime(0.12, t + 0.2)
        gain.gain.setValueAtTime(0.12, t + 1.2)
        gain.gain.linearRampToValueAtTime(0, t + 2.0)
        noise.connect(bpf).connect(gain).connect(ctx.destination)
        noise.start(t)
      }
    },
  },
  {
    id: 'crickets',
    name: 'CRICKETS',
    color: '#84cc16',
    play: () => {
      const ctx = getCtx()
      const t = ctx.currentTime
      for (let c = 0; c < 3; c++) {
        const chirpStart = t + c * 0.5
        for (let i = 0; i < 6; i++) {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.value = 4500 + Math.random() * 1000
          const st = chirpStart + i * 0.03
          gain.gain.setValueAtTime(0.08, st)
          gain.gain.exponentialRampToValueAtTime(0.01, st + 0.02)
          osc.connect(gain).connect(ctx.destination)
          osc.start(st)
          osc.stop(st + 0.025)
        }
      }
    },
  },
  {
    id: 'recordscratch',
    name: 'RECORD SCRATCH',
    color: '#f59e0b',
    play: () => {
      const ctx = getCtx()
      const t = ctx.currentTime
      const noise = ctx.createBufferSource()
      noise.buffer = noiseBuffer(ctx, 0.5)
      const bpf = ctx.createBiquadFilter()
      bpf.type = 'bandpass'
      bpf.frequency.setValueAtTime(3000, t)
      bpf.frequency.linearRampToValueAtTime(300, t + 0.15)
      bpf.frequency.linearRampToValueAtTime(4000, t + 0.3)
      bpf.Q.value = 2
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.4, t)
      gain.gain.linearRampToValueAtTime(0, t + 0.4)
      noise.connect(bpf).connect(gain).connect(ctx.destination)
      noise.start(t)
    },
  },
  {
    id: 'drumroll',
    name: 'DRUM ROLL',
    color: '#f43f5e',
    play: () => {
      const ctx = getCtx()
      const t = ctx.currentTime
      const count = 40
      for (let i = 0; i < count; i++) {
        const noise = ctx.createBufferSource()
        noise.buffer = noiseBuffer(ctx, 0.05)
        const gain = ctx.createGain()
        const hitTime = t + i * 0.03
        gain.gain.setValueAtTime(0.15 + (i / count) * 0.15, hitTime)
        gain.gain.exponentialRampToValueAtTime(0.01, hitTime + 0.04)
        noise.connect(gain).connect(ctx.destination)
        noise.start(hitTime)
      }
      // Final crash
      const crash = ctx.createBufferSource()
      crash.buffer = noiseBuffer(ctx, 0.8)
      const cg = ctx.createGain()
      cg.gain.setValueAtTime(0.4, t + count * 0.03)
      cg.gain.exponentialRampToValueAtTime(0.01, t + count * 0.03 + 0.6)
      crash.connect(cg).connect(ctx.destination)
      crash.start(t + count * 0.03)
    },
  },
  {
    id: 'explosion',
    name: 'BOOM',
    color: '#8b5cf6',
    play: () => {
      const ctx = getCtx()
      const t = ctx.currentTime
      const noise = ctx.createBufferSource()
      noise.buffer = noiseBuffer(ctx, 1.5)
      const lpf = ctx.createBiquadFilter()
      lpf.type = 'lowpass'
      lpf.frequency.setValueAtTime(4000, t)
      lpf.frequency.exponentialRampToValueAtTime(60, t + 1.0)
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.5, t)
      gain.gain.exponentialRampToValueAtTime(0.01, t + 1.3)
      noise.connect(lpf).connect(gain).connect(ctx.destination)
      noise.start(t)
      // Sub hit
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(100, t)
      osc.frequency.exponentialRampToValueAtTime(20, t + 0.5)
      const og = ctx.createGain()
      og.gain.setValueAtTime(0.5, t)
      og.gain.exponentialRampToValueAtTime(0.01, t + 0.8)
      osc.connect(og).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.8)
    },
  },
  {
    id: 'boing',
    name: 'BOING',
    color: '#14b8a6',
    play: () => {
      const ctx = getCtx()
      const t = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(300, t)
      osc.frequency.exponentialRampToValueAtTime(1200, t + 0.1)
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.3)
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.4)
      osc.frequency.exponentialRampToValueAtTime(150, t + 0.6)
      gain.gain.setValueAtTime(0.3, t)
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.7)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.7)
    },
  },
  {
    id: 'siren',
    name: 'SIREN',
    color: '#6366f1',
    play: () => {
      const ctx = getCtx()
      const t = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      gain.gain.setValueAtTime(0.2, t)
      gain.gain.setValueAtTime(0.2, t + 1.6)
      gain.gain.linearRampToValueAtTime(0, t + 1.8)
      for (let i = 0; i < 4; i++) {
        const base = t + i * 0.5
        osc.frequency.setValueAtTime(600, base)
        osc.frequency.linearRampToValueAtTime(1200, base + 0.25)
        osc.frequency.linearRampToValueAtTime(600, base + 0.5)
      }
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 1.8)
    },
  },
  {
    id: 'fanfare',
    name: 'VICTORY',
    color: '#d946ef',
    play: () => {
      const ctx = getCtx()
      const t = ctx.currentTime
      const notes = [523, 659, 784, 1047]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const osc2 = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'square'
        osc.frequency.value = freq
        osc2.type = 'square'
        osc2.frequency.value = freq * 1.005
        const start = t + i * 0.15
        gain.gain.setValueAtTime(0.15, start)
        if (i < 3) {
          gain.gain.setValueAtTime(0.15, start + 0.12)
          gain.gain.linearRampToValueAtTime(0, start + 0.14)
        } else {
          gain.gain.setValueAtTime(0.15, start + 0.4)
          gain.gain.linearRampToValueAtTime(0, start + 0.7)
        }
        osc.connect(gain)
        osc2.connect(gain)
        gain.connect(ctx.destination)
        osc.start(start)
        osc2.start(start)
        osc.stop(start + 0.8)
        osc2.stop(start + 0.8)
      })
    },
  },
  {
    id: 'laser',
    name: 'PEW PEW',
    color: '#10b981',
    play: () => {
      const ctx = getCtx()
      const t = ctx.currentTime
      for (let i = 0; i < 2; i++) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        const st = t + i * 0.15
        osc.frequency.setValueAtTime(1500, st)
        osc.frequency.exponentialRampToValueAtTime(100, st + 0.15)
        gain.gain.setValueAtTime(0.3, st)
        gain.gain.exponentialRampToValueAtTime(0.01, st + 0.15)
        osc.connect(gain).connect(ctx.destination)
        osc.start(st)
        osc.stop(st + 0.2)
      }
    },
  },
]
