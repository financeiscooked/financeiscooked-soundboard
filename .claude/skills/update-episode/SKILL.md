---
name: update-episode
description: Update Finance Is Cooked show episode content — add segments, slides, news articles, images, create new episodes, move segments between proposed and final. Use this whenever asked to modify show content.
argument-hint: [what to update, e.g. "add a vibecoding segment to EP3"]
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# Finance Is Cooked — Episode Content Update

You are updating episode content for the **Finance Is Cooked** show. Follow these instructions exactly.

**User request:** $ARGUMENTS

---

## Step 1: Understand the Request

Determine which operation is needed:
- Adding a slide to an existing segment
- Adding a new segment
- Removing a slide or segment
- Moving a segment from proposed → final
- Copying a segment between episodes
- Creating a new episode
- Reordering slides or segments

## Step 2: Read Current State

Always read the relevant episode JSON before making changes:
```
public/episodes/ep{N}.json
```

If you need the episode list: `public/episodes/index.json`

## Architecture

```
public/episodes/
├── index.json              ← Master list of all episodes
├── ep{N}.json              ← Episode slide data
├── ep{N}/                  ← Episode images/assets
├── ep3/ ... ep50/          ← Pre-created folders (ready to use)
```

## Segment Status: CRITICAL RULE

Every segment has a `"status"` field: `"proposed"` or `"final"`.

**ALWAYS set new segments to `"status": "proposed"`** unless the user explicitly says to make it final. This is non-negotiable. New content = proposed. Only hosts finalize.

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
      "slides": [...]
    },
    {
      "id": "hot-take",
      "name": "Hot Take: Vibecoding",
      "status": "proposed",
      "slides": [...]
    }
  ]
}
```

## Slide Types (4 types)

### `gallery` — Multiple images in a grid
```json
{
  "type": "gallery",
  "title": "Slide title",
  "images": [
    { "src": "/episodes/ep{N}/image1.png", "alt": "Description" },
    { "src": "/episodes/ep{N}/image2.png", "alt": "Description" }
  ],
  "notes": "Optional speaker notes"
}
```
- 4+ images → 2-column grid. Fewer → single row.

### `image` — Single image
```json
{
  "type": "image",
  "title": "Slide title",
  "src": "/episodes/ep{N}/filename.png",
  "notes": "Optional notes"
}
```
- `src` path is relative to public folder
- File MUST exist at `public/episodes/ep{N}/filename.ext`
- Formats: .png, .jpg, .jpeg, .gif, .webp

### `text` — Bullet points
```json
{
  "type": "text",
  "title": "Slide title",
  "bullets": ["Point 1", "Point 2", "Point 3"],
  "notes": "Optional notes"
}
```
- 3-6 bullets per slide. Keep them concise for live TV.

### `link` — Article/URL card
```json
{
  "type": "link",
  "title": "Headline or Article Name",
  "url": "https://full-url-here.com/article",
  "notes": "Context and talking points for the hosts"
}
```

## Standard Segments

Use these IDs for standard segments:

| ID | Name |
|---|---|
| `cold-open` | Cold Open + Intro |
| `app-of-the-show` | App of the Show |
| `quick-updates` | 90 Seconds Quick Updates |
| `take-of-the-show` | Take of the Show |
| `ai-thing` | One Thing I Did with AI |
| `app-checkin` | Check In on App of the Show |
| `whats-coming` | What's Coming |
| `outtro` | Outtro |

Custom segments: use a unique `id` (lowercase, hyphenated) and clear `name`.

## File Naming

- Episode JSON: `ep1.json`, `ep2.json` (lowercase, no padding)
- Images: `lowercase-hyphenated-descriptive.png` (NO spaces)
- Segment IDs: `lowercase-hyphenated`
- Images under 2MB each

## Creating a New Episode

1. Create `public/episodes/ep{N}.json` — copy structure from a previous episode, update id/title/date, set all segments to `"status": "proposed"`
2. Folder `public/episodes/ep{N}/` already exists (pre-created up to ep50)
3. Add to `public/episodes/index.json`:
```json
{ "id": "ep{N}", "title": "Episode {N} - Title Here", "date": "YYYY-MM-DD" }
```

## Copying Segments Between Episodes

1. Read source episode, find the segment
2. Read target episode
3. Copy segment into target's `segments` array
4. Update image `src` paths to target episode folder
5. Copy image files to target episode folder
6. Set status as instructed (default: `"proposed"`)

## Step 3: Make Changes and Deploy

After making your changes:

```bash
cd ~/Desktop/APPs/financeiscooked
git add -A
git commit -m "EP{N}: description of what changed"
git push
```

Netlify auto-deploys from `main`. Live in ~30 seconds at https://ficsoundboard.netlify.app/

## Reminders

- Always validate JSON (no trailing commas, proper quoting)
- New content = `"proposed"`. Only finalize when told to.
- Read existing `ep1.json` as a reference if unsure about structure
- Arrow keys navigate slides in the app
- When in doubt, ask the hosts for clarification
