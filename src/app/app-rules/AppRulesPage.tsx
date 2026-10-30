import {
  AppWindow,
  Code2,
  CornerDownLeft,
  FileText,
  Mail,
  MessageSquare,
  Plus,
  SlidersHorizontal,
  Trash2,
  Wand2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { loadAppRules, saveAppRules } from "./defaultRules";
import type { AppRule, AppTone } from "./types";

const TONE_INFO: Record<
  AppTone,
  { label: string; icon: React.ComponentType<{ className?: string }>; description: string }
> = {
  casualChat: {
    label: "Casual Chat",
    icon: MessageSquare,
    description: "Concise, friendly messages with chat punctuation and optional auto-enter.",
  },
  codeDeveloper: {
    label: "Developer / Code",
    icon: Code2,
    description: "Preserves camelCase, snake_case, backticks, CLI flags, and function names.",
  },
  formalEmail: {
    label: "Professional Email",
    icon: Mail,
    description: "Polite greetings, well-formatted paragraphs, and respectful closing sign-off.",
  },
  richNotes: {
    label: "Markdown Notes",
    icon: FileText,
    description: "Structured markdown headings, bulleted lists, and bold key concepts.",
  },
  custom: {
    label: "Custom Prompt",
    icon: SlidersHorizontal,
    description: "User-defined rewrite instructions tailored to specific application workflows.",
  },
};

export function AppRulesPage() {
  const [rules, setRules] = useState<AppRule[]>(() => loadAppRules());
  const [editingRule, setEditingRule] = useState<AppRule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Playground state for testing rules
  const [testInput, setTestInput] = useState(
    "hey can you review my pull request user profile and let me know if we can ship this today",
  );
  const [testAppId, setTestAppId] = useState<string>("rule-slack");

  useEffect(() => {
    saveAppRules(rules);
  }, [rules]);

  const toggleRuleEnabled = (id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const toggleAutoEnter = (id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, autoEnter: !r.autoEnter } : r)));
  };

  const deleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const openNewRuleDialog = () => {
    setEditingRule({
      id: `rule-${Date.now()}`,
      appName: "",
      appId: "",
      tone: "casualChat",
      autoEnter: false,
      codeFormatting: false,
      customPrompt: "",
      vocabularyBoost: [],
      enabled: true,
    });
    setIsDialogOpen(true);
  };

  const saveDialogRule = () => {
    if (!editingRule || !editingRule.appName) return;
    setRules((prev) => {
      const exists = prev.some((r) => r.id === editingRule.id);
      if (exists) {
        return prev.map((r) => (r.id === editingRule.id ? editingRule : r));
      }
      return [editingRule, ...prev];
    });
    setIsDialogOpen(false);
    setEditingRule(null);
  };

  // Simulated transformation for the playground
  const simulatedOutput = () => {
    const activeRule = rules.find((r) => r.id === testAppId) ?? rules[0];
    if (!activeRule) return testInput;

    switch (activeRule.tone) {
      case "casualChat":
        return `Hey! Can you review my PR \`userProfile\`? Let me know if we can ship today 👍${activeRule.autoEnter ? " [Auto-sent with Enter ↵]" : ""}`;
      case "codeDeveloper":
        return "hey can you review my PR `user_profile` and let me know if we can ship today?";
      case "formalEmail":
        return "Hi team,\n\nCould you please review the attached pull request for the user profile module when you have a moment? We are aiming to ship this today.\n\nBest regards,\nDan";
      case "richNotes":
        return "## User Profile Review\n- Review pull request for `userProfile`\n- Check if ready to ship today\n- Verify all automated test suites pass";
      default:
        return testInput;
    }
  };

  return (
    <div className="flex h-full flex-col p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <AppWindow className="size-6 text-brand" />
            App-Specific Behaviour
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Wispr Flow-inspired contextual adaptation: automatically switch tone, syntax rules,
            dictionary boosts, and auto-enter per app.
          </p>
        </div>
        <Button
          onClick={openNewRuleDialog}
          className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90 cursor-pointer"
        >
          <Plus className="size-4" />
          Add App Rule
        </Button>
      </div>

      {/* Interactive Rule Testing Playground */}
      <div className="mb-8 rounded-xl border border-border/80 bg-card p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Wand2 className="size-4 text-brand" />
            Live App Transformation Playground
          </span>
          <div className="flex items-center gap-2">
            <label htmlFor="test-app-profile" className="text-xs text-muted-foreground">
              Target App Profile:
            </label>
            <select
              id="test-app-profile"
              value={testAppId}
              onChange={(e) => setTestAppId(e.target.value)}
              className="rounded-md border border-input bg-background px-2.5 py-1 text-xs text-foreground"
            >
              {rules.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.appName} ({TONE_INFO[r.tone].label})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-muted-foreground font-medium mb-1 block">
              Spoken Raw Input:
            </label>
            <textarea
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground resize-none"
            />
          </div>
          <div>
            <label className="text-muted-foreground font-medium mb-1 block">
              Transformed Paste Output:
            </label>
            <div className="rounded-md border border-brand/30 bg-muted/30 p-2.5 min-h-[74px] font-mono whitespace-pre-wrap text-foreground">
              {simulatedOutput()}
            </div>
          </div>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-foreground">
          Configured Applications ({rules.length})
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {rules.map((rule) => {
            const ToneIcon = TONE_INFO[rule.tone].icon;
            return (
              <div
                key={rule.id}
                className={cn(
                  "rounded-xl border p-4.5 transition-all duration-150 bg-card",
                  rule.enabled ? "border-border/80 shadow-xs" : "border-border/40 opacity-60",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-brand/10 p-2 text-brand">
                      <ToneIcon className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-foreground">{rule.appName}</h3>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground font-mono">
                          {rule.appId || "auto-detected"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {TONE_INFO[rule.tone].description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Auto-enter switch */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2">
                      <CornerDownLeft className="size-3.5 text-brand" />
                      <span>Auto-Enter</span>
                      <Switch
                        checked={rule.autoEnter}
                        onCheckedChange={() => toggleAutoEnter(rule.id)}
                      />
                    </div>

                    {/* Enable switch */}
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => toggleRuleEnabled(rule.id)}
                    />

                    {/* Edit button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => {
                        setEditingRule(rule);
                        setIsDialogOpen(true);
                      }}
                    >
                      Configure
                    </Button>

                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 h-7 px-2"
                      onClick={() => deleteRule(rule.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Custom Prompt & Vocabulary Chips */}
                <div className="mt-3.5 pt-3 border-t border-border/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex-1 min-w-[200px]">
                    <span className="text-muted-foreground font-medium mr-1.5">Prompt:</span>
                    <span className="text-foreground/90 italic">
                      &quot;{rule.customPrompt}&quot;
                    </span>
                  </div>

                  {rule.vocabularyBoost.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-muted-foreground">Boosted terms:</span>
                      {rule.vocabularyBoost.map((word, i) => (
                        <span
                          key={i}
                          className="rounded bg-brand/10 text-brand px-1.5 py-0.5 text-[10px] font-mono"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Dialog */}
      {isDialogOpen && editingRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-background p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <SlidersHorizontal className="size-5 text-brand" />
              {rules.some((r) => r.id === editingRule.id)
                ? "Configure App Rule"
                : "Add New App Rule"}
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-muted-foreground font-medium">Application Name</label>
                <Input
                  value={editingRule.appName}
                  onChange={(e) => setEditingRule({ ...editingRule, appName: e.target.value })}
                  placeholder="e.g. Linear, WhatsApp, Xcode"
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <label className="text-muted-foreground font-medium">
                  Process / Bundle ID (Optional)
                </label>
                <Input
                  value={editingRule.appId}
                  onChange={(e) => setEditingRule({ ...editingRule, appId: e.target.value })}
                  placeholder="e.g. com.linear or linear.exe"
                  className="mt-1 text-xs font-mono"
                />
              </div>

              <div>
                <label htmlFor="tone-style-preset" className="text-muted-foreground font-medium">
                  Tone & Style Preset
                </label>
                <select
                  id="tone-style-preset"
                  value={editingRule.tone}
                  onChange={(e) =>
                    setEditingRule({ ...editingRule, tone: e.target.value as AppTone })
                  }
                  className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs text-foreground"
                >
                  <option value="casualChat">Casual Chat (Slack, Discord, Teams)</option>
                  <option value="codeDeveloper">
                    Developer / Code (VS Code, Cursor, Terminal)
                  </option>
                  <option value="formalEmail">Professional Email (Gmail, Outlook)</option>
                  <option value="richNotes">Markdown Notes (Obsidian, Notion)</option>
                  <option value="custom">Custom Instructions</option>
                </select>
              </div>

              <div>
                <label className="text-muted-foreground font-medium">
                  Custom AI Rewrite Instructions
                </label>
                <textarea
                  value={editingRule.customPrompt}
                  onChange={(e) => setEditingRule({ ...editingRule, customPrompt: e.target.value })}
                  rows={3}
                  placeholder="Describe how Shrimp should rewrite spoken dictations in this app..."
                  className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs text-foreground resize-none"
                />
              </div>

              <div>
                <label className="text-muted-foreground font-medium">
                  Vocabulary Boost Keywords (comma separated)
                </label>
                <Input
                  value={editingRule.vocabularyBoost.join(", ")}
                  onChange={(e) =>
                    setEditingRule({
                      ...editingRule,
                      vocabularyBoost: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="e.g. Kubernetes, OAuth, GraphQL"
                  className="mt-1 text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-medium text-foreground">
                  Press Enter automatically after paste
                </span>
                <Switch
                  checked={editingRule.autoEnter}
                  onCheckedChange={(checked) =>
                    setEditingRule({ ...editingRule, autoEnter: checked })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-border/60">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingRule(null);
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-brand text-brand-foreground hover:bg-brand/90"
                onClick={saveDialogRule}
                disabled={!editingRule.appName}
              >
                Save Rule
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
