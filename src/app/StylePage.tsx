import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppWindow, Feather } from "lucide-react";
import { AppFormatsSection } from "./AppFormatsSection";
import { AppRulesPage } from "./app-rules/AppRulesPage";
import { CleanupSection } from "./CleanupSection";
import { Page } from "./Page";
import { StylesSection } from "./StylesSection";
import { useSettings } from "./useSettings";
import { cn } from "@/lib/utils";

export function StylePage() {
  const { t } = useTranslation();
  const { settings, error, update } = useSettings();
  const [tab, setTab] = useState<"general" | "appRules">("general");

  return (
    <Page title={t("style.title")}>
      <div className="mb-4 flex items-center gap-1 rounded-lg border border-border/60 bg-muted/30 p-1">
        <button
          type="button"
          onClick={() => setTab("general")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-md py-1.5 text-xs font-medium transition-colors cursor-pointer",
            tab === "general"
              ? "bg-background text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Feather className="size-3.5" />
          General Styles & Cleanup
        </button>
        <button
          type="button"
          onClick={() => setTab("appRules")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-md py-1.5 text-xs font-medium transition-colors cursor-pointer",
            tab === "appRules"
              ? "bg-background text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <AppWindow className="size-3.5 text-brand" />
          App-Specific Behaviour (Wispr Flow)
        </button>
      </div>

      {tab === "appRules" ? (
        <AppRulesPage />
      ) : (
        <>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          {settings ? (
            <>
              <CleanupSection
                value={settings.ai.cleanup}
                onChange={(cleanup) => void update({ ai: { cleanup } })}
              />
              <StylesSection
                styles={settings.styles}
                onChange={(category, style) => void update({ styles: { [category]: style } })}
              />
              <AppFormatsSection
                formats={settings.appFormats}
                onChange={(appFormats) => void update({ appFormats })}
              />
            </>
          ) : (
            !error && <p className="text-muted-foreground">{t("common.loading")}</p>
          )}
        </>
      )}
    </Page>
  );
}
