# Moustache Product Roadmap

This document outlines the strategic roadmap and future vision for **Moustache**, synthesizing the finest capabilities of **Granola**, **Wispr Flow**, and **OpenWhispr** into a unified, privacy-first desktop voice intelligence platform.

---

## 🎯 Vision

Moustache is the ultimate open desktop companion for speech-to-text, real-time meeting intelligence, and context-aware dictation. Completely private by default, Moustache blends lightning-fast local speech recognition with app-aware contextual transformations to make talking faster, more natural, and more expressive than typing.

---

## 🗺️ Milestone Overview

```mermaid
flowchart TD
    M1["Phase 1: Engine & Audio Foundation"] --> M2["Phase 2: Granola Meeting Intelligence"]
    M2 --> M3["Phase 3: Wispr Flow Ultra App Context"]
    M3 --> M4["Phase 4: OpenWhispr Offline Mastery"]
    M4 --> M5["Phase 5: Cross-Platform & Mobile Sync"]
```

---

## Phase 1: Core Engine & Audio Pipeline

_Goal: Sub-200ms latency, zero dropped syllables, and studio-grade audio capture._

- [x] **Global Key Management Suite**
  - [x] Push-to-talk hold sliders (100ms–1000ms threshold)
  - [x] Double-tap detection window calibration (150ms–600ms)
  - [x] Automatic stuck-key recovery failsafe
  - [x] Real-time shortcut conflict detector and profile switcher (Vim, Coder, One-Handed)
- [ ] **Whisper Large-v3-Turbo & Distil-Whisper Integration**
  - [ ] Bundle pre-quantized `large-v3-turbo` GGUF models for 8x speedup on Apple Silicon and modern x64 GPUs.
  - [ ] Add streaming interim transcript display directly into the Flow Bar capsule.
- [ ] **Adaptive Noise Gate & Dual-Channel Cancellation**
  - [ ] Voice Activity Detection (VAD) with Silero v5 for accurate sentence boundary detection.
  - [ ] Automatic background hum filtering (fans, AC, keyboard clicks).
- [ ] **Multi-Channel Speaker Diarization**
  - [ ] Local PyAnnote / Sortformer integration for identifying who is speaking in multi-person rooms without external cloud services.

---

## Phase 2: Meeting Intelligence 2.0 (Granola Supercharged)

_Goal: Turn messy verbal syncs into structured executive decisions, action items, and knowledge bases._

- [x] **Meeting Scratchpad & Template Engine**
  - [x] Real-time hybrid notes: AI blends your live typed scratchpad bullet points with verbatim spoken audio.
  - [x] Pre-built templates for 1-on-1s, Standups, Sales / Client syncs, and Brainstorms.
  - [x] Interactive checkable action item extraction with auto-assigned stakeholders.
  - [x] One-click Markdown (`.md`) export.
- [ ] **Bot-less System Audio Loopback Recording**
  - [ ] Native macOS (CoreAudio / ScreenCaptureKit) and Windows (WASAPI Loopback) system audio capture—no awkward meeting bots joining your Zoom, Google Meet, or Microsoft Teams calls.
- [ ] **Calendar & Meeting Auto-Join Integration**
  - [ ] Connect Google Calendar and Microsoft 365 / Outlook (local OAuth tokens).
  - [ ] Proactive notification 60 seconds before calls: _"Start Moustache meeting notes for Product Sync?"_
- [ ] **Automated Post-Meeting Workflows**
  - [ ] Instant follow-up email generator tailored to meeting participants.
  - [ ] Direct export connectors: Notion databases, Slack channels, HubSpot/Salesforce deal logs, and Linear/Jira ticket creators.

---

## Phase 3: Wispr Flow Ultra (Deep App Awareness & Voice Macros)

_Goal: The app automatically behaves like an expert for whatever software you are using._

- [x] **Contextual Tone & Formatting Rules**
  - [x] Chat mode: concise sentences and auto-press Enter for Slack, Discord, and Telegram.
  - [x] Code mode: preserve syntax, case conversions (`camelCase`, `snake_case`, `UPPER_SNAKE`), and symbol formatting for VS Code and Cursor.
  - [x] Email mode: formal salutations and polite phrasing for Gmail and Outlook.
  - [x] Vocabulary boost tags per application.
  - [x] Interactive test workbench rule simulator.
- [ ] **Screen & Field Vision Context (OCR + Accessibility Tree)**
  - [ ] Capture the active input box placeholder and visible form labels to autofill multi-field web forms via voice.
  - [ ] Multi-turn conversational voice editing: _"Fix the second bullet point and make it sound punchier."_
- [ ] **Voice Snippet Variables & Dynamic Expansion**
  - [ ] Snippets that accept dynamic voice parameters (e.g., saying _"snippet calendar for tomorrow at 3"_ inserts your formatted meeting invite with dynamic dates).
- [ ] **Cross-Application Voice Macros**
  - [ ] Chain spoken actions: _"Send this to Sarah on Slack and archive the email."_

---

## Phase 4: OpenWhispr Offline Power & Enterprise Security

_Goal: Uncompromising privacy, air-gapped readiness, and sovereign AI control._

- [x] **Offline Audio File Transcriber**
  - [x] Support drag-and-drop batch import of `.mp3`, `.wav`, `.m4a`, and `.aac` audio recordings.
- [x] **In-App Upgrade Manager**
  - [x] Channel selector (Stable, Beta, Nightly) with live progress bar and release catalog.
- [ ] **Local LLM Fine-Tuning & Prompt Stacking**
  - [ ] Run fully local GGUF models via llama.cpp or Ollama without sending any data over the internet.
  - [ ] Allow custom system prompt stacking per project or client workspace.
- [ ] **Team & Organization Vault Sync**
  - [ ] Git-backed or encrypted S3 team dictionary & snippet library synchronization.
  - [ ] Zero-knowledge client-side encryption for cloud backup options.

---

## Phase 5: Multi-Modal Expansion & Linux First-Class Support

_Goal: Moustache everywhere—desktop, terminal, and mobile._

- [x] **Linux Backend Foundation**
  - [x] Stubs and core traits implemented for Linux platform builds.
- [ ] **Native Linux UI & Wayland / X11 Global Hotkeys**
  - [ ] Global shortcut listener using `libinput` / X11 / Wayland desktop portals.
  - [ ] PipeWire / ALSA audio source integration for Linux desktop users.
- [ ] **Local Network Mobile Companion App (iOS / Android)**
  - [ ] Turn your phone into a high-fidelity wireless microphone for your computer over local Wi-Fi or Bluetooth.
  - [ ] Peer-to-peer sync without intermediate cloud servers.
- [ ] **Moustache CLI (`moustache-cli`)**
  - [ ] Pipe audio files directly into terminal standard output: `moustache transcribe meeting.mp3 --template standup > notes.md`.

---

## 💡 Submitting Feature Requests

Have an idea or want to vote on roadmap items? Open a proposal on [GitHub Discussions](https://github.com/chillyhtpt/moustache/discussions) or submit a feature request on [GitHub Issues](https://github.com/chillyhtpt/moustache/issues).
