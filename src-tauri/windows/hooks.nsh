; Installer hooks (bundle.windows.nsis.installerHooks).
;
; Ensures any legacy Shrimp installation is cleanly uninstalled and removed
; when Moustache is installed, and manages Moustache background startup at login.

Var MoustacheUpgrade

!macro NSIS_HOOK_PREINSTALL
  ; Terminate any legacy Shrimp process if running
  nsExec::Exec 'taskkill /F /IM "Shrimp.exe"'
  nsExec::Exec 'taskkill /F /IM "shrimp.exe"'

  ; Check if legacy Shrimp uninstaller exists and run it silently
  IfFileExists "$LOCALAPPDATA\Programs\Shrimp\uninstall.exe" 0 +3
    nsExec::Exec '"$LOCALAPPDATA\Programs\Shrimp\uninstall.exe" /S _?=$LOCALAPPDATA\Programs\Shrimp'
    RMDir /r "$LOCALAPPDATA\Programs\Shrimp"

  IfFileExists "$PROGRAMFILES\Shrimp\uninstall.exe" 0 +3
    nsExec::Exec '"$PROGRAMFILES\Shrimp\uninstall.exe" /S _?=$PROGRAMFILES\Shrimp'
    RMDir /r "$PROGRAMFILES\Shrimp"

  ; Clean up any legacy Shrimp desktop / start menu shortcuts
  Delete "$DESKTOP\Shrimp.lnk"
  Delete "$SMPROGRAMS\Shrimp.lnk"
  Delete "$SMPROGRAMS\Shrimp\Shrimp.lnk"
  RMDir /r "$SMPROGRAMS\Shrimp"

  ; Clean up legacy Shrimp startup entries from Registry
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "Shrimp"
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "Shrimp Dev"
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\Run" "Shrimp"
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\Run" "Shrimp Dev"

  ; Track whether this is an upgrade of Moustache
  StrCpy $MoustacheUpgrade "0"
  IfFileExists "$INSTDIR\${MAINBINARYNAME}.exe" 0 +2
    StrCpy $MoustacheUpgrade "1"
!macroend

!macro NSIS_HOOK_POSTINSTALL
  StrCmp $MoustacheUpgrade "1" +2 0
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "${PRODUCTNAME}" '"$INSTDIR\${MAINBINARYNAME}.exe" --background'
!macroend

!macro NSIS_HOOK_PREUNINSTALL
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "${PRODUCTNAME}"
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\Run" "${PRODUCTNAME}"
!macroend
