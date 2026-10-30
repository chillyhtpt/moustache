import type { CalendarEvent, CalendarSyncSettings } from "./types";

const CALENDAR_STORAGE_KEY = "moustache_calendar_events_v1";
const CALENDAR_SETTINGS_KEY = "moustache_calendar_settings_v1";

export function getInitialCalendarEvents(): CalendarEvent[] {
  const now = Date.now();
  return [
    {
      id: "cal-1",
      title: "Sprint Planning & Architecture Sync",
      startTime: new Date(now + 6 * 60 * 1000).toISOString(), // 6 minutes from now
      endTime: new Date(now + 36 * 60 * 1000).toISOString(),
      attendees: ["Sarah Connor", "Alex Rivera", "Dan Williams", "Elena Rostova"],
      platform: "google_meet",
      meetingUrl: "https://meet.google.com/xyz-abcd-efg",
      suggestedTemplate: "standup",
      autoJoin: true,
    },
    {
      id: "cal-2",
      title: "1-on-1: Q4 Product Strategy",
      startTime: new Date(now + 90 * 60 * 1000).toISOString(), // 1.5 hours from now
      endTime: new Date(now + 120 * 60 * 1000).toISOString(),
      attendees: ["Marcus Vance"],
      platform: "zoom",
      meetingUrl: "https://zoom.us/j/987654321",
      suggestedTemplate: "oneOnOne",
      autoJoin: false,
    },
    {
      id: "cal-3",
      title: "Enterprise Client Demo & Security Review",
      startTime: new Date(now + 240 * 60 * 1000).toISOString(), // 4 hours from now
      endTime: new Date(now + 285 * 60 * 1000).toISOString(),
      attendees: ["David Sterling (CTO)", "Rachel Kim (CISO)", "Liam Patel"],
      platform: "teams",
      meetingUrl: "https://teams.microsoft.com/l/meetup-join/123",
      suggestedTemplate: "sales",
      autoJoin: true,
    },
  ];
}

export function loadCalendarEvents(): CalendarEvent[] {
  try {
    const raw = localStorage.getItem(CALENDAR_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback to initial
  }
  return getInitialCalendarEvents();
}

export function saveCalendarEvents(events: CalendarEvent[]): void {
  try {
    localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(events));
  } catch {
    // ignore
  }
}

export function loadCalendarSettings(): CalendarSyncSettings {
  try {
    const raw = localStorage.getItem(CALENDAR_SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return {
    enabled: true,
    provider: "google",
    notifyMinutesBefore: 1,
    autoStartLoopback: true,
  };
}

export function saveCalendarSettings(settings: CalendarSyncSettings): void {
  try {
    localStorage.setItem(CALENDAR_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}
