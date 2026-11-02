//! The foreground app and its focused field (WIN-11), for context awareness
//! and for deciding between pasting and leaving the transcript on the
//! clipboard (INS-04).

use std::sync::atomic::{AtomicBool, AtomicUsize, Ordering};
use std::time::Duration;

use windows::Win32::Foundation::HWND;

use super::{context, process, uia};
use crate::platform::{
    AppIdentity, ContextRequest, Editable, FieldContext, FocusInspector, TextRange,
};

/// How long a caller waits for UI Automation.
const READ_TIMEOUT: Duration = Duration::from_millis(1_500);
const CHECK_TIMEOUT: Duration = Duration::from_millis(600);

/// Whether a text field in Shrimp's own window has focus, as its webview reports.
static OWN_FIELD_FOCUSED: AtomicBool = AtomicBool::new(false);
static REMEMBERED_WINDOW: AtomicUsize = AtomicUsize::new(0);

pub fn remember_target_window() {
    if let Some(w) = process::foreground_window() {
        if process::window_pid(w) != process::own_pid() {
            REMEMBERED_WINDOW.store(w.0 as usize, Ordering::Relaxed);
        }
    }
}

pub fn remembered_target_window() -> Option<HWND> {
    let raw = REMEMBERED_WINDOW.load(Ordering::Relaxed);
    if raw != 0 {
        Some(HWND(raw as *mut core::ffi::c_void))
    } else {
        None
    }
}

pub fn set_own_field_focused(focused: bool) {
    OWN_FIELD_FOCUSED.store(focused, Ordering::Relaxed);
}

pub struct WinFocus;

impl FocusInspector for WinFocus {
    fn frontmost_app(&self) -> Option<AppIdentity> {
        remember_target_window();
        process::identity(process::foreground_pid()?)
    }

    fn read_field(&self, request: &ContextRequest) -> Option<FieldContext> {
        let request = *request;
        uia::run(READ_TIMEOUT, move |automation| {
            context::read(automation, &request)
        })
        .flatten()
    }

    fn select_range(&self, field_id: u64, range: TextRange) -> bool {
        uia::run(READ_TIMEOUT, move |automation| {
            context::select_range(automation, field_id, range)
        })
        .unwrap_or(false)
    }
}

/// Whether the foreground app has a field focused that takes text.
pub fn focused_field() -> Editable {
    let Some(window) = process::foreground_window() else {
        return Editable::Unknown;
    };
    if process::window_pid(window) == process::own_pid() {
        // Onboarding's practice field and Shrimp's own text boxes take dictation.
        return if OWN_FIELD_FOCUSED.load(Ordering::Relaxed) {
            Editable::Yes
        } else {
            Editable::No
        };
    }
    uia::run(CHECK_TIMEOUT, |automation| {
        context::focused(automation)
            .map_or(Editable::Unknown, |element| context::classify(&element))
    })
    .unwrap_or(Editable::Unknown)
}
