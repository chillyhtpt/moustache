import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAppInfo, type AppInfo } from "../lib/ipc";
import { Greeting } from "./Greeting";
import { HistorySection } from "./HistorySection";
import { ModelCard } from "./ModelCard";
import { pageColumn, PageToolbar } from "./Page";
import { PermissionsCard } from "./PermissionsCard";

type InfoState =
  { status: "loading" } | { status: "ready"; info: AppInfo } | { status: "error"; message: string };

interface HomePageProps {
  onOpenInsights: () => void;
  onOpenMeetings?: () => void;
}

export function HomePage({ onOpenInsights, onOpenMeetings }: HomePageProps) {
  const { t } = useTranslation();
  return (
    <div className="app">
      <PageToolbar title={t("nav.home")} />
      <div className={cn(pageColumn(), "flex flex-col gap-7 pb-10")}>
        <Greeting onOpenInsights={onOpenInsights} />
        <ModelCard hideWhenReady />
        <PermissionsCard hideWhenGranted />
        {onOpenMeetings && (
          <div className="flex items-center justify-between rounded-xl border border-brand/30 bg-card p-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-brand/10 p-2.5 text-brand">
                <Users className="size-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Meeting Transcription & AI Notes
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Live Granola-style notes, participant scratchpad, and OpenWhispr audio import.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={onOpenMeetings}
              className="bg-brand text-brand-foreground hover:bg-brand/90 text-xs cursor-pointer"
            >
              Open Meetings
            </Button>
          </div>
        )}
        <HistorySection />
        <AppInfoLine />
      </div>
    </div>
  );
}

function AppInfoLine() {
  const [state, setState] = useState<InfoState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    getAppInfo()
      .then((info) => !cancelled && setState({ status: "ready", info }))
      .catch(
        (error: unknown) => !cancelled && setState({ status: "error", message: String(error) }),
      );
    return () => {
      cancelled = true;
    };
  }, []);

  switch (state.status) {
    case "loading":
      return null;
    case "error":
      return (
        <p
          className="meta text-center text-xs text-destructive"
          role="alert"
          data-testid="app-info-error"
        >
          {state.message}
        </p>
      );
    case "ready":
      return (
        <p className="meta text-center text-xs text-muted-foreground/80" data-testid="app-info">
          {state.info.name} {state.info.version} · {state.info.os}/{state.info.arch}
        </p>
      );
  }
}
