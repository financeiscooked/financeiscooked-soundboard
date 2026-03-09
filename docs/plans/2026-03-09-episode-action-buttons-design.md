# Episode Action Buttons — Design

## Overview

Add Accept / Move to Backlog / Delete buttons to the EpisodeBoard UI. Clicking a button constructs a `@producer` command and POSTs it to a Slack incoming webhook. The existing channelToAgentToClaude pipeline handles execution.

## Flow

```
Button click → construct @producer message → POST to Slack webhook → message appears in channel → channelToAgentToClaude picks it up → agent edits JSON + commits → replies in Slack
```

## Buttons by View Mode

### Bank (proposed segments across all episodes)
- **Accept** — opens episode picker modal → sends: `@producer move "[segment]" from backlog to EP{N} and finalize it`
- **Delete** — confirmation dialog → sends: `@producer delete "[segment]" from backlog`

### Prep (all segments for current episode)
- **Accept** — sends: `@producer finalize "[segment]" in EP{N}`
- **Move to Backlog** — sends: `@producer move "[segment]" from EP{N} to backlog`
- **Delete** — confirmation dialog → sends: `@producer delete "[segment]" from EP{N}`

### Show (final segments only)
- **Move to Backlog** — sends: `@producer move "[segment]" from EP{N} to backlog and set to proposed`

## Config

- Slack incoming webhook URL stored as `VITE_SLACK_WEBHOOK_URL` env var
- Buttons hidden if webhook URL not configured

## UI

- Small icon buttons (Check, Archive, Trash2) on segment rows/cards
- Delete always shows confirmation dialog
- Bank Accept shows episode picker modal (dropdown of available episodes)
- Brief toast notification "Sent to @producer" on success
- No response handling in UI — user sees agent reply in Slack

## Components

- `ActionButtons` — renders correct button set based on view mode
- `EpisodePicker` modal — dropdown for Bank accept
- `sendToProducer(message)` utility — POSTs to Slack webhook
- Toast notification system (simple, no library needed)

## Technical Notes

- Slack incoming webhook = single POST with `{text: "..."}` to a URL. No auth needed.
- CORS: Slack webhooks accept browser POSTs.
- The webhook URL is the only new config needed. Created in Slack app settings > Incoming Webhooks.
