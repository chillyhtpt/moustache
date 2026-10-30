export type AppTone = "casualChat" | "codeDeveloper" | "formalEmail" | "richNotes" | "custom";

export interface AppRule {
  id: string;
  appName: string;
  appId: string;
  tone: AppTone;
  autoEnter: boolean;
  codeFormatting: boolean;
  customPrompt: string;
  vocabularyBoost: string[];
  enabled: boolean;
}
