import type { ReleaseVersion } from "./types";

export const RELEASES_CATALOG: ReleaseVersion[] = [
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
    isCurrent: true,
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
