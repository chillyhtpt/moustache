export type MeetingPlatform = "google_meet" | "zoom" | "teams" | "in_person";

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  attendees: string[];
  platform: MeetingPlatform;
  meetingUrl?: string;
  suggestedTemplate: "general" | "oneOnOne" | "standup" | "sales" | "brainstorm";
  autoJoin: boolean;
}

export interface CalendarSyncSettings {
  enabled: boolean;
  provider: "google" | "outlook" | "local_ical";
  notifyMinutesBefore: number;
  autoStartLoopback: boolean;
}
