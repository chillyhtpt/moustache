import type { MeetingNote } from "./types";

const STORAGE_KEY = "shrimp:meetings";

export const SAMPLE_MEETINGS: MeetingNote[] = [
  {
    id: "sample-1",
    title: "Weekly Product & Architecture Sync",
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    durationSeconds: 1540,
    template: "standup",
    userNotes:
      "Discussed local Whisper pipeline latency. Dan presented the new key management hook. Need to test on Windows 11.",
    summary:
      "The team aligned on the v0.2.0 roadmap milestones. Local Whisper model loading time has been optimized by 40%. The new meeting transcription capability (inspired by Granola and OpenWhispr) is entering internal preview. Global key management conflict resolution is planned for the next release.",
    keyPoints: [
      "Local model cold-start latency decreased from 1.2s to 0.7s on Apple Silicon and modern x64 machines.",
      "Meeting transcription workflow now generates structured summaries with action items and participant notes.",
      "App-specific behaviour rules will allow custom prompts and formatting for Slack, VS Code, and Gmail.",
      "In-app upgrade manager is being introduced for seamless version checking across Stable, Beta, and Nightly channels.",
    ],
    actionItems: [
      {
        id: "act-1",
        text: "Run performance benchmarks on Vulkan backend on Windows 11",
        assignee: "Dan",
        done: true,
      },
      {
        id: "act-2",
        text: "Draft acceptance criteria for app-specific behaviour triggers",
        assignee: "Alex",
        done: false,
      },
      {
        id: "act-3",
        text: "Add offline audio file transcription test suite",
        assignee: "Taylor",
        done: false,
      },
    ],
    decisions: [
      "Keep local transcription as the primary offline default with zero telemetry.",
      "Adopt Granola-style interactive note structure with live scratchpad sidecar.",
    ],
    rawTranscript:
      "Dan: Hey everyone, thanks for hopping on. Let's start with the speech pipeline. Alex: The local Whisper cold start is down to 700 milliseconds. Dan: That's huge. What about the meeting transcription feature? Taylor: It works smoothly! Users can record live or import recorded audio files, and we generate the summary with action items automatically.",
    segments: [
      {
        id: "seg-1",
        speaker: "Dan",
        timestamp: "00:04",
        text: "Hey everyone, thanks for hopping on. Let's start with the speech pipeline.",
      },
      {
        id: "seg-2",
        speaker: "Alex",
        timestamp: "00:15",
        text: "The local Whisper cold start is down to 700 milliseconds.",
      },
      {
        id: "seg-3",
        speaker: "Dan",
        timestamp: "00:28",
        text: "That's huge. What about the meeting transcription feature?",
      },
      {
        id: "seg-4",
        speaker: "Taylor",
        timestamp: "00:42",
        text: "It works smoothly! Users can record live or import recorded audio files, and we generate the summary with action items automatically.",
      },
    ],
  },
  {
    id: "sample-2",
    title: "1-on-1: Engineering Sprint Review",
    createdAt: new Date(Date.now() - 86400 * 1000 * 3).toISOString(),
    durationSeconds: 1200,
    template: "oneOnOne",
    userNotes: "Discussed developer ergonomics and global shortcut improvements.",
    summary:
      "Reviewed sprint accomplishments including improved global key management and conflict detection. Discussed developer workflow when dictating into terminals and IDEs with syntax preservation.",
    keyPoints: [
      "Great progress on eliminating keyboard hook conflicts with IDE shortcuts.",
      "Auto-press Enter behavior in chat apps is working reliably.",
      "Developer career growth: interest in exploring Rust GPU compute kernels.",
    ],
    actionItems: [
      {
        id: "act-201",
        text: "Document the key management conflict resolution algorithm",
        assignee: "Jordan",
        done: true,
      },
      {
        id: "act-202",
        text: "Share GPU compute research notes with the team",
        assignee: "Jordan",
        done: false,
      },
    ],
    decisions: ["Provide pre-configured developer profile with Vim-friendly shortcut bindings."],
    rawTranscript:
      "Jordan: The global shortcut conflicts in IDEs are resolved now. Dan: Awesome, that makes a big difference when coding with voice.",
    segments: [
      {
        id: "seg-201",
        speaker: "Jordan",
        timestamp: "00:02",
        text: "The global shortcut conflicts in IDEs are resolved now.",
      },
      {
        id: "seg-202",
        speaker: "Dan",
        timestamp: "00:18",
        text: "Awesome, that makes a big difference when coding with voice.",
      },
    ],
  },
];

export function loadSavedMeetings(): MeetingNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_MEETINGS));
      return SAMPLE_MEETINGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_MEETINGS;
  } catch {
    return SAMPLE_MEETINGS;
  }
}

export function saveMeetings(meetings: MeetingNote[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
  } catch {
    // Ignore storage quota errors
  }
}
