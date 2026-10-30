import type { ReleaseVersion } from "./types";

export const RELEASES_CATALOG: ReleaseVersion[] = [
  {
    version: "0.2.0",
    releaseDate: "2026-10-30",
    channel: "stable",
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
  - Export to clean Markdown (.md) or copy formatted action items.

- **App-Specific Behaviour (Wispr Flow style)**:
  - Contextual awareness with app-level tone and formatting overrides.
  - Automatic enter-key press in chat applications (Slack, Discord, Teams).
  - Code syntax preservation (camelCase, snake_case, CLI flags) in VS Code, Cursor, and terminals.
  - Professional email layout for Gmail and Outlook.
  - Vocabulary boost keywords injected per application.

- **Enhanced Key Management**:
  - Key presets: Standard, Developer/Vim, and Ergonomic.
  - Fine-tuning sliders: Push-to-Talk hold threshold and hands-free double-tap detection window.
  - Intelligent conflict detector: warns about OS and internal shortcut clashes with 1-click resolution.

- **Upgrade Manager**:
  - In-app version verification, channel switching, and rollback monitor.`,
    isCurrent: false,
    downloadSize: "48.2 MB",
  },
  {
    version: "0.1.2",
    releaseDate: "2026-10-15",
    channel: "stable",
    title: "First Public Release with GitHub Releases Updates",
    highlights: [
      "Local Whisper speech transcription via Metal and Vulkan.",
      "AI cleanup edits with local Ollama, Anthropic, and OpenAI.",
      "Flow Bar transparent capsule with live waveform.",
      "Full offline dictionary and snippet expansions.",
    ],
    changelog: `### Initial Release v0.1.2:
- First public release of Shrimp.
- Push-to-talk and hands-free dictation across macOS and Windows.
- Whisper.cpp GPU acceleration.
- Multi-language support and transcription history.`,
    isCurrent: true,
    downloadSize: "47.8 MB",
  },
];
