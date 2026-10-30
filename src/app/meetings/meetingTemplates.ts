import type { MeetingTemplate } from "./types";

export const MEETING_TEMPLATES: MeetingTemplate[] = [
  {
    id: "general",
    name: "General Meeting",
    description: "Structured executive summary, discussion topics, decisions, and action items.",
    icon: "FileText",
    defaultPrompt:
      "Summarize the conversation clearly. Identify main topics, agreed decisions, and concrete next steps.",
  },
  {
    id: "oneOnOne",
    name: "1-on-1 Catch-up",
    description: "Personal sync, updates, feedback, blocker removal, and mutual commitments.",
    icon: "Users",
    defaultPrompt:
      "Highlight priorities discussed, feedback exchanged, team health or career goals, and commitments made by each person.",
  },
  {
    id: "standup",
    name: "Team Sync / Standup",
    description: "Progress updates, blockers, deliverables, and sprint goals.",
    icon: "ListChecks",
    defaultPrompt:
      "Organize by: What was completed, What is currently in progress, Blockers/Need help with, and Goals for today/this sprint.",
  },
  {
    id: "sales",
    name: "Client / Sales Call",
    description: "Client pain points, requirements, commercial terms, and follow-up timeline.",
    icon: "Briefcase",
    defaultPrompt:
      "Extract customer profile & needs, specific pain points mentioned, pricing/budget discussed, objections raised, and agreed follow-ups with timelines.",
  },
  {
    id: "brainstorm",
    name: "Brainstorm & Strategy",
    description: "Idea exploration, problem framing, consensus points, and prototype experiments.",
    icon: "Lightbulb",
    defaultPrompt:
      "Capture the core challenge/objective, all creative ideas proposed, convergence/consensus decisions, and research or prototype tasks assigned.",
  },
];
