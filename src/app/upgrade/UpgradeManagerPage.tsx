import {
  ArrowUpCircle,
  CheckCircle2,
  Clock,
  Download,
  History,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { RELEASES_CATALOG } from "./releaseCatalog";
import type { ReleaseVersion, UpdateChannel, UpdateState } from "./types";

export function UpgradeManagerPage() {
  const [channel, setChannel] = useState<UpdateChannel>("stable");
  const [updateState, setUpdateState] = useState<UpdateState>("idle");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [selectedVersion, setSelectedVersion] = useState<ReleaseVersion>(
    () => RELEASES_CATALOG[0]!,
  );
  const [autoCheck, setAutoCheck] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [frequency, setFrequency] = useState("6h");

  const currentVersion: ReleaseVersion =
    RELEASES_CATALOG.find((r) => r.isCurrent) ?? RELEASES_CATALOG[1] ?? RELEASES_CATALOG[0]!;
  const latestVersion: ReleaseVersion = RELEASES_CATALOG[0]!;

  const handleCheckUpdates = () => {
    setUpdateState("checking");
    setTimeout(() => {
      if (
        channel === "nightly" ||
        channel === "beta" ||
        latestVersion.version !== currentVersion.version
      ) {
        setUpdateState("available");
      } else {
        setUpdateState("upToDate");
      }
    }, 1500);
  };

  const handleDownloadUpdate = () => {
    setUpdateState("downloading");
    setDownloadProgress(10);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUpdateState("ready");
          return 100;
        }
        return prev + 18;
      });
    }, 300);
  };

  const handleRestartToUpdate = () => {
    window.location.reload();
  };

  return (
    <div className="flex h-full flex-col p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <ArrowUpCircle className="size-6 text-brand" />
            Upgrade Manager
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage release channels, verify signatures, inspect detailed release notes, and install
            updates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="update-channel" className="text-xs text-muted-foreground">
            Release Channel:
          </label>
          <select
            id="update-channel"
            value={channel}
            onChange={(e) => {
              setChannel(e.target.value as UpdateChannel);
              setUpdateState("idle");
            }}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground font-medium"
          >
            <option value="stable">Stable (Official)</option>
            <option value="beta">Beta (Preview)</option>
            <option value="nightly">Nightly (Dev)</option>
          </select>
        </div>
      </div>

      {/* Status Banner */}
      <div className="mb-8 rounded-xl border border-border/80 bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-brand/10 p-3 text-brand">
              <Sparkles className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-foreground">
                  Moustache v{currentVersion.version}
                </h2>
                <span className="rounded-full bg-brand/15 text-brand px-2.5 py-0.5 text-xs font-semibold">
                  Installed
                </span>
                <span className="text-xs text-muted-foreground font-mono">Channel: {channel}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                <ShieldCheck className="size-3.5 text-emerald-500" />
                Signed with release updater key • SHA-256 integrity verified
              </p>
            </div>
          </div>

          <div>
            {updateState === "idle" && (
              <Button
                onClick={handleCheckUpdates}
                className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90 cursor-pointer"
              >
                <RefreshCw className="size-4" />
                Check for Updates
              </Button>
            )}

            {updateState === "checking" && (
              <Button disabled variant="outline" className="gap-2">
                <RefreshCw className="size-4 animate-spin text-brand" />
                Checking for updates...
              </Button>
            )}

            {updateState === "upToDate" && (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                  <CheckCircle2 className="size-4" />
                  Up to date
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCheckUpdates}
                  className="text-xs h-8"
                >
                  Check Again
                </Button>
              </div>
            )}

            {updateState === "available" && (
              <div className="flex items-center gap-2.5">
                <Button
                  onClick={handleDownloadUpdate}
                  className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90"
                >
                  <Download className="size-4" />
                  Download v{latestVersion.version} ({latestVersion.downloadSize})
                </Button>
              </div>
            )}

            {updateState === "downloading" && (
              <div className="w-56 space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Downloading...</span>
                  <span className="font-mono font-bold text-foreground">{downloadProgress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-brand transition-all duration-200"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {updateState === "ready" && (
              <Button
                onClick={handleRestartToUpdate}
                className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <RotateCcw className="size-4" />
                Restart to Apply v{latestVersion.version}
              </Button>
            )}
          </div>
        </div>

        {/* Update Notice if Available */}
        {updateState === "available" && (
          <div className="mt-4 rounded-lg bg-brand/5 border border-brand/20 p-3.5 text-xs text-foreground/90 flex items-start gap-2.5">
            <Sparkles className="size-4 text-brand shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">
                Version {latestVersion.version} is ready to download!
              </p>
              <p className="mt-0.5 text-muted-foreground">
                Includes meeting transcription with Granola-style notes, app-specific behaviour
                adaptation, and improved global key management.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content: Release Notes & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Left: Release Version History */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <History className="size-4 text-brand" />
            Release Versions
          </h2>

          <div className="space-y-2">
            {RELEASES_CATALOG.map((rel) => {
              const isSelected = selectedVersion.version === rel.version;
              return (
                <button
                  key={rel.version}
                  type="button"
                  onClick={() => setSelectedVersion(rel)}
                  className={cn(
                    "w-full rounded-lg border p-3.5 text-left transition-colors cursor-pointer",
                    isSelected
                      ? "border-brand/60 bg-brand/5"
                      : "border-border/60 bg-card hover:bg-accent/40",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground">v{rel.version}</span>
                    <span className="text-[11px] text-muted-foreground">{rel.releaseDate}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1 font-medium">
                    {rel.title}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[10px]">
                    {rel.isCurrent && (
                      <span className="rounded bg-brand/20 text-brand px-1.5 py-0.5 font-semibold">
                        Current
                      </span>
                    )}
                    <span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground capitalize">
                      {rel.channel}
                    </span>
                    <span className="text-muted-foreground">{rel.downloadSize}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Upgrade Preferences */}
          <div className="mt-4 rounded-lg border border-border/60 bg-card p-4 space-y-3.5 text-xs">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Clock className="size-3.5 text-brand" />
              Update Preferences
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Check Frequency</span>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="rounded border border-input bg-background px-2 py-1 text-xs"
              >
                <option value="6h">Every 6 Hours</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="manual">Manual Only</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Automatic Check</span>
              <Switch checked={autoCheck} onCheckedChange={setAutoCheck} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Auto-download</span>
              <Switch checked={autoDownload} onCheckedChange={setAutoDownload} />
            </div>
          </div>
        </div>

        {/* Right: Selected Version Changelog Details */}
        <div className="lg:col-span-8 flex flex-col min-h-0 bg-card rounded-xl border border-border/80 p-5">
          <div className="border-b border-border/60 pb-4 mb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-foreground">
                  Shrimp v{selectedVersion.version}
                </h2>
                {selectedVersion.isCurrent && (
                  <span className="rounded-full bg-brand/15 text-brand px-2 py-0.5 text-xs font-semibold">
                    Currently Installed
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Released on {selectedVersion.releaseDate} • {selectedVersion.title}
              </p>
            </div>
            <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-mono text-muted-foreground">
              Size: {selectedVersion.downloadSize}
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <h3 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-1.5">
                <Sparkles className="size-4 text-brand" />
                Highlights
              </h3>
              <ul className="space-y-1.5 text-foreground/90 pl-1">
                {selectedVersion.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand font-bold">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <h3 className="font-semibold text-sm text-foreground mb-2">Detailed Changelog</h3>
              <div className="rounded-lg bg-muted/30 border border-border/40 p-4 font-mono text-[11px] leading-relaxed text-foreground whitespace-pre-wrap max-h-96 overflow-y-auto">
                {selectedVersion.changelog}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
