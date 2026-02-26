// Default sounds using real audio clips

function makePlayer(src) {
  return () => {
    const audio = new Audio(src)
    audio.play()
  }
}

export const DEFAULT_SOUNDS = [
  {
    id: 'airhorn',
    name: 'AIR HORN',
    color: '#ef4444',
    audioSrc: '/sounds/airhorn.mp3',
    play: makePlayer('/sounds/airhorn.mp3'),
  },
  {
    id: 'vine-boom',
    name: 'VINE BOOM',
    color: '#f97316',
    audioSrc: '/sounds/vine-boom.mp3',
    play: makePlayer('/sounds/vine-boom.mp3'),
  },
  {
    id: 'bruh',
    name: 'BRUH',
    color: '#eab308',
    audioSrc: '/sounds/bruh.mp3',
    play: makePlayer('/sounds/bruh.mp3'),
  },
  {
    id: 'you-play-to-win',
    name: 'PLAY TO WIN',
    color: '#22c55e',
    audioSrc: '/sounds/you-play-to-win.mp3',
    play: makePlayer('/sounds/you-play-to-win.mp3'),
  },
  {
    id: 'emotional-damage',
    name: 'EMOTIONAL DAMAGE',
    color: '#3b82f6',
    audioSrc: '/sounds/emotional-damage.mp3',
    play: makePlayer('/sounds/emotional-damage.mp3'),
  },
  {
    id: 'law-and-order',
    name: 'DUN DUN',
    color: '#a855f7',
    audioSrc: '/sounds/law-and-order.mp3',
    play: makePlayer('/sounds/law-and-order.mp3'),
  },
  {
    id: 'sad-violin',
    name: 'SAD VIOLIN',
    color: '#ec4899',
    audioSrc: '/sounds/sad-violin.mp3',
    play: makePlayer('/sounds/sad-violin.mp3'),
  },
  {
    id: 'price-is-right',
    name: 'PRICE IS WRONG',
    color: '#06b6d4',
    audioSrc: '/sounds/price-is-right-fail.mp3',
    play: makePlayer('/sounds/price-is-right-fail.mp3'),
  },
  {
    id: 'playoffs',
    name: 'PLAYOFFS?!',
    color: '#84cc16',
    audioSrc: '/sounds/playoffs.mp3',
    play: makePlayer('/sounds/playoffs.mp3'),
  },
  {
    id: 'they-are-who',
    name: 'WHO WE THOUGHT',
    color: '#f59e0b',
    audioSrc: '/sounds/they-are-who-we-thought.mp3',
    play: makePlayer('/sounds/they-are-who-we-thought.mp3'),
  },
  {
    id: 'practice',
    name: 'PRACTICE?!',
    color: '#f43f5e',
    audioSrc: '/sounds/practice.mp3',
    play: makePlayer('/sounds/practice.mp3'),
  },
  {
    id: 'john-cena',
    name: 'JOHN CENA',
    color: '#8b5cf6',
    audioSrc: '/sounds/john-cena.mp3',
    play: makePlayer('/sounds/john-cena.mp3'),
  },
  {
    id: 'curb',
    name: 'CURB YOUR...',
    color: '#14b8a6',
    audioSrc: '/sounds/curb-your-enthusiasm.mp3',
    play: makePlayer('/sounds/curb-your-enthusiasm.mp3'),
  },
  {
    id: 'rickroll',
    name: 'RICK ROLL',
    color: '#6366f1',
    audioSrc: '/sounds/rickroll.mp3',
    play: makePlayer('/sounds/rickroll.mp3'),
  },
  {
    id: 'mgs-alert',
    name: 'MGS ALERT',
    color: '#d946ef',
    audioSrc: '/sounds/mgs-alert.mp3',
    play: makePlayer('/sounds/mgs-alert.mp3'),
  },
  {
    id: 'windows-error',
    name: 'WINDOWS ERROR',
    color: '#10b981',
    audioSrc: '/sounds/windows-xp-error.mp3',
    play: makePlayer('/sounds/windows-xp-error.mp3'),
  },
]
