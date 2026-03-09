# Episode Action Buttons Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Accept / Move to Backlog / Delete buttons to EpisodeBoard that send `@producer` commands to Slack via incoming webhook.

**Architecture:** Utility function `sendToProducer(text)` POSTs to Slack webhook. Action buttons rendered conditionally per view mode. Episode picker modal for Bank accept. Toast for confirmation.

**Tech Stack:** React (existing), Lucide icons (existing), Slack Incoming Webhooks API, Vite env vars

---

### Task 1: Create sendToProducer utility

**Files:**
- Create: `src/utils/producer.js`

**Step 1: Create the utility**

```js
const WEBHOOK_URL = import.meta.env.VITE_SLACK_WEBHOOK_URL

export async function sendToProducer(message) {
  if (!WEBHOOK_URL) {
    console.warn('VITE_SLACK_WEBHOOK_URL not configured')
    return false
  }
  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    })
    return true
  } catch (err) {
    console.error('Failed to send to producer:', err)
    return false
  }
}

export function isProducerConfigured() {
  return !!WEBHOOK_URL
}
```

**Step 2: Commit**

```bash
git add src/utils/producer.js
git commit -m "feat: add sendToProducer Slack webhook utility"
```

---

### Task 2: Add Toast notification component

**Files:**
- Create: `src/components/Toast.jsx`

**Step 1: Create a simple toast**

```jsx
import { useState, useEffect, useCallback } from 'react'

let showToastFn = null

export function toast(message) {
  showToastFn?.(message)
}

export default function Toast() {
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    showToastFn = (m) => {
      setMsg(m)
      setTimeout(() => setMsg(null), 2500)
    }
    return () => { showToastFn = null }
  }, [])

  if (!msg) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--bg-active)] border border-[var(--border-subtle)] text-[var(--text-primary)] px-4 py-2 rounded-xl text-sm shadow-lg animate-fade-in">
      {msg}
    </div>
  )
}
```

**Step 2: Add the fade-in animation to `src/index.css`**

Add at end of file:
```css
@keyframes fade-in {
  from { opacity: 0; transform: translate(-50%, 10px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}
.animate-fade-in { animation: fade-in 0.2s ease-out; }
```

**Step 3: Mount Toast in App.jsx**

In `src/App.jsx`, import and render `<Toast />` inside the top-level wrapper, after all other content.

**Step 4: Commit**

```bash
git add src/components/Toast.jsx src/index.css src/App.jsx
git commit -m "feat: add Toast notification component"
```

---

### Task 3: Add ActionButtons component for segment sidebar

**Files:**
- Create: `src/components/ActionButtons.jsx`

**Step 1: Create the component**

This renders the correct button set per view mode. It sits on the segment row in the sidebar.

```jsx
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
```

**Step 2: Commit**

```bash
git add src/components/ActionButtons.jsx
git commit -m "feat: add ActionButtons component with Accept/Backlog/Delete"
```

---

### Task 4: Add EpisodePicker modal

**Files:**
- Create: `src/components/EpisodePicker.jsx`

**Step 1: Create the modal**

```jsx
import { useState } from 'react'
import { X } from 'lucide-react'

export default function EpisodePicker({ episodes, onSelect, onClose }) {
  const [selected, setSelected] = useState(episodes[0]?.id || '')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl p-5 w-72 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[var(--text-primary)] font-bold text-sm">Move to which episode?</h3>
          <button onClick={onClose} className="text-[var(--text-hint)] hover:text-[var(--text-secondary)]">
            <X size={16} />
          </button>
        </div>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] text-sm mb-4"
        >
          {episodes.filter(ep => ep.id !== 'backlog').map((ep) => (
            <option key={ep.id} value={ep.id}>{ep.title || ep.id}</option>
          ))}
        </select>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-xs text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]">
            Cancel
          </button>
          <button
            onClick={() => { onSelect(selected); onClose() }}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 text-white hover:bg-green-500"
          >
            Accept & Move
          </button>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/EpisodePicker.jsx
git commit -m "feat: add EpisodePicker modal for Bank accept flow"
```

---

### Task 5: Wire ActionButtons into EpisodeBoard sidebar (Prep/Show)

**Files:**
- Modify: `src/components/EpisodeBoard.jsx`

**Step 1: Add imports at top of file (line ~1)**

Add to imports:
```js
import ActionButtons from './ActionButtons'
import EpisodePicker from './EpisodePicker'
import Toast from './Toast'
```

Add to lucide imports: `Check` (if not present)

**Step 2: Add EpisodePicker state in EpisodeBoard component (after line ~569)**

```js
const [episodePickerCallback, setEpisodePickerCallback] = useState(null)
```

**Step 3: Add ActionButtons to segment rows in sidebar (around line ~1051-1058)**

Inside the segment header row, after the segment name/status/slides info and before the closing `</button>`, add ActionButtons. Specifically, modify the segment list item to include action buttons next to the segment name.

Find the segment row that has `<StatusDot status={segStatus} />` and `<span className="block truncate flex-1">{seg.name}</span>`. After the parent `<button>` for jump-to-segment closes (line ~1058), add:

```jsx
<ActionButtons
  viewMode={viewMode}
  segmentName={seg.name}
  episodeId={episode?.id}
  episodeTitle={episode?.title}
  episodes={episodes}
  onPickEpisode={(cb) => setEpisodePickerCallback(() => cb)}
/>
```

**Step 4: Add EpisodePicker modal render (before closing tag of the component return)**

```jsx
{episodePickerCallback && (
  <EpisodePicker
    episodes={episodes}
    onSelect={(epId) => { episodePickerCallback(epId); setEpisodePickerCallback(null) }}
    onClose={() => setEpisodePickerCallback(null)}
  />
)}
```

**Step 5: Commit**

```bash
git add src/components/EpisodeBoard.jsx
git commit -m "feat: wire ActionButtons into sidebar for Prep/Show modes"
```

---

### Task 6: Wire ActionButtons into ProposedBank view

**Files:**
- Modify: `src/components/EpisodeBoard.jsx`

**Step 1: Update ProposedBank props**

Change ProposedBank function signature to accept `episodes` list (it already has it) and add `onPickEpisode`:
```js
function ProposedBank({ episodes, onSelectSlide, allEpisodesList, onPickEpisode })
```

**Step 2: Add ActionButtons to each segment header in Bank view (around line ~511-516)**

In the segment header div, after the episode title span, add:
```jsx
<ActionButtons
  viewMode="bank"
  segmentName={segment.name}
  episodeId={episode.id}
  episodeTitle={episode.title}
  episodes={allEpisodesList}
  onPickEpisode={onPickEpisode}
/>
```

**Step 3: Update ProposedBank usage (around line ~1101-1102)**

Pass the additional props:
```jsx
<ProposedBank
  episodes={episodes}
  onSelectSlide={handleBankSelect}
  allEpisodesList={episodes}
  onPickEpisode={(cb) => setEpisodePickerCallback(() => cb)}
/>
```

**Step 4: Commit**

```bash
git add src/components/EpisodeBoard.jsx
git commit -m "feat: wire ActionButtons into Proposed Bank view"
```

---

### Task 7: Add env var and test end-to-end

**Files:**
- Create: `.env.local` (gitignored)

**Step 1: Create Slack incoming webhook**

In Slack app settings > Incoming Webhooks > Activate > Add New Webhook to Workspace > Select the #financeiscooked channel > Copy webhook URL.

**Step 2: Add env var**

Create `.env.local` at project root:
```
VITE_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

**Step 3: Verify `.env.local` is in `.gitignore`**

Check `.gitignore` includes `.env.local` (Vite default).

**Step 4: Test locally**

```bash
cd ~/Desktop/APPs/financeiscooked && npm run dev
```

- Open browser, go to Episodes > Prep mode
- Click the green checkmark on a proposed segment
- Verify "Sent to @producer" toast appears
- Verify message appears in Slack channel
- Verify agent processes it and replies

**Step 5: For Netlify deployment**

Add `VITE_SLACK_WEBHOOK_URL` as an environment variable in Netlify dashboard > Site settings > Environment variables.

**Step 6: Final commit**

```bash
git add -A
git commit -m "feat: complete episode action buttons with Slack webhook integration"
```
