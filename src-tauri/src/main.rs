// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};

use tauri::{State, AppHandle};

use std::error::Error;
use std::{error, string, sync::Mutex, sync::Arc};

mod helpers {
    pub mod generate_token;
}

#[macro_use]
extern crate diesel;
#[macro_use] 
extern crate diesel_migrations;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("./migrations/");

use diesel::prelude::*;
pub mod email;
use helpers::generate_token::*; 
pub mod schema;
pub mod db;

fn run_migrations(connection: &mut SqliteConnection) -> Result<(), Box<dyn Error + Send + Sync + 'static>> {

    // This will run the necessary migrations.
    //
    // See the documentation for `MigrationHarness` for
    // all available methods.
    connection.run_pending_migrations(MIGRATIONS).unwrap();

    Ok(())
}


#[tauri::command]
fn admins_list(state: tauri::State<AppState>) -> String{
    let conn = state.conn.lock().unwrap();
    let con = state.conn.get_mut().unwrap();
    db::admins_list(con)
}
#[tauri::command]
fn admins_create(username: String, password: String, email: String, state: tauri::State<AppState>) -> String{
    let conn = state.conn.lock().unwrap();
    let con = state.conn.get_mut().unwrap();
    let token: String = generate_token();
    db::admins_create(con, &username, &email, &password, Some(&token)).to_string()
}

#[tauri::command]
fn admins_toggle(id: i32, state: tauri::State<AppState>) -> Result<String, ()> {
    let conn = state.conn.lock().unwrap();
    let con = state.conn.get_mut().unwrap();
    let res: String = db::admins_toggle(con, id);
    Ok(res)
}
#[tauri::command]
fn admins_delete(id: i32, state: tauri::State<AppState>) -> String {
    let conn = state.conn.lock().unwrap();
    let con = state.conn.get_mut().unwrap();
    db::admins_delete(con, id);
    String::from("")
}
// End of DB example

struct AppState {
    conn: std::sync::Mutex<SqliteConnection>,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
fn main() {
    let mut con = &mut db::establish_connection();
    let state = AppState {
        conn: Mutex::new(db::establish_connection()),
    };

    // embedded_migrations::run(&conn);
    run_migrations(con).expect("Error migrating");
    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            admins_list,
            admins_create,
            admins_toggle,
            admins_delete,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}