# Changelog

All notable changes to Shrimp. Versions follow [Semantic Versioning](https://semver.org).

## 1.1.5 (2026-11-02)

- **Downloadable Kolibri Speech Engine**:
  - Integrated ultra-fast 32MB quantized ggml Kolibri speech engine for instant on-device dictation.
  - Slashed local speech recognition audio encoder latency by up to 66% with dynamic audio context scaling (floor dropped from 768 to 256).
- **OpenRouter AI Provider**:
  - Added OpenRouter (`openrouter.ai/api/v1`) with free community models (Llama 3.3 70B, DeepSeek R1, Qwen 2.5 72B) and top value paid models (DeepSeek V3, Gemini 2.0 Flash, Claude 3.5 Haiku).
- **Hetzner Inference API Compliance**:
  - Fully compliant with official Hetzner Inference API (`inference.hetzner.com/api/v1`), including bearer token sanitization, custom User-Agent, and reasoning block cleanup (`<think>`).
- **AI Vocabulary Auto-Learning**:
  - Integrated automatic dictionary learning into the AI post-processing pass for custom vocabulary, jargon, and proper nouns.
- **Floating Mic Refinements**:
  - Restored compact 72x28 idle pill size, removed oversized margins, and suppressed scrollbars.
- **Navigation Cleanup**:
  - Removed redundant Upgrade Manager view from the Help page.

## 0.1.2 (2026-10-15)

The first public release.

- Updates come from GitHub Releases. Shrimp checks
  `https://github.com/WHEREISDAN/shrimp/releases/latest/download/latest.json` a minute
  after launch and every six hours; "Check for updates…" in the tray checks right away.
- Shrimp is released under the MIT license. The app bundle now includes `LICENSE` and
  `THIRD_PARTY_NOTICES.md`, the licenses of the open-source software it ships.
- Test fixtures and examples use generic sample names.

0.1.0 and 0.1.1 were built without an update feed, so they can't update themselves.
Install 0.1.2 from the DMG or the Windows installer once; later versions arrive through
the in-app updater.

## 0.1.1 (2026-10-14)

- Every screen redesigned in light and dark, with the title bar as part of the window.
- A new waveform shrimp logo, app icons and tray icons.
- The Flow Bar is a calm dark capsule.
- Windows: the main window resizes from every edge and corner, the title area opens the
  window menu, Windows 10 gets a shadow and a hairline instead of the frame line, and the
  tray icon is drawn at the taskbar's own size.

## 0.1.0 (2026-10-13)

The first version, never published.

- Push-to-talk and hands-free dictation into any app, transcribed locally with Whisper
  (Metal on Apple Silicon, Vulkan or the CPU on Windows).
- Optional AI edits through Anthropic, OpenAI, Groq or a local Ollama: filler removal,
  self-corrections, lists, punctuation, app-aware styles, formatting per app, a personal
  dictionary and snippets. Optional cloud transcription through OpenAI or Groq.
- Command Mode, transforms, context awareness and coding features.
- History, insights, languages, microphone handling, sounds, media control, onboarding
  and accessibility.
- A notarized DMG for macOS, a per-user installer for Windows and in-app updates.
