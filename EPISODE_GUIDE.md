# Episode Content Management Guide

## For AI Agents Updating Show Content

This document explains exactly how to add, edit, and remove content for the **financeiscooked** show episodes. Follow these instructions precisely.

---

## Architecture Overview

```
public/episodes/
├── index.json              ← Master list of all episodes
├── ep1.json                ← Episode 1 slide data
├── ep1/                    ← Episode 1 images/assets
│   ├── logo-tagline.png
│   └── pwc-linkedin.jpg
├── ep2.json                ← Episode 2 slide data
├── ep2/                    ← Episode 2 images/assets
│   └── .gitkeep
├── ep3/ ... ep50/          ← Pre-created folders
```

- **Episode JSON** (`ep{N}.json`) contains ALL slide content: text, links, images references, and notes
- **Episode folder** (`ep{N}/`) holds image files for that episode
- **index.json** is the master list the app reads to populate the episode picker dropdown

---

## Segment Status: Proposed vs Final

Every segment has a `status` field — either `"proposed"` or `"final"`.

### How It Works

- **`"proposed"`** — The segment is a draft/idea. It is NOT part of the live show rundown yet.
- **`"final"`** — The segment is confirmed for the show. It appears in Show Mode.

### Rules for AI Agents

1. **When adding ANY new segment or content, ALWAYS set `"status": "proposed"`.**
   - Never set a segment to `"final"` unless explicitly told to by the hosts.
   - Example: "Add a vibecoding segment to EP3" → add it with `"status": "proposed"`

2. **Only change status to `"final"` when the hosts explicitly say so.**
   - Example: "Move the vibecoding segment to final" → change `"status"` from `"proposed"` to `"final"`
   - The hosts may also ask for edits at the same time: "Move it to final and rename it to X"

3. **Segments without a `status` field default to `"proposed"` in the UI.**
   - But you should always include the field explicitly.

### UI View Modes

The app has three view modes:

| Mode | What It Shows |
|---|---|
| **Show** | Only `"final"` segments — this is the live show rundown |
| **Prep** | ALL segments (both proposed and final) — for review and planning |
| **Proposed Bank** | All `"proposed"` segments across EVERY episode — for cherry-picking ideas |

The **Proposed Bank** is important: hosts may see a proposed segment from EP1 and decide to use it in EP5. When this happens, they'll tell an agent to move or copy it.

---

## Episode JSON Structure

```json
{
  "id": "ep1",
  "title": "Episode 1 - Pilot",
  "date": "2026-03-05",
  "segments": [
    {
      "id": "cold-open",
      "name": "Cold Open + Intro",
      "status": "final",
      "slides": [
        { "type": "image", "title": "Show Logo", "src": "/episodes/ep1/logo.png" },
        { "type": "text", "title": "Welcome", "bullets": ["Point 1", "Point 2"] },
        { "type": "link", "title": "Article Name", "url": "https://...", "notes": "Context here" }
      ]
    },
    {
      "id": "hot-take",
      "name": "Hot Take: Vibecoding",
      "status": "proposed",
      "slides": [
        { "type": "text", "title": "Vibecoding Is Real", "bullets": ["Everyone is doing it", "Is it sustainable?"] }
      ]
    }
  ]
}
```

### Slide Types

There are **4 slide types**:

#### 1. `gallery` — Displays multiple images in a grid
```json
{
  "type": "gallery",
  "title": "Slide title shown as heading",
  "images": [
    { "src": "/episodes/ep{N}/image1.png", "alt": "Description" },
    { "src": "/episodes/ep{N}/image2.png", "alt": "Description" },
    { "src": "/episodes/ep{N}/image3.png", "alt": "Description" }
  ],
  "notes": "Optional speaker notes"
}
```
- `images` is an array of objects, each with `src` and optional `alt`
- 4+ images render in a 2-column grid, fewer render in a single row
- Use this when you want to show multiple related images on one slide
- All image `src` paths follow the same rules as the `image` type

#### 2. `image` — Displays a single image
```json
{
  "type": "image",
  "title": "Slide title shown above image",
  "src": "/episodes/ep{N}/filename.png",
  "notes": "Optional speaker notes or caption"
}
```
- `src` MUST be a path relative to the public folder: `/episodes/ep{N}/filename.ext`
- The actual image file MUST exist at `public/episodes/ep{N}/filename.ext`
- Supported formats: .png, .jpg, .jpeg, .gif, .webp

#### 3. `text` — Displays bullet points
```json
{
  "type": "text",
  "title": "Slide title shown as heading",
  "bullets": [
    "First bullet point",
    "Second bullet point",
    "Third bullet point"
  ],
  "notes": "Optional speaker notes (shown smaller below)"
}
```
- `bullets` is an array of strings
- Keep bullets concise — these are displayed on screen during a live show
- 3-6 bullets per slide is ideal

#### 4. `link` — Displays an article/URL card
```json
{
  "type": "link",
  "title": "Headline or Article Name",
  "url": "https://full-url-here.com/article",
  "notes": "Context, talking points, or summary for the hosts"
}
```
- `url` must be a full URL including https://
- `notes` should include context for discussion (this is what hosts read during the show)

---

## Standard Show Segments

Every episode typically has these segments (in order). Use these exact `id` values:

| Segment ID | Segment Name | Description |
|---|---|---|
| `cold-open` | Cold Open + Intro | Show opener, logos, host intros |
| `app-of-the-show` | App of the Show | Featured app / live build |
| `quick-updates` | 90 Seconds Quick Updates | 3-6 news items (link slides) |
| `take-of-the-show` | Take of the Show | Joe's take + Ore's take |
| `ai-thing` | One Thing I Did with AI | AI use case of the week |
| `app-checkin` | Check In on App of the Show | Revisit the featured app |
| `whats-coming` | What's Coming | Future episode topics |
| `outtro` | Outtro | Thank you + closing |

You CAN add custom segments. Just give them a unique `id` (lowercase, hyphenated) and a clear `name`.

---

## Common Operations

### ADD a slide to an existing segment

1. Read the episode JSON: `public/episodes/ep{N}.json`
2. Find the target segment by `id` (e.g., `quick-updates`)
3. Add the new slide object to that segment's `slides` array
4. If it's an image slide, also copy the image file to `public/episodes/ep{N}/`
5. Write the updated JSON back
6. Commit and push

**Example — adding a news article to Quick Updates:**
```
Add to the "quick-updates" segment's slides array:
{
  "type": "link",
  "title": "OpenAI Launches New Accounting Tool",
  "url": "https://example.com/article",
  "notes": "OpenAI entering the accounting space. Direct competitor to Intuit."
}
```

### ADD an image slide

1. Copy the image to `public/episodes/ep{N}/descriptive-name.png`
   - Use lowercase, hyphenated filenames: `getBasis-funding.png`, `block-layoffs.jpg`
   - NO spaces in filenames
2. Add the slide to the appropriate segment:
```json
{
  "type": "image",
  "title": "Title Shown on Screen",
  "src": "/episodes/ep{N}/descriptive-name.png",
  "notes": "Optional context"
}
```

### ADD a new segment (always as proposed)

Add a new segment object to the `segments` array. **Always set `"status": "proposed"`:**
```json
{
  "id": "sponsor-break",
  "name": "Sponsor Break",
  "status": "proposed",
  "slides": [
    {
      "type": "image",
      "title": "Brought to you by...",
      "src": "/episodes/ep{N}/sponsor-logo.png"
    }
  ]
}
```

### MOVE a segment to final

When told to finalize a segment, change its `"status"` from `"proposed"` to `"final"`:
```json
{
  "id": "sponsor-break",
  "name": "Sponsor Break",
  "status": "final",
  ...
}
```

### COPY a proposed segment from one episode to another

When told to use a proposed segment from another episode:
1. Read the source episode JSON and find the proposed segment
2. Read the target episode JSON
3. Copy the segment object into the target episode's `segments` array
4. Update any image `src` paths to point to the target episode's folder (e.g., change `/episodes/ep1/` to `/episodes/ep5/`)
5. Copy any referenced image files to the target episode's folder
6. Set the status as instructed (usually `"proposed"` unless told otherwise)
7. Write both files back (optionally remove from source if told to "move" rather than "copy")
8. Commit and push

### REMOVE a slide

1. Read the episode JSON
2. Find and remove the slide object from the segment's `slides` array
3. If it was an image slide, optionally delete the image file too (not required)
4. Write the updated JSON
5. Commit and push

### REMOVE a segment

Remove the entire segment object from the `segments` array in the episode JSON.

### REORDER slides within a segment

Change the order of slide objects in the `slides` array. First item = first shown.

### REORDER segments

Change the order of segment objects in the `segments` array. First item = first in sidebar.

---

## Creating a New Episode

1. Create the episode JSON file: `public/episodes/ep{N}.json`
   - Copy structure from a previous episode as template
   - Update `id`, `title`, and `date`
   - Clear out slide content (or keep skeleton segments with empty slides)
   - **Set all segments to `"status": "proposed"`** — nothing is final until the hosts confirm
2. The folder `public/episodes/ep{N}/` already exists (pre-created up to ep50)
3. Add the episode to `public/episodes/index.json`:
```json
{
  "id": "ep{N}",
  "title": "Episode {N} - Title Here",
  "date": "YYYY-MM-DD"
}
```
4. Commit and push

### Quick-start: Copy EP1 structure as template
```bash
cat public/episodes/ep1.json | python3 -c "
import json, sys
ep = json.load(sys.stdin)
ep['id'] = 'ep2'
ep['title'] = 'Episode 2 - TBD'
ep['date'] = '2026-03-12'
for seg in ep['segments']:
    seg['slides'] = []
    seg['status'] = 'proposed'
print(json.dumps(ep, indent=2))
" > public/episodes/ep2.json
```

---

## Deployment

After ANY content change:

```bash
cd ~/Desktop/APPs/financeiscooked
git add -A
git commit -m "EP{N}: description of what changed"
git push
```

Netlify auto-deploys from the `main` branch. Changes are live in ~30 seconds.

---

## File Naming Conventions

- Episode JSON: `ep1.json`, `ep2.json`, etc. (lowercase, no padding)
- Image files: `lowercase-hyphenated-descriptive.png` (NO spaces)
- Segment IDs: `lowercase-hyphenated` (e.g., `quick-updates`, `take-of-the-show`)
- Keep image files reasonable size — under 2MB each ideally

---

## Project Location

```
~/Desktop/APPs/financeiscooked/
```

## Git Remote

```
https://github.com/financeiscooked/financeiscooked-soundboard
```

## Live URL

```
https://ficsoundboard.netlify.app/
```

---

## Important Notes

- The app fetches episode JSON at runtime — changes deploy with git push
- Arrow keys and spacebar navigate slides in the presenter
- The episode picker shows all episodes from `index.json`
- Slides render in order — first slide in array shows first
- Segments render in sidebar in order — first segment in array is top
- **Always include `"status"` on every segment** — either `"proposed"` or `"final"`
- **New content = proposed. Only hosts can finalize.**
- Always validate JSON before committing (no trailing commas, proper quoting)
- When in doubt, read the existing `ep1.json` as a reference
