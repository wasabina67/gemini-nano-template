# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A web template demonstrating Google's Gemini Nano language model integration via Chrome's experimental Prompt API. The application provides an on-device AI chat interface with streaming responses.

## Commands

```bash
npm i              # Install dependencies
node server.js     # Start Express server on http://localhost:3000
```

No build, test, or lint commands are configured.

## Architecture

**Backend (`server.js`):** Minimal Express.js static file server serving the `docs/` directory.

**Frontend (`docs/`):**
- `index.html` - Chat UI structure
- `app.js` - Chrome LanguageModel API integration with streaming responses
- `styles.css` - Chat interface styling

## Key Technical Details

- Uses Chrome's `LanguageModel` Prompt API (requires Chrome flags enabled)
- Configured for Japanese language (`ja`)
- Streaming responses via `session.promptStreaming()`
- Single session instance pattern
- Vanilla JavaScript with marked.js for Markdown rendering
