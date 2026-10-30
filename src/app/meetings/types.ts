export type TemplateId = "oneOnOne" | "standup" | "sales" | "brainstorm" | "general";

export interface MeetingTemplate {
  id: TemplateId;
  name: string;
  description: string;
  icon: string;
  defaultPrompt: string;
}

export interface MeetingActionItem {
  id: string;
  text: string;
  assignee?: string;
  done: boolean;
}

export interface TranscriptSegment {
  id: string;
  speaker: string;
  timestamp: string;
  text: string;
}

export interface MeetingNote {
  id: string;
  title: string;
  createdAt: string;
  durationSeconds: number;
  template: TemplateId;
  userNotes: string;
  summary: string;
  keyPoints: string[];
  actionItems: MeetingActionItem[];
  decisions: string[];
  rawTranscript: string;
  segments: TranscriptSegment[];
}
