use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use serde::{Deserialize, Serialize};
pub mod helpers;
pub mod models;
use helpers::generate_token::new_token;
use models::users;
use rusqlite::{named_params, Connection, Row};
use std::convert::From;
use std::fs;
use tauri::AppHandle;
use uuid::Uuid;

pub fn add_user(
    db: &Connection,
    username: &str,
    password: &str,
    email: &str,
) -> Result<(), rusqlite::Error> {
    let sql = format!("SELECT * FROM admins WHERE email = {}", email);
    let mut prp = db.prepare(&sql)?;
    if prp.exists([]).unwrap() == false {
        let uid: String = Uuid::new_v4().to_string();
        let token: String = new_token();
        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();
        let password_hash = argon2
            .hash_password(password.as_bytes(), &salt)
            .expect("error")
            .to_string();
        let mut statement = db.prepare("INSERT INTO users (admin_id, username, email, upassword, token) VALUES (@id, @user, @email, @pass, @token)")?;
        statement.execute(
          named_params! { "@id": uid,"@user": username, "@emai": email, "@pass":  password_hash, "@token": token},
      )?;
    };
    Ok(())
}

pub fn get_all(db: &Connection, table: &str) -> Result<Vec<String>, rusqlite::Error> {
    let mut statement = db.prepare("SELECT * FROM admins")?;
    let mut rows = statement.query([])?;
    let mut items = Vec::new();
    while let Some(row) = rows.next()? {
        let title: String = row.get("title")?;

        items.push(title);
    }

    Ok(items)
}

pub fn get_by<'a, T>(
    db: &Connection,
    table: &str,
    filter: &str,
    value: &str,
) -> Result<Vec<T>, rusqlite::Error>
where
    T: From<Row<'a>> + std::convert::From<&rusqlite::Row<'_>>,
{
    let sql = format!("SELECT * FROM {} WHERE {} = ?", table, filter);
    let mut prp = db.prepare(&sql)?;
    let rows = prp.query_map(&[value], |row| Ok(row.into()))?;

    let results: Result<Vec<T>, rusqlite::Error> = rows.collect();
    results

}
