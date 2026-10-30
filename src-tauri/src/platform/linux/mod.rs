//! Generic Linux fallback platform backend.

use std::path::Path;
use std::sync::Arc;
use tauri::{AppHandle, Runtime, WebviewWindow};

use super::{
    AppIdentity, CuePlayer, FocusInspector, GlobeKeyAction, InertHotkeys, InsertOptions,
    InsertOutcome, InsertText, Launcher, LoginItem, MainThread, MediaControl, MouseDevices,
    Permission, PermissionStatus, Permissions, Platform, PlatformError, Restore, TextInserter,
};
use crate::audio::devices::CpalDevices;
use crate::hotkeys::{windows_defaults, windows_label, windows_reserved};
use crate::sounds::Cue;

pub mod flow_bar {
    use super::*;

    pub fn make_panel<R: Runtime>(_window: &WebviewWindow<R>) -> Result<(), PlatformError> {
        Ok(())
    }

    pub fn show_first<R: Runtime>(
        _app: &AppHandle<R>,
        window: &WebviewWindow<R>,
    ) -> tauri::Result<()> {
        let _ = window.show();
        Ok(())
    }

    pub fn set_visible<R: Runtime>(_app: &AppHandle<R>, _label: &str, _visible: bool) {}
}

pub mod main_window {
    use super::*;

    pub fn drop_frame_line<R: Runtime>(_window: &WebviewWindow<R>) -> Result<(), PlatformError> {
        Ok(())
    }

    pub fn show_window_menu<R: Runtime>(_window: &WebviewWindow<R>) -> Result<(), PlatformError> {
        Ok(())
    }
}

pub struct LinuxInserter;

impl TextInserter for LinuxInserter {
    fn insert(
        &self,
        _text: &InsertText,
        _options: &InsertOptions,
    ) -> Result<InsertOutcome, PlatformError> {
        Ok(InsertOutcome::Pasted)
    }

    fn copy(&self, _text: &InsertText) -> Result<(), PlatformError> {
        Ok(())
    }
}

pub struct LinuxFocus;

impl FocusInspector for LinuxFocus {
    fn frontmost_app(&self) -> Option<AppIdentity> {
        Some(AppIdentity {
            bundle_id: "generic".into(),
            name: "App".into(),
        })
    }
}

pub struct LinuxPermissions;

impl Permissions for LinuxPermissions {
    fn status(&self, _permission: Permission) -> PermissionStatus {
        PermissionStatus::Granted
    }

    fn request(&self, _permission: Permission) -> Result<(), PlatformError> {
        Ok(())
    }

    fn open_settings(&self, _permission: Permission) -> Result<(), PlatformError> {
        Ok(())
    }
}

pub struct LinuxCuePlayer;

impl CuePlayer for LinuxCuePlayer {
    fn play(&self, _cue: Cue) {}
}

pub struct LinuxLauncher;

impl Launcher for LinuxLauncher {
    fn open_url(&self, _url: &str) -> Result<(), PlatformError> {
        Ok(())
    }
}

pub struct LinuxMedia;

impl MediaControl for LinuxMedia {
    fn mute(&self) -> Option<Restore> {
        None
    }

    fn pause(&self) -> Option<Restore> {
        None
    }
}

pub struct LinuxLoginItem;

impl LoginItem for LinuxLoginItem {
    fn enabled(&self) -> bool {
        false
    }

    fn set_enabled(&self, _on: bool) -> Result<(), PlatformError> {
        Ok(())
    }

    fn launched_at_login(&self) -> bool {
        false
    }
}

pub struct LinuxMice;

impl MouseDevices for LinuxMice {
    fn most_buttons(&self) -> u32 {
        3
    }
}

pub fn platform(_main_thread: MainThread) -> Platform {
    Platform {
        hotkeys: Box::new(InertHotkeys),
        inserter: Arc::new(LinuxInserter),
        focus: Arc::new(LinuxFocus),
        permissions: Arc::new(LinuxPermissions),
        sounds: Arc::new(LinuxCuePlayer),
        launcher: Arc::new(LinuxLauncher),
        devices: Arc::new(CpalDevices),
        media: Arc::new(LinuxMedia),
        default_bindings: windows_defaults(),
        label: windows_label,
        reserved: windows_reserved,
        language: None,
        globe_key: GlobeKeyAction::DoNothing,
        user_name: None,
        login_item: Arc::new(LinuxLoginItem),
        region: None,
        mice: Arc::new(LinuxMice),
    }
}

pub fn set_own_field_focused(_focused: bool) {}

pub fn free_bytes(_path: &Path) -> Option<u64> {
    Some(100 * 1024 * 1024 * 1024)
}

pub fn is_windows_11() -> bool {
    false
}

pub fn small_icon_size() -> Option<u32> {
    Some(16)
}

pub fn language_name(code: &str, _language: &str) -> Option<String> {
    Some(code.to_uppercase())
}

pub fn open_sound_settings() -> Result<(), PlatformError> {
    Ok(())
}

pub fn open_keyboard_settings() -> Result<(), PlatformError> {
    Ok(())
}

pub fn open_storage_settings() -> Result<(), PlatformError> {
    Ok(())
}

pub fn relaunch_after_exit() -> Result<(), PlatformError> {
    Ok(())
}

pub fn outside_applications() -> bool {
    false
}

pub fn move_to_applications() -> Result<bool, PlatformError> {
    Ok(false)
}
