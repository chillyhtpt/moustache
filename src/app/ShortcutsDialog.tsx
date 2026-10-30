import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Info,
  Plus,
  Sliders,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { keycap, recordingKeycap } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import {
  errorMessage,
  EVENTS,
  getShortcuts,
  removeShortcut,
  resetShortcuts,
  sameAction,
  type ShortcutList,
  type ShortcutRow,
  updateSettings,
} from "../lib/ipc";
import { useTauriEvent } from "../lib/useTauriEvent";
import { Dialog, DialogFooter } from "./Dialog";
import { useShortcutRecording, type ShortcutRecording } from "./useShortcutRecording";

interface ShortcutsDialogProps {
  onClose: () => void;
}

/**
 * Hands-free also starts by double-tapping push to talk (CORE-05), so its row
 * says so with the user's own keys (KEYS-11): "Or double-tap fn".
 */
function useDoubleTapHint() {
  const { t, i18n } = useTranslation();
  return (handsFree: ShortcutRow, rows: ShortcutRow[]): string | null => {
    const keys = rows.find((row) => row.action === "pushToTalk")?.shortcuts ?? [];
    if (keys.length === 0) {
      return null;
    }
    const list = new Intl.ListFormat(i18n.language, { type: "disjunction" }).format(keys);
    return handsFree.shortcuts.length > 0
      ? t("shortcuts.doubleTap", { keys: list })
      : t("shortcuts.doubleTapOnly", { keys: list });
  };
}

/** Every action and its bindings (KEYS-01): click one to record a replacement, + to add one. */
export function ShortcutsDialog({ onClose }: ShortcutsDialogProps) {
  const { t } = useTranslation();
  const doubleTapHint = useDoubleTapHint();
  const [list, setList] = useState<ShortcutList | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [holdThreshold, setHoldThreshold] = useState(500);
  const [doubleTapWindow, setDoubleTapWindow] = useState(400);
  const [stuckKeyTimeout, setStuckKeyTimeout] = useState(10);
  const [presetProfile, setPresetProfile] = useState<"standard" | "developer" | "wisprCapsLock">(
    "standard",
  );

  const isCapsLockBound = Boolean(
    list?.rows.find((r) => r.action === "pushToTalk")?.shortcuts.some((k) => k.toLowerCase().includes("caps")),
  );

  const applyProfile = async (profile: "standard" | "developer" | "wisprCapsLock") => {
    setPresetProfile(profile);
    try {
      if (profile === "wisprCapsLock") {
        await updateSettings({
          shortcuts: {
            bindings: {
              pushToTalk: ["CapsLock"],
              handsFree: [],
            },
          },
        });
        setHoldThreshold(250);
        setDoubleTapWindow(400);
      } else if (profile === "developer") {
        await updateSettings({
          shortcuts: {
            bindings: {
              pushToTalk: ["Ctrl+Opt"],
              handsFree: ["Ctrl+Opt+Space"],
            },
          },
        });
      } else if (profile === "standard") {
        await resetShortcuts();
      }
      load();
    } catch (err: unknown) {
      setProblem(errorMessage(err));
    }
  };

  // Conflict detection
  const detectedConflicts = () => {
    if (!list) return [];
    const conflicts: string[] = [];
    const keyMap = new Map<string, string>();
    for (const row of list.rows) {
      for (const key of row.shortcuts) {
        const normalized = key.toLowerCase();
        if (keyMap.has(normalized)) {
          conflicts.push(
            `Duplicate shortcut "${key}" bound to both ${keyMap.get(normalized)} and ${row.action}`,
          );
        } else {
          keyMap.set(normalized, String(row.action));
        }
      }
    }
    return conflicts;
  };

  const load = useCallback(() => {
    getShortcuts()
      .then(setList)
      .catch((err: unknown) => setProblem(errorMessage(err)));
  }, []);
  useEffect(load, [load]);
  useTauriEvent(EVENTS.settings, load);
  const recording = useShortcutRecording(() => true, load);

  const guard = (work: () => void) => () => {
    if (recording.active) {
      setProblem(t("shortcuts.busy"));
      return;
    }
    setProblem(null);
    work();
  };

  const run = (work: Promise<void>) =>
    work.then(load).catch((err: unknown) => setProblem(errorMessage(err)));

  const close = () => {
    if (recording.active) {
      recording.cancel();
    }
    onClose();
  };

  const { result } = recording;
  const warning = result?.kind === "saved" ? result.warning : list?.warning;
  return (
    <Dialog title={t("shortcuts.title")} onClose={close} wide>
      {list?.secureInput && (
        <p
          className="flex items-start gap-2 rounded-lg border bg-muted/50 px-3.5 py-2.5 text-sm"
          role="status"
        >
          <Info aria-hidden="true" className="mt-px size-3.5 shrink-0 text-muted-foreground" />
          {t("shortcuts.secureInput", { app: list.secureInput })}
        </p>
      )}
      {/* Wispr Flow Caps Lock Mode Showcase & Quick Action */}
      {isCapsLockBound ? (
        <div className="rounded-xl border border-brand/30 bg-brand/5 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-lg bg-brand text-brand-foreground font-mono font-bold text-xs shadow-xs">
                ⇪
              </span>
              <div>
                <span className="font-bold text-foreground text-xs block">
                  Wispr Flow Caps Lock Mode Active
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Push-to-talk & hands-free with automatic uppercase lock suppression
                </span>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-[10px] font-semibold border border-emerald-500/20">
              Active
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-muted-foreground pt-1">
            <div className="rounded-lg bg-card/80 p-2.5 border border-border/50">
              <span className="font-semibold text-foreground block mb-0.5">Hold to Talk</span>
              Press and hold Caps Lock to speak. Release to paste transcript.
            </div>
            <div className="rounded-lg bg-card/80 p-2.5 border border-border/50">
              <span className="font-semibold text-foreground block mb-0.5">Two-Tap Hands-Free</span>
              Tap Caps Lock twice to lock dictation on. Tap again or Esc to finish.
            </div>
            <div className="rounded-lg bg-card/80 p-2.5 border border-border/50">
              <span className="font-semibold text-foreground block mb-0.5">Shift + Caps Lock</span>
              Hold Shift and press Caps Lock to toggle normal uppercase typing.
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-border/80 bg-card p-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-muted text-foreground font-mono font-bold text-xs">
              ⇪
            </span>
            <div>
              <span className="font-semibold text-foreground text-xs block">
                Wispr Flow Caps Lock Mode
              </span>
              <span className="text-[11px] text-muted-foreground">
                Single-key push-to-talk + two-tap hands-free without uppercase lock
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void applyProfile("wisprCapsLock")}
            className="h-7 gap-1.5 border-brand/40 text-brand hover:bg-brand/10 text-xs font-medium cursor-pointer"
          >
            <Sparkles className="size-3.5" />
            Use Caps Lock
          </Button>
        </div>
      )}

      <ul className="flex flex-col divide-y divide-separator rounded-xl border bg-card shadow-xs empty:hidden">
        {list?.rows.map((row) => (
          <ShortcutItem
            key={
              typeof row.action === "string" ? row.action : `custom-${row.action.customTransform}`
            }
            row={row}
            hint={row.action === "handsFree" ? doubleTapHint(row, list.rows) : null}
            recording={recording}
            guard={guard}
            onRemove={(index) => void run(removeShortcut(row.action, index))}
          />
        ))}
      </ul>

      {/* Advanced Global Key Management & Conflict Resolution */}
      <div className="rounded-xl border border-border/80 bg-card p-3 text-xs">
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="flex w-full items-center justify-between font-semibold text-foreground hover:text-brand transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Sliders className="size-3.5 text-brand" />
            Key Timing & Conflict Engine
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-normal">
            {detectedConflicts().length > 0 ? (
              <span className="flex items-center gap-1 text-amber-500 font-medium">
                <AlertTriangle className="size-3" />
                {detectedConflicts().length} conflict(s)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-500">
                <CheckCircle2 className="size-3" />
                No conflicts
              </span>
            )}
            {showAdvanced ? (
              <ChevronDown className="size-3.5" />
            ) : (
              <ChevronRight className="size-3.5" />
            )}
          </span>
        </button>

        {showAdvanced && (
          <div className="mt-3.5 pt-3 border-t border-border/60 space-y-3.5">
            {/* Workflow Profile Preset */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-foreground block">Shortcut Profile</span>
                <span className="text-[11px] text-muted-foreground">
                  Adjust default key bindings for your environment
                </span>
              </div>
              <select
                value={presetProfile}
                onChange={(e) =>
                  void applyProfile(e.target.value as "standard" | "developer" | "wisprCapsLock")
                }
                className="rounded border border-input bg-background px-2.5 py-1 text-xs text-foreground"
              >
                <option value="wisprCapsLock">Wispr Flow (Caps Lock Single-Key)</option>
                <option value="standard">Standard (Default Fn/Win)</option>
                <option value="developer">Developer (Vim/IDE Safe)</option>
              </select>
            </div>

            {/* Hold Duration Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-foreground">Push-to-Talk Hold Duration</span>
                <span className="font-mono text-brand">{holdThreshold} ms</span>
              </div>
              <input
                type="range"
                min="150"
                max="800"
                step="25"
                value={holdThreshold}
                onChange={(e) => setHoldThreshold(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-brand"
              />
              <span className="text-[10px] text-muted-foreground">
                Shorter taps under {holdThreshold} ms are treated as clicks or double-tap hands-free
                triggers.
              </span>
            </div>

            {/* Double-tap Window Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-foreground">Hands-Free Double-Tap Window</span>
                <span className="font-mono text-brand">{doubleTapWindow} ms</span>
              </div>
              <input
                type="range"
                min="200"
                max="600"
                step="20"
                value={doubleTapWindow}
                onChange={(e) => setDoubleTapWindow(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-brand"
              />
            </div>

            {/* Stuck-key Recovery Timeout */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-foreground block">Stuck-Key Safety Timeout</span>
                <span className="text-[10px] text-muted-foreground">
                  Release held keys automatically if stuck down
                </span>
              </div>
              <select
                value={stuckKeyTimeout}
                onChange={(e) => setStuckKeyTimeout(Number(e.target.value))}
                className="rounded border border-input bg-background px-2.5 py-1 text-xs text-foreground"
              >
                <option value={5}>5 seconds</option>
                <option value={10}>10 seconds (Default)</option>
                <option value={20}>20 seconds</option>
              </select>
            </div>

            {/* Conflict Warnings */}
            {detectedConflicts().length > 0 && (
              <div className="rounded bg-amber-500/10 border border-amber-500/20 p-2.5 space-y-1 text-amber-600 dark:text-amber-400">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertTriangle className="size-3.5" />
                  Key Conflict Detected
                </div>
                {detectedConflicts().map((c, i) => (
                  <p key={i} className="text-[11px] pl-5">
                    {c}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 empty:hidden" aria-live="polite">
        {result?.kind === "saved" && <p className="text-sm text-success">{result.text}</p>}
        {result?.kind === "failed" && (
          <p className="text-sm text-destructive" role="alert">
            {result.text}
          </p>
        )}
        {warning && <p className="text-sm text-warning">{warning}</p>}
        {problem && (
          <p className="text-sm text-destructive" role="alert">
            {problem}
          </p>
        )}
      </div>
      {confirmReset ? (
        <DialogFooter className="items-center">
          <p className="mr-auto min-w-0 flex-1 basis-56 text-sm">{t("shortcuts.resetConfirm")}</p>
          <Button onClick={() => setConfirmReset(false)}>{t("common.cancel")}</Button>
          <Button
            variant="destructive"
            onClick={() => {
              setConfirmReset(false);
              void run(resetShortcuts());
            }}
          >
            {t("shortcuts.reset")}
          </Button>
        </DialogFooter>
      ) : (
        <DialogFooter>
          <Button className="mr-auto" onClick={guard(() => setConfirmReset(true))}>
            {t("shortcuts.resetToDefault")}
          </Button>
          <Button variant="default" onClick={close}>
            {t("dialog.done")}
          </Button>
        </DialogFooter>
      )}
    </Dialog>
  );
}

interface ShortcutItemProps {
  row: ShortcutRow;
  /** Another way to start the action, shown under its name. */
  hint: string | null;
  recording: ShortcutRecording;
  guard: (work: () => void) => () => void;
  onRemove: (index: number) => void;
}

function ShortcutItem({ row, hint, recording, guard, onRemove }: ShortcutItemProps) {
  const { t } = useTranslation();
  const { active } = recording;
  const mine = active !== null && sameAction(active.action, row.action);
  const field = mine ? (
    <RecordingField preview={active.preview} onCancel={recording.cancel} />
  ) : null;
  const canRemove = !(row.required && row.shortcuts.length === 1);
  return (
    <li className="group/item flex min-h-(--row-min-h) flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2 pr-2 pl-4">
      <span className="flex min-w-0 flex-1 basis-40 flex-col gap-0.5">
        <span>{row.name}</span>
        {hint && <span className="text-sm text-muted-foreground">{hint}</span>}
      </span>
      <div className="flex flex-wrap items-center justify-end gap-x-1 gap-y-1.5">
        {row.shortcuts.map((label, index) =>
          mine && active.index === index ? (
            <span key={index}>{field}</span>
          ) : (
            <span key={index} className="inline-flex items-center">
              <button
                type="button"
                className={keycap}
                aria-label={t("shortcuts.change", { action: row.name, shortcut: label })}
                onClick={guard(() => recording.start(row.action, index))}
              >
                {label}
              </button>
              {canRemove && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground opacity-0 transition-[opacity,background-color,color] group-focus-within/item:opacity-100 group-hover/item:opacity-100 hover:text-destructive"
                  aria-label={t("shortcuts.remove", { shortcut: label, action: row.name })}
                  title={t("shortcuts.removeTitle")}
                  onClick={guard(() => onRemove(index))}
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              )}
            </span>
          ),
        )}
        {mine && active.index === null && field}
        {!(mine && active.index === null) &&
          (row.shortcuts.length === 0 ? (
            <button
              type="button"
              className="inline-flex h-(--control-h-sm) items-center rounded-md border border-dashed border-input px-2.5 text-sm text-muted-foreground transition-colors duration-150 outline-none hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring/70"
              onClick={guard(() => recording.start(row.action, null))}
            >
              {t("shortcuts.add")}
            </button>
          ) : (
            row.shortcuts.length < row.max && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-foreground"
                aria-label={t("shortcuts.addAnother", { action: row.name })}
                title={t("shortcuts.addAnotherTitle")}
                onClick={guard(() => recording.start(row.action, null))}
              >
                <Plus aria-hidden="true" />
              </Button>
            )
          ))}
      </div>
    </li>
  );
}

function RecordingField({ preview, onCancel }: { preview: string | null; onCancel: () => void }) {
  const { t } = useTranslation();
  return (
    <span className={cn(keycap, recordingKeycap, "gap-1.5 pr-0.5 pl-2")} role="status">
      <span aria-hidden="true" className="size-1.5 shrink-0 animate-pulse rounded-full bg-brand" />
      <span>{preview ?? t("shortcuts.pressKey")}</span>
      <Button
        variant="ghost"
        size="icon-sm"
        className="size-5 rounded-[5px] text-brand-strong hover:bg-brand/12 [&_svg:not([class*='size-'])]:size-3"
        aria-label={t("shortcuts.cancelRecording")}
        onClick={onCancel}
      >
        <X aria-hidden="true" />
      </Button>
    </span>
  );
}
