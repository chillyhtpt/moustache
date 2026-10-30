import {
  Briefcase,
  Check,
  CheckSquare,
  Clock,
  Copy,
  Download,
  Edit2,
  FileAudio,
  FileText,
  Lightbulb,
  ListChecks,
  Mic,
  Pause,
  Play,
  Radio,
  Search,
  Sparkles,
  Square,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CalendarBanner } from "./calendar/CalendarBanner";
import type { CalendarEvent } from "./calendar/types";
import { MEETING_TEMPLATES } from "./meetingTemplates";
import { loadSavedMeetings, saveMeetings } from "./mockMeetings";
import { PostMeetingWorkflowDialog } from "./PostMeetingWorkflowDialog";
import type { MeetingNote, TemplateId, TranscriptSegment } from "./types";

const ICONS: Record<TemplateId, React.ComponentType<{ className?: string }>> = {
  general: FileText,
  oneOnOne: Users,
  standup: ListChecks,
  sales: Briefcase,
  brainstorm: Lightbulb,
};

export function MeetingPage() {
  const searchId = useId();
  const [meetings, setMeetings] = useState<MeetingNote[]>(() => loadSavedMeetings());
  const [selectedId, setSelectedId] = useState<string | null>(meetings[0]?.id ?? null);
  const [search, setSearch] = useState("");
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Live recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [liveUserNotes, setLiveUserNotes] = useState("");
  const [liveTemplate, setLiveTemplate] = useState<TemplateId>("general");
  const [liveTitle, setLiveTitle] = useState("");
  const [liveSegments, setLiveSegments] = useState<TranscriptSegment[]>([]);

  // File import state
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importFileName, setImportFileName] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  // Calendar, workflows & diarization state
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [useLoopback, setUseLoopback] = useState(true);
  const [renamingSpeaker, setRenamingSpeaker] = useState<{
    oldName: string;
    newName: string;
  } | null>(null);

  useEffect(() => {
    saveMeetings(meetings);
  }, [meetings]);

  // Recording timer
  useEffect(() => {
    if (!isRecording || isPaused) return;
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  // Simulated live speech segments while recording
  useEffect(() => {
    if (!isRecording || isPaused) return;
    const sampleSentences = [
      "Let's review the timeline for the v0.2 release and ensure our test suite passes.",
      "The local Whisper engine has lower latency now, which improves meeting capture.",
      "Should we verify the app-specific behaviour in Slack and VS Code before shipping?",
      "Agreed, let's also test the upgrade manager to make sure version checks don't block.",
      "I will follow up on the Linux and Windows packaging benchmarks today.",
    ];
    const timer = setInterval(() => {
      const mins = Math.floor(elapsedSeconds / 60)
        .toString()
        .padStart(2, "0");
      const secs = (elapsedSeconds % 60).toString().padStart(2, "0");
      const speaker = liveSegments.length % 2 === 0 ? "You" : "Participant";
      const sentence =
        sampleSentences[liveSegments.length % sampleSentences.length] ??
        "Reviewing updates and deliverables.";
      const newSeg: TranscriptSegment = {
        id: `seg-${Date.now()}`,
        speaker,
        timestamp: `${mins}:${secs}`,
        text: sentence,
      };
      setLiveSegments((prev) => [...prev, newSeg]);
    }, 8000);
    return () => clearInterval(timer);
  }, [isRecording, isPaused, elapsedSeconds, liveSegments.length]);

  const filteredMeetings = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return meetings;
    return meetings.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.userNotes.toLowerCase().includes(q) ||
        m.rawTranscript.toLowerCase().includes(q),
    );
  }, [meetings, search]);

  const selectedMeeting = useMemo(() => {
    const match = filteredMeetings.find((m) => m.id === selectedId);
    return match ?? filteredMeetings[0] ?? null;
  }, [filteredMeetings, selectedId]);

  const uniqueSpeakers = useMemo(() => {
    if (!selectedMeeting) return [];
    return Array.from(new Set(selectedMeeting.segments.map((s) => s.speaker)));
  }, [selectedMeeting]);

  const handleStartFromCalendar = (event: CalendarEvent) => {
    setIsRecording(true);
    setIsPaused(false);
    setElapsedSeconds(0);
    setLiveTemplate(event.suggestedTemplate);
    setLiveTitle(event.title);
    setLiveUserNotes(
      `Attendees: ${event.attendees.join(", ")}\nMeeting Link: ${event.meetingUrl || "N/A"}\n\nObjectives:\n- Review roadmap and deliverable statuses\n- Clear engineering and release blockers`,
    );
    setLiveSegments([
      {
        id: `seg-${Date.now()}`,
        speaker: "You",
        timestamp: "00:01",
        text: `Starting meeting for ${event.title}. Participants present: ${event.attendees.join(", ")}.`,
      },
    ]);
  };

  const handleRenameSpeaker = () => {
    if (!renamingSpeaker || !renamingSpeaker.newName.trim() || !selectedMeeting) return;
    const { oldName, newName } = renamingSpeaker;
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== selectedMeeting.id) return m;
        return {
          ...m,
          segments: m.segments.map((s) =>
            s.speaker === oldName ? { ...s, speaker: newName.trim() } : s,
          ),
        };
      }),
    );
    setRenamingSpeaker(null);
  };

  const startMeeting = () => {
    setIsRecording(true);
    setIsPaused(false);
    setElapsedSeconds(0);
    setLiveUserNotes("");
    setLiveTitle(
      `Meeting on ${new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`,
    );
    setLiveSegments([
      {
        id: `seg-${Date.now()}`,
        speaker: "You",
        timestamp: "00:01",
        text: "Meeting started. Capturing conversation with speech recognition...",
      },
    ]);
  };

  const finishMeeting = () => {
    const transcriptText = liveSegments.map((s) => `${s.speaker}: ${s.text}`).join("\n");
    const newNote: MeetingNote = {
      id: `meeting-${Date.now()}`,
      title: liveTitle || "Meeting Notes",
      createdAt: new Date().toISOString(),
      durationSeconds: elapsedSeconds || 1,
      template: liveTemplate,
      userNotes: liveUserNotes,
      summary: `Automated summary of ${liveTemplate} meeting. Key discussions centered on execution, technical milestones, and team synchronization. ${liveUserNotes ? `User noted: "${liveUserNotes}".` : ""}`,
      keyPoints: [
        "Discussion of core goals and alignment across engineering and product.",
        "Verification of voice input accuracy and multi-platform compatibility.",
        "Review of open questions and immediate sprint deliverables.",
      ],
      actionItems: [
        {
          id: `act-${Date.now()}-1`,
          text: "Review meeting action items and assign ownership",
          assignee: "Team",
          done: false,
        },
        {
          id: `act-${Date.now()}-2`,
          text: "Verify feature branch and test builds before release",
          assignee: "You",
          done: false,
        },
      ],
      decisions: [
        "Adopt Granola structured layout with interactive task tracking.",
        "Ship app-specific behavior profiles and in-app upgrade manager.",
      ],
      rawTranscript: transcriptText,
      segments: liveSegments,
    };

    setMeetings((prev) => [newNote, ...prev]);
    setSelectedId(newNote.id);
    setIsRecording(false);
    setIsPaused(false);
  };

  const cancelMeeting = () => {
    setIsRecording(false);
    setIsPaused(false);
  };

  const toggleActionItem = (meetingId: string, itemId: string) => {
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          actionItems: m.actionItems.map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item,
          ),
        };
      }),
    );
  };

  const deleteMeeting = (id: string) => {
    setMeetings((prev) => prev.filter((m) => m.id !== id));
    if (selectedId === id) {
      const remaining = meetings.filter((m) => m.id !== id);
      setSelectedId(remaining[0]?.id ?? null);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(label);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const exportMarkdown = (meeting: MeetingNote) => {
    const md = [
      `# ${meeting.title}`,
      `*Date: ${new Date(meeting.createdAt).toLocaleString()} | Duration: ${Math.floor(meeting.durationSeconds / 60)}m ${meeting.durationSeconds % 60}s*`,
      "",
      "## Executive Summary",
      meeting.summary,
      "",
      "## Key Discussion Points",
      ...meeting.keyPoints.map((p) => `- ${p}`),
      "",
      "## Action Items",
      ...meeting.actionItems.map(
        (a) => `- [${a.done ? "x" : " "}] ${a.text}${a.assignee ? ` (@${a.assignee})` : ""}`,
      ),
      "",
      "## Decisions Made",
      ...meeting.decisions.map((d) => `- ${d}`),
      "",
      meeting.userNotes ? `## Scratchpad Notes\n${meeting.userNotes}\n` : "",
      "## Transcript",
      ...meeting.segments.map((s) => `**[${s.timestamp}] ${s.speaker}:** ${s.text}`),
    ].join("\n");

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${meeting.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSimulateFileImport = () => {
    if (!importFileName) return;
    setIsImporting(true);
    setTimeout(() => {
      const newNote: MeetingNote = {
        id: `import-${Date.now()}`,
        title: importFileName.replace(/\.[^/.]+$/, ""),
        createdAt: new Date().toISOString(),
        durationSeconds: 1820,
        template: "general",
        userNotes: "Imported recorded audio file using OpenWhispr-compatible engine.",
        summary:
          "Audio file transcription completed. The meeting covered customer requirements, technical debt reduction, and timeline commitments for upcoming deliverable milestones.",
        keyPoints: [
          "Imported conversation parsed accurately with high confidence score.",
          "Clear breakdown of speaker turns and key topic transitions.",
          "Identified two critical action items requiring immediate follow-up.",
        ],
        actionItems: [
          {
            id: `act-imp-1`,
            text: "Follow up with stakeholders regarding technical specification",
            assignee: "Lead Engineer",
            done: false,
          },
          {
            id: `act-imp-2`,
            text: "Finalize integration roadmap document",
            assignee: "Product Manager",
            done: true,
          },
        ],
        decisions: ["Proceed with the current architecture and schedule weekly checkpoints."],
        rawTranscript:
          "Speaker 1: Welcome everyone. Today we are reviewing the recorded audio file. Speaker 2: We have processed all key points and deliverables.",
        segments: [
          {
            id: `seg-imp-1`,
            speaker: "Speaker 1",
            timestamp: "00:02",
            text: "Welcome everyone. Today we are reviewing the recorded audio file.",
          },
          {
            id: `seg-imp-2`,
            speaker: "Speaker 2",
            timestamp: "00:14",
            text: "We have processed all key points and deliverables.",
          },
        ],
      };
      setMeetings((prev) => [newNote, ...prev]);
      setSelectedId(newNote.id);
      setIsImporting(false);
      setShowImportDialog(false);
      setImportFileName("");
    }, 1200);
  };

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  };

  return (
    <div className="flex h-full flex-col p-6">
      {/* Top Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Users className="size-6 text-brand" />
            Meetings & AI Notes
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Granola-style intelligent meeting transcription, live scratchpad notes, templates, and
            OpenWhispr audio import.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {!isRecording ? (
            <>
              <Button
                variant="outline"
                className="gap-2 cursor-pointer"
                onClick={() => setShowImportDialog(true)}
              >
                <Upload className="size-4" />
                Import Audio
              </Button>
              <Button
                className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90 cursor-pointer"
                onClick={startMeeting}
              >
                <Mic className="size-4" />
                Record Meeting
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500 animate-pulse">
                <span className="size-2 rounded-full bg-red-500" />
                Live {formatDuration(elapsedSeconds)}
              </span>
              <Button variant="outline" size="sm" onClick={() => setIsPaused((p) => !p)}>
                {isPaused ? (
                  <Play className="size-3.5 mr-1" />
                ) : (
                  <Pause className="size-3.5 mr-1" />
                )}
                {isPaused ? "Resume" : "Pause"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-muted-foreground"
                onClick={cancelMeeting}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-brand text-brand-foreground hover:bg-brand/90"
                onClick={finishMeeting}
              >
                <Check className="size-3.5 mr-1" />
                Finish & Generate Notes
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Calendar Integration Banner */}
      {!isRecording && <CalendarBanner onStartFromCalendar={handleStartFromCalendar} />}

      {/* Live Recording Modal / Active View */}
      {isRecording && (
        <div className="mb-6 rounded-xl border border-brand/30 bg-card p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1">
              <Input
                value={liveTitle}
                onChange={(e) => setLiveTitle(e.target.value)}
                placeholder="Meeting Title..."
                className="text-lg font-semibold border-none px-0 shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="meeting-template" className="text-xs text-muted-foreground">
                Template:
              </label>
              <select
                id="meeting-template"
                value={liveTemplate}
                onChange={(e) => setLiveTemplate(e.target.value as TemplateId)}
                className="rounded-md border border-input bg-background px-2.5 py-1 text-xs text-foreground"
              >
                {MEETING_TEMPLATES.map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bot-less Dual Loopback Audio Selector & VU activity */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/80 bg-background/50 px-3.5 py-2">
            <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={useLoopback}
                onChange={(e) => setUseLoopback(e.target.checked)}
                className="rounded border-input text-brand focus:ring-brand"
              />
              <Radio className="size-3.5 text-brand" />
              <span>Bot-less Dual Loopback (Mic + Zoom / Teams / Meet Audio)</span>
            </label>
            {useLoopback && (
              <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px]">MIC</span>
                  <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px]">LOOPBACK</span>
                  <span className="inline-block size-2 rounded-full bg-brand animate-pulse" />
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Live scratchpad (Granola signature feature) */}
            <div className="flex flex-col rounded-lg border border-border/80 bg-background/50 p-3.5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <FileText className="size-3.5 text-brand" />
                  Your Notes (Scratchpad)
                </span>
                <span className="text-[11px] text-muted-foreground">
                  AI blends your notes with speech
                </span>
              </div>
              <textarea
                value={liveUserNotes}
                onChange={(e) => setLiveUserNotes(e.target.value)}
                placeholder="Jot down key decisions, questions, or action items as you listen..."
                rows={6}
                className="w-full resize-none bg-transparent text-sm placeholder:text-muted-foreground/60 outline-none"
              />
            </div>

            {/* Live speech recognition transcription stream */}
            <div className="flex flex-col rounded-lg border border-border/80 bg-background/50 p-3.5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Mic className="size-3.5 text-brand animate-pulse" />
                  Live Transcript Stream
                </span>
                <span className="text-[11px] text-muted-foreground">Whisper Speech-to-Text</span>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-2 text-xs">
                {liveSegments.map((seg) => (
                  <div key={seg.id} className="rounded bg-muted/40 p-2">
                    <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground mb-0.5">
                      <span className="text-brand font-semibold">{seg.speaker}</span>
                      <span>{seg.timestamp}</span>
                    </div>
                    <p className="text-foreground">{seg.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Left Column: Meeting List */}
        <div className="lg:col-span-4 flex flex-col gap-3 min-h-0 border-r border-border/60 pr-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <label htmlFor={searchId} className="sr-only">
              Search meetings
            </label>
            <Input
              id={searchId}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search meetings, notes, transcript..."
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
            <span>{filteredMeetings.length} saved meetings</span>
            <span>Local & Private</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredMeetings.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No meetings found. Record a meeting or import audio.
              </div>
            ) : (
              filteredMeetings.map((m) => {
                const Icon = ICONS[m.template] || FileText;
                const isSelected = m.id === selectedId;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedId(m.id)}
                    className={cn(
                      "group w-full rounded-lg border p-3 text-left transition-colors duration-100 cursor-pointer",
                      isSelected
                        ? "border-brand/50 bg-brand/5"
                        : "border-border/60 bg-card hover:bg-accent/40",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon
                          className={cn(
                            "size-4 shrink-0",
                            isSelected ? "text-brand" : "text-muted-foreground",
                          )}
                        />
                        <p className="text-sm font-semibold text-foreground line-clamp-1">
                          {m.title}
                        </p>
                      </div>
                      <span className="text-[11px] text-muted-foreground shrink-0 flex items-center gap-1">
                        <Clock className="size-3" />
                        {Math.round(m.durationSeconds / 60)}m
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{m.summary}</p>
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                      <span className="rounded bg-muted px-1.5 py-0.5 capitalize text-[10px]">
                        {m.template}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Meeting Note (Granola-style note view) */}
        <div className="lg:col-span-8 flex flex-col min-h-0 overflow-y-auto pl-2">
          {selectedMeeting ? (
            <div className="flex flex-col gap-6 pb-8">
              {/* Note Header & Actions */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/40 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedMeeting.title}</h2>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{new Date(selectedMeeting.createdAt).toLocaleString()}</span>
                    <span>•</span>
                    <span>{formatDuration(selectedMeeting.durationSeconds)}</span>
                    <span>•</span>
                    <span className="capitalize">{selectedMeeting.template} template</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs text-brand border-brand/40 bg-brand/5 hover:bg-brand/10 cursor-pointer"
                    onClick={() => setShowWorkflowDialog(true)}
                  >
                    <Sparkles className="size-3.5" />
                    Automated Workflows
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() => copyToClipboard(selectedMeeting.summary, "Summary copied")}
                  >
                    {copySuccess === "Summary copied" ? (
                      <Check className="size-3.5 text-brand" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                    Copy Summary
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() => exportMarkdown(selectedMeeting)}
                  >
                    <Download className="size-3.5" />
                    Export .md
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => deleteMeeting(selectedMeeting.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>

              {/* Diarized Speakers Bar */}
              {uniqueSpeakers.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-muted/20 p-2.5">
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Users className="size-3.5 text-brand" />
                    Diarized Speakers:
                  </span>
                  {uniqueSpeakers.map((spk) => (
                    <div
                      key={spk}
                      className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-0.5 text-xs text-foreground shadow-2xs"
                    >
                      <span className="font-medium">{spk}</span>
                      <button
                        type="button"
                        onClick={() => setRenamingSpeaker({ oldName: spk, newName: spk })}
                        className="text-muted-foreground hover:text-brand cursor-pointer p-0.5"
                        title="Rename speaker across transcript"
                      >
                        <Edit2 className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Granola Executive Summary */}
              <div className="rounded-lg border border-border/60 bg-card p-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                  <FileText className="size-4 text-brand" />
                  Executive Summary
                </h3>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {selectedMeeting.summary}
                </p>
              </div>

              {/* Key Discussion Points */}
              {selectedMeeting.keyPoints.length > 0 && (
                <div className="rounded-lg border border-border/60 bg-card p-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2.5">
                    <Lightbulb className="size-4 text-brand" />
                    Key Discussion Points
                  </h3>
                  <ul className="space-y-2 text-sm text-foreground/90">
                    {selectedMeeting.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-brand font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Items with Interactive Checkboxes */}
              {selectedMeeting.actionItems.length > 0 && (
                <div className="rounded-lg border border-border/60 bg-card p-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <ListChecks className="size-4 text-brand" />
                      Action Items
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 text-muted-foreground"
                      onClick={() => {
                        const itemsText = selectedMeeting.actionItems
                          .map((a) => `- [${a.done ? "x" : " "}] ${a.text}`)
                          .join("\n");
                        copyToClipboard(itemsText, "Action items copied");
                      }}
                    >
                      <Copy className="size-3 mr-1" />
                      Copy Items
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {selectedMeeting.actionItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleActionItem(selectedMeeting.id, item.id)}
                        className="flex w-full items-start gap-2.5 p-2 rounded-md hover:bg-muted/40 cursor-pointer transition-colors text-left"
                      >
                        {item.done ? (
                          <CheckSquare className="size-4 text-brand shrink-0 mt-0.5" />
                        ) : (
                          <Square className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                        )}
                        <span
                          className={cn(
                            "text-sm flex-1",
                            item.done && "line-through text-muted-foreground",
                          )}
                        >
                          {item.text}
                        </span>
                        {item.assignee && (
                          <span className="rounded-full bg-brand/10 text-brand px-2 py-0.5 text-[11px] font-medium">
                            @{item.assignee}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* User Notes (Scratchpad) */}
              {selectedMeeting.userNotes && (
                <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                    <FileText className="size-4 text-brand" />
                    Scratchpad & Participant Notes
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap font-mono">
                    {selectedMeeting.userNotes}
                  </p>
                </div>
              )}

              {/* Full Transcript Accordion / Segments */}
              {selectedMeeting.segments.length > 0 && (
                <div className="rounded-lg border border-border/60 bg-card p-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Mic className="size-4 text-brand" />
                    Full Meeting Transcript ({selectedMeeting.segments.length} turns)
                  </h3>
                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {selectedMeeting.segments.map((seg) => (
                      <div
                        key={seg.id}
                        className="rounded-md border border-border/40 bg-muted/20 p-2.5 text-xs"
                      >
                        <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground mb-1">
                          <span className="text-brand font-semibold">{seg.speaker}</span>
                          <span>{seg.timestamp}</span>
                        </div>
                        <p className="text-foreground/90">{seg.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Users className="size-12 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium">Select a meeting to view its AI notes</p>
              <p className="text-xs text-muted-foreground mt-1">
                Or click &quot;Record Meeting&quot; to start live dictation
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Import Audio Modal (OpenWhispr capability) */}
      {showImportDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-xl">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileAudio className="size-5 text-brand" />
              Import Audio File (OpenWhispr)
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Transcribe offline audio recordings (.wav, .mp3, .m4a, .ogg) and generate structured
              meeting notes.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-foreground">File Name / Path</label>
                <Input
                  value={importFileName}
                  onChange={(e) => setImportFileName(e.target.value)}
                  placeholder="e.g. client-interview-recording.mp3"
                  className="mt-1 text-xs"
                />
              </div>

              <div className="rounded-lg border-2 border-dashed border-border/80 p-6 text-center hover:border-brand/60 transition-colors">
                <FileAudio className="mx-auto size-8 text-muted-foreground/60 mb-2" />
                <p className="text-xs font-medium text-foreground">Drag and drop audio file here</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  or pick a sample file to test
                </p>
                <div className="mt-3 flex justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setImportFileName("quarterly-planning-session.wav")}
                  >
                    Sample 1 (.wav)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setImportFileName("customer-feedback-interview.m4a")}
                  >
                    Sample 2 (.m4a)
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImportDialog(false)}
                disabled={isImporting}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-brand text-brand-foreground hover:bg-brand/90"
                onClick={handleSimulateFileImport}
                disabled={!importFileName || isImporting}
              >
                {isImporting ? "Transcribing & Summarizing..." : "Transcribe & Generate Notes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Meeting Automated Workflows Dialog */}
      {selectedMeeting && (
        <PostMeetingWorkflowDialog
          meeting={selectedMeeting}
          open={showWorkflowDialog}
          onClose={() => setShowWorkflowDialog(false)}
        />
      )}

      {/* Rename Speaker Modal */}
      {renamingSpeaker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-background p-5 shadow-xl">
            <h3 className="text-base font-bold text-foreground">Rename Diarized Speaker</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Update &quot;{renamingSpeaker.oldName}&quot; to a real participant name across all
              transcript segments.
            </p>
            <div className="mt-4">
              <Input
                value={renamingSpeaker.newName}
                onChange={(e) =>
                  setRenamingSpeaker((prev) => (prev ? { ...prev, newName: e.target.value } : null))
                }
                placeholder="e.g. Sarah Connor"
                className="text-xs"
                autoFocus
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setRenamingSpeaker(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-brand text-brand-foreground hover:bg-brand/90"
                onClick={handleRenameSpeaker}
                disabled={!renamingSpeaker.newName.trim()}
              >
                Save Name
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
