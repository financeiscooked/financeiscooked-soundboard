// Default meme definitions with placeholder SVG generators
// Users will replace these with their own images

function createPlaceholderSvg(emoji, label, bgColor) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="${bgColor}" rx="16"/>
    <text x="200" y="170" text-anchor="middle" font-size="80">${emoji}</text>
    <text x="200" y="240" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="22" fill="white">${label}</text>
    <text x="200" y="270" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="rgba(255,255,255,0.4)">Click pencil to add image</text>
  </svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export const DEFAULT_MEMES = [
  {
    id: 'meme-this-is-fine',
    name: 'THIS IS FINE',
    color: '#ef4444',
    emoji: '\u{1F525}',
    placeholder: createPlaceholderSvg('\u{1F525}', 'THIS IS FINE', '#7f1d1d'),
  },
  {
    id: 'meme-stonks',
    name: 'STONKS',
    color: '#22c55e',
    emoji: '\u{1F4C8}',
    placeholder: createPlaceholderSvg('\u{1F4C8}', 'STONKS', '#14532d'),
  },
  {
    id: 'meme-not-stonks',
    name: 'NOT STONKS',
    color: '#ef4444',
    emoji: '\u{1F4C9}',
    placeholder: createPlaceholderSvg('\u{1F4C9}', 'NOT STONKS', '#7f1d1d'),
  },
  {
    id: 'meme-surprised',
    name: 'SURPRISED',
    color: '#eab308',
    emoji: '\u{1F62E}',
    placeholder: createPlaceholderSvg('\u{1F62E}', 'SURPRISED', '#713f12'),
  },
  {
    id: 'meme-galaxy-brain',
    name: 'GALAXY BRAIN',
    color: '#a855f7',
    emoji: '\u{1F9E0}',
    placeholder: createPlaceholderSvg('\u{1F9E0}', 'GALAXY BRAIN', '#581c87'),
  },
  {
    id: 'meme-money-printer',
    name: 'MONEY PRINTER',
    color: '#22c55e',
    emoji: '\u{1F4B8}',
    placeholder: createPlaceholderSvg('\u{1F4B8}', 'MONEY PRINTER GO BRRR', '#14532d'),
  },
  {
    id: 'meme-cope',
    name: 'COPE',
    color: '#3b82f6',
    emoji: '\u{1F62D}',
    placeholder: createPlaceholderSvg('\u{1F62D}', 'COPE', '#1e3a5f'),
  },
  {
    id: 'meme-rug-pull',
    name: 'RUG PULL',
    color: '#f97316',
    emoji: '\u{1F9F9}',
    placeholder: createPlaceholderSvg('\u{1F9F9}', 'RUG PULL', '#7c2d12'),
  },
  {
    id: 'meme-diamond-hands',
    name: 'DIAMOND HANDS',
    color: '#06b6d4',
    emoji: '\u{1F48E}',
    placeholder: createPlaceholderSvg('\u{1F48E}', 'DIAMOND HANDS', '#164e63'),
  },
  {
    id: 'meme-paper-hands',
    name: 'PAPER HANDS',
    color: '#f59e0b',
    emoji: '\u{1F9FB}',
    placeholder: createPlaceholderSvg('\u{1F9FB}', 'PAPER HANDS', '#78350f'),
  },
  {
    id: 'meme-trust-me-bro',
    name: 'TRUST ME BRO',
    color: '#ec4899',
    emoji: '\u{1F913}',
    placeholder: createPlaceholderSvg('\u{1F913}', 'TRUST ME BRO', '#831843'),
  },
  {
    id: 'meme-to-the-moon',
    name: 'TO THE MOON',
    color: '#8b5cf6',
    emoji: '\u{1F680}',
    placeholder: createPlaceholderSvg('\u{1F680}', 'TO THE MOON', '#4c1d95'),
  },
  {
    id: 'meme-dumpeet',
    name: 'DUMP EET',
    color: '#f43f5e',
    emoji: '\u{1F4DE}',
    placeholder: createPlaceholderSvg('\u{1F4DE}', 'DUMP EET', '#881337'),
  },
  {
    id: 'meme-wen-lambo',
    name: 'WEN LAMBO',
    color: '#d946ef',
    emoji: '\u{1F3CE}\u{FE0F}',
    placeholder: createPlaceholderSvg('\u{1F3CE}\u{FE0F}', 'WEN LAMBO', '#701a75'),
  },
  {
    id: 'meme-buy-the-dip',
    name: 'BUY THE DIP',
    color: '#14b8a6',
    emoji: '\u{1F4B0}',
    placeholder: createPlaceholderSvg('\u{1F4B0}', 'BUY THE DIP', '#134e4a'),
  },
  {
    id: 'meme-its-over',
    name: "IT'S OVER",
    color: '#6366f1',
    emoji: '\u{1F480}',
    placeholder: createPlaceholderSvg('\u{1F480}', "IT'S OVER", '#312e81'),
  },
]
