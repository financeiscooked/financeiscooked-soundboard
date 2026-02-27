# financeiscooked SoundBoard

Live show companion app for **Finance Is Cooked** — a weekly show about AI disrupting finance & accounting.

**Live URL:** https://ficsoundboard.netlify.app

## Three Tabs

1. **Soundboard** — 28 instant sound effects for live show production (air horn, Herm Edwards, Law & Order, etc.)
2. **Meme Board** — 16 meme buttons that pop up fullscreen for on-air reactions
3. **Episodes** — Slide presenter for show segments (news, takes, demos). Three view modes: **Show** (final only), **Prep** (all segments), **Proposed Bank** (all proposed across every episode). Navigate with arrow keys during the live show.

## For AI Agents: Updating Episode Content

**READ THIS FIRST:** [`EPISODE_GUIDE.md`](./EPISODE_GUIDE.md)

That file contains the complete specification for:
- Episode JSON structure and all slide types
- **Proposed vs Final segment workflow** (new content = proposed, hosts finalize)
- How to add, remove, and reorder slides and segments
- How to copy proposed segments across episodes
- How to add images
- How to create new episodes
- File naming conventions
- Deployment workflow

**Key rule:** When adding any new content, always set `"status": "proposed"`. Only change to `"final"` when the hosts explicitly confirm.

Any time you are asked to update show content (add a news article, create a segment, add an image to a slide, create a new episode, etc.), follow the instructions in `EPISODE_GUIDE.md` exactly.

## Project Structure

```
public/
├── episodes/          ← Episode data (JSON + images)
│   ├── index.json     ← Master episode list
│   ├── ep1.json       ← Episode 1 slides
│   ├── ep1/           ← Episode 1 images
│   ├── ep2/ - ep50/   ← Pre-created folders
├── memes/             ← Default meme images
├── sounds/            ← Default sound clips (mp3)
src/
├── App.jsx            ← Main app with tab navigation
├── components/        ← SoundBoard, MemeBoard, EpisodeBoard, etc.
├── sounds/            ← Sound definitions
├── memes/             ← Meme definitions
├── utils/             ← IndexedDB storage for custom uploads
```

## Running Locally

```bash
cd ~/Desktop/APPs/financeiscooked
npm install
npm run dev
```

Opens at http://localhost:5173

## Deploying

Push to `main` — Netlify auto-deploys in ~30 seconds.

```bash
git add -A
git commit -m "description of change"
git push
```

## Tech Stack

React 19, Vite, Tailwind CSS, Lucide icons. No backend — all static files.
