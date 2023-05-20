// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

extern crate argon2;
extern crate rand;
extern crate uuid;

mod database;
mod state;

mod controllers;

use serde::Serialize;
use state::{AppState, ServiceAccess};
use tauri::{State, Manager, AppHandle};


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command]
fn register(app_handle: AppHandle, email: &str, password: &str, username: &str) -> String {
    let msg = app_handle.db(|db| controllers::add_user(db, username, password, email, )).unwrap();
    msg
}

#[tauri::command]
fn confirm(app_handle: AppHandle, email: &str, code: Option<String>) -> String {
    let msg = app_handle.db(|db| controllers::confirm_admin(db, email, code)).unwrap();
    msg
}

#[tauri::command]
fn login(app_handle: AppHandle, email: &str, password: &str) -> String {
    // Should handle errors instead of unwrapping here
    let items = match app_handle.db(|db| controllers::admin_login(db, email, password)) {
        Ok(i) => i,
        Err(e) => format!("{e:?}")
    };
    items
} 

#[tauri::command]
fn resend(app_handle: AppHandle, email: &str) -> String {
    let msg = app_handle.db(|db| controllers::admin_resend(db, email)).unwrap();
    msg
}

#[tauri::command]
fn profile(app_handle: AppHandle, jwt: &str) -> String {
    let msg = app_handle.db(|db| controllers::admin_profile(db, jwt)).unwrap();
    msg
}

fn main() {
    tauri::Builder::default()
        .manage(AppState { db: Default::default() })
        .invoke_handler(tauri::generate_handler![register, confirm, login, resend, profile])
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