// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod state;

use state::{AppState, ServiceAccess};
use tauri::{State, Manager, AppHandle};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn login(app_handle: AppHandle, username: &str, password: &str) -> String {
    // Should handle errors instead of unwrapping here
    app_handle.db(|db| database::add_item(password, username, db)).unwrap();

    let items = app_handle.db(|db| database::get_all(db)).unwrap();

    let items_string = items.join(" | ");

    format!("Your name log: {}", items_string)
}

#[tauri::command]
fn register(app_handle: AppHandle, email: &str, password: &str) -> String {
    // Should handle errors instead of unwrapping here
    app_handle.db(|db| database::add_item(password, email, db)).unwrap();

    let items = app_handle.db(|db| database::get_all(db)).unwrap();

    let items_string = items.join(" | ");

    format!("Your name log: {}", items_string)
}
fn main() {
    tauri::Builder::default()
        .manage(AppState { db: Default::default() })
        .invoke_handler(tauri::generate_handler![login, register])
        .setup(|app| {
            let handle = app.handle();

            let app_state: State<AppState> = handle.state();
            let db = database::initialize_database(&handle).expect("Database initialize should succeed");
            *app_state.db.lock().unwrap() = Some(db);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}