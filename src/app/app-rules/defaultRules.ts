import type { AppRule } from "./types";

const STORAGE_KEY = "moustache:appRules";
const LEGACY_STORAGE_KEY = "shrimp:appRules";

export const DEFAULT_APP_RULES: AppRule[] = [
  {
    id: "rule-slack",
    appName: "Slack",
    appId: "com.tinyspeck.slackmacgap",
    tone: "casualChat",
    autoEnter: true,
    codeFormatting: false,
    customPrompt:
      "Format as concise chat messages. Use bullet points for multiple thoughts. Do not include formal greetings or sign-offs.",
    vocabularyBoost: ["PR", "deploy", "staging", "standup", "LGTM", "blocker"],
    enabled: true,
  },
  {
    id: "rule-vscode",
    appName: "VS Code / Cursor",
    appId: "com.microsoft.VSCode",
    tone: "codeDeveloper",
    autoEnter: false,
    codeFormatting: true,
    customPrompt:
      "Maintain code formatting: camelCase, snake_case, backticks for variable names and CLI commands. Do not capitalize the first word if it represents code.",
    vocabularyBoost: [
      "async",
      "await",
      "useEffect",
      "useState",
      "cargo",
      "clippy",
      "tauri",
      "refactor",
    ],
    enabled: true,
  },
  {
    id: "rule-discord",
    appName: "Discord",
    appId: "com.hnc.Discord",
    tone: "casualChat",
    autoEnter: true,
    codeFormatting: false,
    customPrompt: "Keep it casual and punchy. Preserve gaming and developer slang.",
    vocabularyBoost: ["gg", "afk", "voice", "stream", "ping"],
    enabled: true,
  },
  {
    id: "rule-gmail",
    appName: "Gmail / Mail",
    appId: "com.google.Chrome.gmail",
    tone: "formalEmail",
    autoEnter: false,
    codeFormatting: false,
    customPrompt:
      "Format as a polished, professional email with an appropriate greeting, well-structured paragraphs, and polite closing signature.",
    vocabularyBoost: ["regards", "schedule", "follow up", "attached", "deliverable"],
    enabled: true,
  },
  {
    id: "rule-obsidian",
    appName: "Obsidian / Notion",
    appId: "md.obsidian",
    tone: "richNotes",
    autoEnter: false,
    codeFormatting: false,
    customPrompt:
      "Format as clean markdown notes. Use markdown headings (##, ###), bulleted lists, and bold emphasis for key ideas.",
    vocabularyBoost: ["MOC", "backlinks", "fleeting notes", "atomic note"],
    enabled: true,
  },
];

export function loadAppRules(): AppRule[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_APP_RULES));
      return DEFAULT_APP_RULES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_APP_RULES;
  } catch {
    return DEFAULT_APP_RULES;
  }
}

export function saveAppRules(rules: AppRule[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
  } catch {
    // Ignore storage quota
  }
}
