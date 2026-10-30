import { Check, Download, FolderSync, Layers, ShieldCheck, Upload } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function VaultSyncCard() {
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Prompt Stacking state
  const [selectedStack, setSelectedStack] = useState<string[]>([
    "Grammar & Polish",
    "Executive Conciseness",
  ]);

  const STACK_PRESETS = [
    "Grammar & Polish",
    "Executive Conciseness",
    "Developer Technical Context",
    "Customer Support Empathy",
    "Academic Formal",
  ];

  const toggleStackItem = (item: string) => {
    setSelectedStack((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const handleExportVault = () => {
    const vaultBundle = {
      app: "Moustache",
      version: "1.0.0",
      exportedAt: new Date().toISOString(),
      vaultType: "TeamConfigurationVault",
      encryption: "AES-GCM-256 (Simulated)",
      dictionary: [
        { term: "Moustache", misspelling: "Mustache" },
        { term: "Tauri v2", misspelling: "Tori" },
        { term: "Kubernetes", misspelling: "Kubernets" },
      ],
      snippets: [
        { trigger: ";cal", expansion: "Let me check my calendar for {{date}} at {{time}}." },
        { trigger: ";standup", expansion: "Yesterday: {{clipboard}}\nToday: Working on roadmap." },
      ],
      appRules: [
        { app: "Slack", tone: "casualChat", autoEnter: true },
        { app: "VS Code", tone: "codeDeveloper", autoEnter: false },
      ],
      promptStacks: selectedStack,
    };

    const blob = new Blob([JSON.stringify(vaultBundle, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `moustache-team-vault-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateImport = () => {
    setImportStatus("Importing & decrypting team vault bundle...");
    setTimeout(() => {
      setImportStatus(
        "Successfully imported 14 dictionary terms, 8 snippets, and 4 app rules from team vault!",
      );
      setTimeout(() => setImportStatus(null), 3500);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-border/80 bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <FolderSync className="size-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Team Vault Sync & Prompt Stacking
            </h2>
            <p className="text-xs text-muted-foreground">
              Synchronize encrypted dictionary, snippets, and app rules across your engineering
              team.
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] gap-1 text-emerald-500 border-emerald-500/30"
        >
          <ShieldCheck className="size-3" />
          Zero-Knowledge Vault
        </Badge>
      </div>

      {/* Multi-Prompt Stacking */}
      <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Layers className="size-3.5 text-brand" />
            Active Prompt Pipeline Stack
          </span>
          <span className="text-[11px] text-muted-foreground">
            Transforms execute sequentially in order
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {STACK_PRESETS.map((item) => {
            const isSelected = selectedStack.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleStackItem(item)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer border ${
                  isSelected
                    ? "border-brand bg-brand/10 text-brand font-semibold"
                    : "border-border bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                {isSelected ? `✓ ${item}` : `+ ${item}`}
              </button>
            );
          })}
        </div>

        {selectedStack.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/60 p-2 rounded border border-border/40">
            <span className="font-semibold text-foreground">Active Pipeline:</span>
            <span>{selectedStack.join(" ➔ ")}</span>
          </div>
        )}
      </div>

      {/* Vault Sync Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs cursor-pointer"
            onClick={handleExportVault}
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-500" />
            ) : (
              <Download className="size-3.5" />
            )}
            {copied ? "Vault Exported!" : "Export Team Vault (.json)"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs cursor-pointer"
            onClick={handleSimulateImport}
          >
            <Upload className="size-3.5" />
            Import Team Vault
          </Button>
        </div>

        {importStatus && (
          <span className="text-xs font-medium text-brand animate-fade-in">{importStatus}</span>
        )}
      </div>
    </div>
  );
}
