import type { ReleaseVersion } from "./types";

export const RELEASES_CATALOG: ReleaseVersion[] = [
  {
    version: "1.1.5",
    releaseDate: "2026-11-02",
    channel: "stable",
    title: "Moustache 1.1.5 - Ultra-Fast Dictation, OpenRouter, Hetzner Inference & Floating Mic Overhaul",
    highlights: [
      "Downloadable Kolibri Speech Engine: Integrated ultra-fast 32MB quantized Kolibri speech engine alongside optimized Whisper audio context for blazing dictation speeds.",
      "OpenRouter AI Provider: Added OpenRouter with free community models (Llama 3.3 70B, DeepSeek R1, Qwen 2.5 72B) and best-value paid models (DeepSeek V3, Gemini 2.0 Flash).",
      "Hetzner Inference Compliance: Full compliance with Hetzner Inference API specifications, Qwen 3.6 35B FP8 MoE model, bearer token sanitization, and reasoning tag filtering.",
      "AI Word Learning: AI cleanup transformations now automatically learn new custom vocabulary and technical jargon directly into your personal dictionary.",
      "Floating Mic Compaction: Restored compact 72x28 floating mic pill, suppressed scrollbars, and eliminated oversized margins.",
    ],
    changelog: `### What's New in Moustache 1.1.5:
- **Ultra-Fast Dictation & Kolibri Speech Engine**:
  - Integrated downloadable Kolibri Speech Engine (Ultra-Fast ggml, 32 MB) for instant on-device dictation.
  - Slashed local speech recognition audio encoder latency by up to 66% with dynamic audio context scaling (floor dropped from 768 to 256).
- **OpenRouter AI Provider**:
  - Full integration with OpenRouter (\`openrouter.ai/api/v1\`) with custom app headers (\`HTTP-Referer\`, \`X-Title\`).
  - Catalog includes top free models (\`meta-llama/llama-3.3-70b-instruct:free\`, \`deepseek/deepseek-r1:free\`, \`qwen/qwen-2.5-72b-instruct:free\`) and top value paid models (\`deepseek/deepseek-chat\`, \`google/gemini-2.0-flash-001\`, \`anthropic/claude-3-5-haiku\`).
- **Hetzner Inference API Compliance**:
  - Followed official Hetzner Inference documentation (\`inference.hetzner.com/api/v1\`).
  - Added robust Bearer token prefix & quote sanitization, custom User-Agent, and \`<think>\` reasoning block cleanup.
- **AI Vocabulary Learning**:
  - Speech enhancement pass now detects terminology and proper nouns and auto-learns them into your dictionary.
- **Floating Mic Pill Refinements**:
  - Restored true compact idle dimensions (72px × 28px) and removed oversized window buffers.
  - Eliminated unwanted scroll wheel / scrollbar behavior with explicit overflow suppression.
- **Navigation Cleanup**:
  - Removed duplicate Upgrade Manager view from the Help page.`,
    isCurrent: true,
    downloadSize: "49.8 MB",
  },
  {
    version: "1.0.2",
    releaseDate: "2026-11-02",
    channel: "stable",
    title: "Moustache 1.0.2 - Windows Native Focus Restore Fix",
    highlights: [
      "Windows HWND Thread Safety: Replaced mutex pointer wrapping with lock-free AtomicUsize for target foreground window restore.",
      "Reliable Direct Paste: Fixed Windows build failure on windows-rs HWND raw pointer concurrency constraint.",
      "Clean Compiler Hygiene: Eliminated unused imports and warnings across Windows platform modules.",
    ],
    changelog: `### What's New in Moustache 1.0.2:
- **Windows Focus Restoration Thread Safety**:
  - Fixed Windows compilation failure (E0277) where \`HWND\` raw pointers cannot be shared across threads via \`Mutex<Option<HWND>>\`.
  - Implemented a lock-free, zero-allocation \`AtomicUsize\` storage for the target foreground window handle, ensuring 100% thread safety (\`Send + Sync\`).
  - Seamlessly restores focus to the active target application before pasting transcribed text.
- **Compiler & Platform Cleanups**:
  - Removed unused platform imports on Windows.
  - Ensured seamless build pipelines across Windows, macOS, and Linux.`,
    isCurrent: false,
    downloadSize: "49.6 MB",
  },
  {
    version: "1.0.1",
    releaseDate: "2026-11-02",
    channel: "stable",
    title: "Moustache 1.0.1 - Windows Flow Bar, Focus Restore & Hetzner Inference",
    highlights: [
      "Flow Bar Pill Overhaul: Pixel-perfect capsule pill alignment matching native dimensions with frosted glass language selector.",
      "Reliable Windows Pasting: Restores target application focus before synthesized paste and permanently preserves transcribed text on clipboard.",
      "Hetzner Free Inference: Native support for Hetzner Experiments OpenAI-compatible LLM inference (Qwen 2.5 72B, DeepSeek R1).",
      "Branding & Asset Cleanup: Complete replacement of legacy Shrimp vector icons in taskbar, tray, and hidden icons with Moustache branding.",
      "Logical Tray Menu: Reordered tray actions into a cleaner, more intuitive workflow.",
    ],
    changelog: `### What's New in Moustache 1.0.1:
- **Windows Flow Bar Alignment & Styling**:
  - Replaced flat rectangular idle bar with an elegant 28px height capsule pill matching Rust window positioning.
  - Centered floating capsule dropdown for language selection on hover with glassmorphism blur and smooth transitions.
- **Windows Focus Restoration & Clipboard Retention**:
  - Automatically captures and remembers target foreground window HWND when recording starts.
  - Restores target window focus prior to synthesizing Ctrl+V.
  - Keeps transcribed text on the system clipboard permanently for quick manual pasting without timeout wipe.
  - Removed brittle UIA editable tree check that failed in Chromium and Electron apps.
- **Hetzner Free Inference API Integration**:
  - Support for Hetzner Experiments free inference API at https://inference.hetzner.com/api/v1.
  - Key management via Windows Credential Manager and OS keychains.
- **Branding & Tray Menu Refresh**:
  - Updated all vector source SVGs and regenerated taskbar, tray, and hidden icon assets.
  - Reorganized tray menu with a logical, intuitive hierarchy.`,
    isCurrent: false,
    downloadSize: "49.6 MB",
  },
  {
    version: "1.0.0",
    releaseDate: "2026-10-30",
    channel: "stable",
    title: "Moustache 1.0.0 - Production Launch",
    highlights: [
      "Wispr Flow Caps Lock Mode: Seamless push-to-talk and double-tap hands-free without uppercase lock.",
      "Granola Meeting Intelligence: Live calendar auto-join, hybrid scratchpad, and action item extractor.",
      "Post-Meeting Workflows: 1-click Follow-up emails, Slack mrkdwn, Linear/Jira tickets, and Notion notes.",
      "Wispr Flow Ultra: App-specific tone rules, voice dispatch form auto-fill, and dynamic snippet variables.",
      "Offline Mastery & Security: Multi-channel speaker diarization, prompt stacking, and team vault sync.",
    ],
    changelog: `### What's New in Moustache 1.0.0:
- **Wispr Flow Caps Lock Engine**:
  - Full Caps Lock key management: Hold Caps Lock to dictate, release to paste.
  - Double-tap Caps Lock for hands-free mode.
  - Shift + Caps Lock for normal capitalization lock without typing interference.
- **Granola Meeting Intelligence**:
  - Live calendar sync banner with auto-join timer and countdown.
  - Multi-speaker diarization timeline with live speaker renaming.
  - Bot-less system audio loopback capture (Zoom, Google Meet, Microsoft Teams).
  - Post-meeting workflow exporter: Mailto follow-up emails, Slack mrkdwn, Linear/Jira, and Notion.
- **Wispr Flow Ultra Context**:
  - Voice dispatch assistant for multi-field web and desktop form auto-fill.
  - Voice snippet expansion with dynamic variables ({{date}}, {{time}}, {{clipboard}}, {{speaker}}).
  - App-specific contextual formatting for Slack, VS Code, Discord, and Outlook.
- **Enterprise Security & Offline Power**:
  - In-app release upgrade manager with channel selection and signature verification.
  - Team vault sync with encrypted JSON bundles.
  - Sequential prompt stacking pipeline.`,
    isCurrent: false,
    downloadSize: "49.5 MB",
  },
  {
    version: "0.2.0",
    releaseDate: "2026-10-25",
    channel: "beta",
    title: "Granola Meeting Transcription & App-Specific Adaptation",
    highlights: [
      "Meeting Transcription: Granola-style structured notes with interactive action items checklist.",
      "Audio File Import: OpenWhispr capability to transcribe recorded audio files offline.",
      "App-Specific Behaviour: Contextual tone, code syntax, and auto-enter for Slack, VS Code, Discord, and Gmail.",
      "Improved Global Key Management: Custom hold duration sliders, presets, and intelligent conflict detection.",
      "Integrated Upgrade Manager: Manage channels (Stable, Beta, Nightly) and inspect release notes.",
    ],
    changelog: `### What's New in v0.2.0:
- **Meeting Transcription (Granola & OpenWhispr)**:
  - Live meeting recorder with running timer, waveform, and hybrid scratchpad for participant notes.
  - Template engine: 1-on-1 Catch-up, Team Sync, Client Meeting, Brainstorm, and General.
  - Granola note layout: Executive summary, key discussion points, decisions, and interactive action items.
  - Offline file import: Drag & drop .wav, .mp3, .m4a audio files for instant transcription.
  - Export to clean Markdown (.md) or copy formatted action items.`,
    isCurrent: false,
    downloadSize: "48.2 MB",
  },
  {
    version: "0.1.2",
    releaseDate: "2026-10-15",
    channel: "stable",
    title: "Initial Public Release",
    highlights: [
      "Local Whisper speech transcription via Metal and Vulkan.",
      "AI cleanup edits with local Ollama, Anthropic, and OpenAI.",
      "Flow Bar transparent capsule with live waveform.",
      "Full offline dictionary and snippet expansions.",
    ],
    changelog: `### Initial Release v0.1.2:
- Initial public release of Moustache desktop.
- Push-to-talk and hands-free dictation across macOS and Windows.
- Whisper.cpp GPU acceleration.
- Multi-language support and transcription history.`,
    isCurrent: false,
    downloadSize: "47.8 MB",
  },
];
