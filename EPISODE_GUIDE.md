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
      "slides": [
        { "type": "image", "title": "Show Logo", "src": "/episodes/ep1/logo.png" },
        { "type": "text", "title": "Welcome", "bullets": ["Point 1", "Point 2"] },
        { "type": "link", "title": "Article Name", "url": "https://...", "notes": "Context here" }
      ]
    }
  ]
}
```

### Slide Types

There are exactly **3 slide types**:

#### 1. `image` — Displays an image
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

#### 2. `text` — Displays bullet points
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

#### 3. `link` — Displays an article/URL card
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

### REMOVE a slide

1. Read the episode JSON
2. Find and remove the slide object from the segment's `slides` array
3. If it was an image slide, optionally delete the image file too (not required)
4. Write the updated JSON
5. Commit and push

### CREATE a new segment

Add a new segment object to the `segments` array at the desired position:
```json
{
  "id": "sponsor-break",
  "name": "Sponsor Break",
  "slides": [
    {
      "type": "image",
      "title": "Brought to you by...",
      "src": "/episodes/ep{N}/sponsor-logo.png"
    }
  ]
}
```

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
- Always validate JSON before committing (no trailing commas, proper quoting)
- When in doubt, read the existing `ep1.json` as a reference
