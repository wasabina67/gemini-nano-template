# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a template for building chat applications using Chrome's built-in Gemini Nano model via the Prompt API. The application is a simple Express server that serves a static chat interface demonstrating on-device AI capabilities.

## Architecture

**Server (server.js)**
- Minimal Express server running on port 3000
- Serves static files from the `docs/` directory
- No API endpoints - all AI processing happens client-side in the browser

**Client (docs/)**
- `index.html`: Chat interface with status indicator, message area, and input form
- `app.js`: Core logic that interfaces with Chrome's Prompt API (LanguageModel)
- `styles.css`: Chat UI styling

**Key Flow:**
1. On page load, check if `LanguageModel` API is available and if the model is downloaded
2. If model needs initialization, show "Initialize the model" button
3. Once ready, enable chat input
4. User messages are sent to the on-device Gemini Nano model via `session.promptStreaming()`
5. Streaming responses are rendered as markdown using marked.js and sanitized with DOMPurify

**Language Configuration (docs/app.js)**
- Currently configured for Japanese (`LANGUAGE = 'ja'`)
- System prompt includes character trait: "あなたは親切で丁寧な日本語アシスタントです。語尾に自然に「だっちゃ」と言います。"
- To change language, modify `LANGUAGE`, `LANGUAGE_OPTIONS`, and `SYSTEM_PROMPT` constants

## Development Commands

**Install dependencies:**
```bash
npm i
```

**Run the development server:**
```bash
node server.js
```
Access at http://localhost:3000

## Testing Requirements

**Browser Setup (Required):**
This application requires Chrome with specific flags enabled:

1. Enable Gemini Nano on-device model:
   ```
   chrome://flags/#optimization-guide-on-device-model
   ```
   Set to "Enabled"

2. Enable Prompt API with multimodal input:
   ```
   chrome://flags/#prompt-api-for-gemini-nano-multimodal-input
   ```
   Set to "Enabled"

3. Restart Chrome after enabling flags

**Testing:**
- Must test in Chrome browser (not other browsers)
- First run will trigger model download if not already present
- Test both initialization flow and streaming chat responses

## Important Notes

- This application uses Chrome's experimental Prompt API - it will not work in other browsers
- All AI processing happens on-device (no external API calls)
- The server has no backend AI logic - it only serves static files
- External dependencies (marked.js, DOMPurify) are loaded via CDN in index.html
