import { Calendar, ExternalLink, Play, Radio, Settings2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { loadCalendarEvents, loadCalendarSettings, saveCalendarSettings } from "./mockCalendar";
import type { CalendarEvent, CalendarSyncSettings } from "./types";

interface CalendarBannerProps {
  onStartFromCalendar: (event: CalendarEvent) => void;
}

export function CalendarBanner({ onStartFromCalendar }: CalendarBannerProps) {
  const [events] = useState<CalendarEvent[]>(() => loadCalendarEvents());
  const [settings, setSettings] = useState<CalendarSyncSettings>(() => loadCalendarSettings());
  const [showSettings, setShowSettings] = useState(false);
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(events[0] ?? null);
  const [currentTime] = useState(() => Date.now());

  useEffect(() => {
    saveCalendarSettings(settings);
  }, [settings]);

  if (!settings.enabled || !activeEvent) {
    return null;
  }

  const startMs = new Date(activeEvent.startTime).getTime();
  const minutesUntil = Math.max(0, Math.round((startMs - currentTime) / 60000));

  const platformLabels: Record<string, string> = {
    google_meet: "Google Meet",
    zoom: "Zoom",
    teams: "Microsoft Teams",
    in_person: "In Person",
  };

  return (
    <div className="mb-6 rounded-xl border border-brand/40 bg-gradient-to-r from-brand/10 via-brand/5 to-card p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand/20 text-brand">
            <Calendar className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand">
                Upcoming Meeting • Starts in {minutesUntil}m
              </span>
              <Badge variant="outline" className="text-[11px] font-medium border-brand/30">
                {platformLabels[activeEvent.platform] || "Meeting"}
              </Badge>
            </div>
            <p className="text-sm font-semibold text-foreground">{activeEvent.title}</p>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="size-3.5" />
              <span>{activeEvent.attendees.join(", ")}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeEvent.meetingUrl && (
            <a
              href={activeEvent.meetingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-(--control-h) items-center gap-1.5 rounded-md border border-input px-2.5 text-xs text-muted-foreground hover:bg-muted"
            >
              <ExternalLink className="size-3.5" />
              Join Call
            </a>
          )}
          <Button
            size="sm"
            className="bg-brand text-brand-foreground hover:bg-brand/90 gap-1.5 text-xs font-semibold shadow-xs"
            onClick={() => onStartFromCalendar(activeEvent)}
          >
            <Play className="size-3.5 fill-current" />
            Start Moustache Meeting
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setShowSettings((s) => !s)}
          >
            <Settings2 className="size-4" />
          </Button>
        </div>
      </div>

      {showSettings && (
        <div className="mt-4 border-t border-border/40 pt-3 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="font-medium text-foreground">Calendar Provider:</span>
            <select
              value={settings.provider}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  provider: e.target.value as "google" | "outlook" | "local_ical",
                }))
              }
              className="rounded-md border border-input bg-background px-2.5 py-1 text-foreground"
            >
              <option value="google">Google Calendar (OAuth)</option>
              <option value="outlook">Microsoft 365 / Outlook</option>
              <option value="local_ical">Local macOS Calendar / iCal</option>
            </select>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <Switch
                checked={settings.autoStartLoopback}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, autoStartLoopback: checked }))
                }
              />
              <span className="flex items-center gap-1">
                <Radio className="size-3 text-brand" />
                Auto-arm Botless Loopback
              </span>
            </label>

            <button
              type="button"
              onClick={() => {
                const nextIdx = (events.indexOf(activeEvent) + 1) % events.length;
                setActiveEvent(events[nextIdx] ?? null);
              }}
              className="text-xs text-brand hover:underline font-medium cursor-pointer"
            >
              Next Meeting →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
