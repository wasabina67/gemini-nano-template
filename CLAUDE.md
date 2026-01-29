# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A browser-based chat application that integrates with Google's Gemini Nano language model running locally on Chrome via the Chrome Prompt API. No backend AI processing - the model runs entirely on-device.

## Commands

```bash
npm i              # Install dependencies
node server.js     # Run server on http://localhost:3000
```

## Architecture

```
server.js          # Express.js server serving static files from docs/
docs/
  index.html       # Main HTML template with CDN imports (DOMPurify, Marked)
  app.js           # Client-side app: model init, session management, streaming
  styles.css       # Styling
```

**Data Flow:**
1. Check `LanguageModel` API availability in browser
2. Create session when model is ready (may require download)
3. Stream responses via `session.promptStreaming(text)`
4. Render AI messages as sanitized markdown, user messages as plain text

## Key Patterns

- **Security:** AI responses sanitized with DOMPurify before rendering as HTML; user messages use `textContent`
- **Streaming:** Async iterator pattern for real-time response updates
- **Model state:** UI reflects checking/unavailable/downloading/ready states
- **Language:** Hardcoded to Japanese (`ja`) in language options

## Chrome Setup Required

Enable these flags for Gemini Nano:
- `chrome://flags/#optimization-guide-on-device-model` → Enabled
- `chrome://flags/#prompt-api-for-gemini-nano-multimodal-input` → Enabled
