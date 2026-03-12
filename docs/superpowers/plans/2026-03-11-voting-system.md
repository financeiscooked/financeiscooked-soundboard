# Voting System Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add anonymous upvote/downvote voting on proposed slides in the Bank view, backed by Netlify Blobs.

**Architecture:** A single Netlify function handles GET (read counts) and POST (cast vote). Votes stored in Netlify Blobs `votes` store keyed by `{episodeId}:{segmentId}:{slideIndex}`. Frontend fetches all votes on Bank load and updates optimistically on click.

**Tech Stack:** Netlify Blobs (`@netlify/blobs`), Netlify Functions, React

---

## File Structure

- **Create:** `netlify/functions/vote.js` — Netlify function for reading/writing votes
- **Modify:** `src/components/EpisodeBoard.jsx` — Add vote UI to ProposedSlideCard
- **Modify:** `package.json` — Add `@netlify/blobs` dependency

---

### Task 1: Add @netlify/blobs dependency

- [ ] **Step 1:** Install the package
  ```bash
  npm install @netlify/blobs
  ```
- [ ] **Step 2:** Commit
  ```bash
  git add package.json package-lock.json
  git commit -m "chore: add @netlify/blobs dependency"
  ```

### Task 2: Create vote Netlify function

**Files:**
- Create: `netlify/functions/vote.js`

- [ ] **Step 1:** Create the vote function with GET and POST handlers

  GET `?key=ep2:in-the-news:0` — returns single vote count
  GET `?prefix=ep2` — returns all votes for an episode
  POST `{ key, direction }` — increments up/down count, returns new totals

- [ ] **Step 2:** Commit
  ```bash
  git add netlify/functions/vote.js
  git commit -m "feat: add vote Netlify function with Blobs backend"
  ```

### Task 3: Add vote UI to ProposedSlideCard

**Files:**
- Modify: `src/components/EpisodeBoard.jsx`

- [ ] **Step 1:** Add VoteButtons component with up/down arrows and count display
- [ ] **Step 2:** Add vote fetching in ProposedBank (batch by episode prefix)
- [ ] **Step 3:** Wire VoteButtons into ProposedSlideCard
- [ ] **Step 4:** Optimistic UI update on click
- [ ] **Step 5:** Build and verify
- [ ] **Step 6:** Commit
  ```bash
  git add src/components/EpisodeBoard.jsx
  git commit -m "feat: add voting UI to proposed slide cards in Bank view"
  ```

### Task 4: Push and verify

- [ ] **Step 1:** Push to GitHub, verify Netlify deploy
