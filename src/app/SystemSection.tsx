import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Group, Row, RowText, Section } from "@/components/settings";
import { Button } from "@/components/ui/button";
import { resetApp, type Settings, type SettingsPatch } from "../lib/ipc";
import { ConfirmDialog } from "./ConfirmDialog";
import { ToggleRow } from "./ToggleRow";
import { IS_WINDOWS } from "../lib/platform";

interface SystemSectionProps {
  settings: Settings;
  update: (patch: SettingsPatch) => Promise<void>;
  onOpenUpgrade?: (() => void) | undefined;
}

/** Settings › System: launch at login, the Dock icon (macOS only) and Reset & restart (APP-06..08). */
export function SystemSection({ settings, update, onOpenUpgrade }: SystemSectionProps) {
  const { t } = useTranslation();
  const [resetting, setResetting] = useState(false);
  return (
    <Section headingId="system-heading" title={t("system.title")}>
      <Group>
        <ToggleRow
          label={t("system.launchAtLogin")}
          description={t("system.launchAtLoginBody")}
          checked={settings.app.launchAtLogin}
          onChange={(launchAtLogin) => void update({ app: { launchAtLogin } })}
        />
        {!IS_WINDOWS && (
          <ToggleRow
            label={t("system.showInDock")}
            description={t("system.showInDockBody")}
            checked={settings.app.showInDock}
            onChange={(showInDock) => void update({ app: { showInDock } })}
          />
        )}
        {onOpenUpgrade && (
          <Row>
            <RowText
              title="Software Updates"
              description="Manage release channels, verify signatures, and review release notes."
            />
            <Button variant="outline" size="sm" onClick={onOpenUpgrade}>
              Upgrade Manager
            </Button>
          </Row>
        )}
        <Row>
          <RowText title={t("system.resetTitle")} description={t("system.resetBody")} />
          <Button variant="destructive" size="sm" onClick={() => setResetting(true)}>
            {t("system.reset")}
          </Button>
        </Row>
      </Group>
      {resetting && (
        <ConfirmDialog
          title={t("system.resetConfirmTitle")}
          message={t("system.resetConfirmBody")}
          confirmLabel={t("system.reset")}
          onCancel={() => setResetting(false)}
          onConfirm={resetApp}
        />
      )}
    </Section>
  );
}
