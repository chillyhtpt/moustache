import {
  Briefcase,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Mail,
  MessageSquare,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MeetingNote } from "./types";

interface PostMeetingWorkflowDialogProps {
  meeting: MeetingNote;
  open: boolean;
  onClose: () => void;
}

type WorkflowTab = "email" | "slack" | "jira" | "notion";

export function PostMeetingWorkflowDialog({
  meeting,
  open,
  onClose,
}: PostMeetingWorkflowDialogProps) {
  const [tab, setTab] = useState<WorkflowTab>("email");
  const [copied, setCopied] = useState<string | null>(null);

  if (!open) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  // 1. Follow-up Email
  const attendeesList = meeting.segments
    .map((s) => s.speaker)
    .filter((v, i, a) => a.indexOf(v) === i && v !== "You")
    .join(", ");

  const emailSubject = `Recap & Action Items: ${meeting.title}`;
  const emailBody = `Hi team${attendeesList ? ` (${attendeesList})` : ""},

Thanks for your time today during our ${meeting.title}. Here is a quick summary of what we discussed, agreed upon, and next steps:

Executive Summary:
${meeting.summary}

Key Decisions:
${meeting.decisions.map((d) => `• ${d}`).join("\n")}

Action Items & Next Steps:
${meeting.actionItems.map((a) => `• [${a.done ? "COMPLETED" : "PENDING"}] ${a.text}${a.assignee ? ` (@${a.assignee})` : ""}`).join("\n")}

Please let me know if I missed anything or if any adjustments are needed.

Best regards,
Moustache Meeting Intelligence`;

  // 2. Slack Blocks
  const slackText = `*📋 ${meeting.title} — Meeting Summary*
> ${meeting.summary}

*⚡ Decisions Made:*
${meeting.decisions.map((d) => `• ${d}`).join("\n")}

*✅ Action Items:*
${meeting.actionItems.map((a) => `• ${a.done ? "~" : ""}${a.text}${a.done ? "~" : ""}${a.assignee ? ` - <@${a.assignee}>` : ""}`).join("\n")}

_Generated with Moustache AI Notes_`;

  // 3. Notion Blocks
  const notionText = `# 🎙️ ${meeting.title}
*Date:* ${new Date(meeting.createdAt).toLocaleString()}
*Template:* ${meeting.template}

> 💡 **Summary**
> ${meeting.summary}

## 🎯 Decisions
${meeting.decisions.map((d) => `- [x] ${d}`).join("\n")}

## 📝 Tasks / Action Items
| Task | Assignee | Status |
| --- | --- | --- |
${meeting.actionItems.map((a) => `| ${a.text} | ${a.assignee || "Unassigned"} | ${a.done ? "Done" : "To Do"} |`).join("\n")}

## 💬 Verbatim Transcript
${meeting.segments.map((s) => `> **[${s.timestamp}] ${s.speaker}:** ${s.text}`).join("\n")}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="workflow-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
    >
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-border bg-card p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h2 id="workflow-dialog-title" className="text-lg font-bold text-foreground">
                Automated Post-Meeting Workflows
              </h2>
              <p className="text-xs text-muted-foreground">{meeting.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-border/40 py-3">
          <Button
            size="sm"
            variant={tab === "email" ? "default" : "outline"}
            className="gap-2 text-xs"
            onClick={() => setTab("email")}
          >
            <Mail className="size-3.5" />
            Follow-Up Email
          </Button>
          <Button
            size="sm"
            variant={tab === "slack" ? "default" : "outline"}
            className="gap-2 text-xs"
            onClick={() => setTab("slack")}
          >
            <MessageSquare className="size-3.5" />
            Slack Digest
          </Button>
          <Button
            size="sm"
            variant={tab === "jira" ? "default" : "outline"}
            className="gap-2 text-xs"
            onClick={() => setTab("jira")}
          >
            <Briefcase className="size-3.5" />
            Linear / Jira Tickets ({meeting.actionItems.length})
          </Button>
          <Button
            size="sm"
            variant={tab === "notion" ? "default" : "outline"}
            className="gap-2 text-xs"
            onClick={() => setTab("notion")}
          >
            <ExternalLink className="size-3.5" />
            Notion Database
          </Button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto py-4">
          {tab === "email" && (
            <div className="flex flex-col gap-3">
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <span className="text-xs font-semibold text-muted-foreground">Subject: </span>
                <span className="text-xs font-medium text-foreground">{emailSubject}</span>
              </div>
              <textarea
                readOnly
                value={emailBody}
                rows={12}
                className="w-full rounded-lg border border-border/80 bg-background p-3 font-sans text-xs leading-relaxed text-foreground select-all"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <a
                  href={`mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                  className="inline-flex h-(--control-h) items-center gap-1.5 rounded-md border border-input px-3 text-xs font-medium text-foreground hover:bg-muted"
                >
                  <ExternalLink className="size-3.5" />
                  Open in Mail Client
                </a>
                <Button
                  size="sm"
                  className="bg-brand text-brand-foreground hover:bg-brand/90 gap-1.5 text-xs"
                  onClick={() => handleCopy(emailBody, "email")}
                >
                  {copied === "email" ? (
                    <Check className="size-3.5 text-brand-foreground" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                  {copied === "email" ? "Email Copied!" : "Copy Full Email"}
                </Button>
              </div>
            </div>
          )}

          {tab === "slack" && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-muted-foreground">
                Formatted Slack mrkdwn blocks ready to paste directly into your project or team
                channel.
              </p>
              <textarea
                readOnly
                value={slackText}
                rows={12}
                className="w-full rounded-lg border border-border/80 bg-background p-3 font-mono text-xs leading-relaxed text-foreground select-all"
              />
              <div className="flex justify-end pt-2">
                <Button
                  size="sm"
                  className="bg-brand text-brand-foreground hover:bg-brand/90 gap-1.5 text-xs"
                  onClick={() => handleCopy(slackText, "slack")}
                >
                  {copied === "slack" ? (
                    <Check className="size-3.5 text-brand-foreground" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                  {copied === "slack" ? "Slack Digest Copied!" : "Copy Slack Blocks"}
                </Button>
              </div>
            </div>
          )}

          {tab === "jira" && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-muted-foreground">
                Extracted action items automatically converted into ready-to-dispatch Linear & Jira
                issue tickets.
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                {meeting.actionItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-3 shadow-2xs"
                  >
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                        ENG-{idx + 101}
                      </Badge>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{item.text}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Assignee: {item.assignee ? `@${item.assignee}` : "Unassigned"} • Context:{" "}
                          {meeting.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={item.done ? "default" : "outline"}
                        className="text-[10px] capitalize"
                      >
                        {item.done ? "Closed" : "To Do"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs gap-1"
                        onClick={() =>
                          handleCopy(
                            `Ticket ENG-${idx + 101}: ${item.text}\nAssignee: ${item.assignee || "Unassigned"}\nOrigin: ${meeting.title}`,
                            `item-${item.id}`,
                          )
                        }
                      >
                        {copied === `item-${item.id}` ? (
                          <CheckCircle2 className="size-3.5 text-brand" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                        Copy Ticket
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "notion" && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-muted-foreground">
                Standard Notion markdown page formatted with database tables and callouts.
              </p>
              <textarea
                readOnly
                value={notionText}
                rows={12}
                className="w-full rounded-lg border border-border/80 bg-background p-3 font-mono text-xs leading-relaxed text-foreground select-all"
              />
              <div className="flex justify-end pt-2">
                <Button
                  size="sm"
                  className="bg-brand text-brand-foreground hover:bg-brand/90 gap-1.5 text-xs"
                  onClick={() => handleCopy(notionText, "notion")}
                >
                  {copied === "notion" ? (
                    <Check className="size-3.5 text-brand-foreground" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                  {copied === "notion" ? "Notion Markdown Copied!" : "Copy Notion Page"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
