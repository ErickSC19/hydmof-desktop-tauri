use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
pub mod helpers;
pub mod models;
use models::admins::Admin;
use helpers::generate_token::new_token;
use helpers::email::send_email;
use rusqlite::{named_params, Connection, OptionalExtension};
use serde_json::Value;
use std::collections::HashMap;
use uuid::Uuid;

pub fn add_user(
    db: &Connection,
    username: &str,
    password: &str,
    email: &str,
) -> Result<String, rusqlite::Error> {
    let mut _msg: String = String::new();
    let sql = format!("SELECT * FROM admins WHERE email = '{}'", email);
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
        let mut statement = db.prepare("INSERT INTO admins (admin_id, username, email, upassword, token) VALUES (@id, @user, @email, @pass, @token)")?;
        statement.execute(
          named_params! { "@id": uid,"@user": username, "@email": email, "@pass":  password_hash, "@token": token},
      )?;

      let email_body = format!("Su cuenta ya esta registrada, su codigo de confirmación es este: {} \nSi esta cuenta no es tuya, solo ignora este correo", token);  
      match send_email(&email_body, email, username, "Confirmar cuenta") {
        Ok(_) => _msg = "passed".to_string(),
        Err(e) => {_msg = "Error al enviar correo de confirmacion".to_string(); println!("Error sending email: {e:?}")}
      };
    } else {
        _msg = "El correo ya esta en uso".to_string();
    }
    Ok(_msg)
}

pub fn confirm_admin(conn: &Connection, uemail: &str, tcancel: Option<String>) -> Result<String, String> {
    let mut _msg: String = String::new();
    let sql = format!("SELECT * FROM admins WHERE email = '{}'", uemail);
    let mut prp = conn.prepare(&sql).expect("error preparing query");
    let admin: Option<Admin> = prp.query_row([], |row| {
        Ok(Admin {            
            admin_id: row.get(0).unwrap(),
            username: row.get(1).unwrap(),
            email: row.get(2).unwrap(),
            upassword: row.get(3).unwrap(),
            token: row.get(4).unwrap(),
            confirmed: row.get(5).unwrap(),
        })
    }).optional().unwrap();
    if let Some(admin) = admin {
        if admin.token == tcancel {
            let mut upstmnt = conn.prepare("UPDATE admins SET token = NULL, confirmed = true WHERE admin_id = '@id'").expect("error preparing query");
            match upstmnt.execute(named_params! { "@id": admin.admin_id }) {
                Ok(_) => _msg = "passed".to_string(),
                Err(e) => {_msg = "Error durante la confirmación".to_string(); println!("Error on equery execute: {e:?}")}
            }
            
        } else {
            _msg = "codigo incorrecto".to_string();
        }
     } else {
        _msg = "no se encontró el usuario".to_string();
     }
    Ok(_msg)
}

pub fn admin_login(db: &Connection, email: &str, password: &str) -> Result<String, Box<dyn std::error::Error>>{
    let sql = format!("SELECT * FROM admins WHERE email = '{}'", email);
    let mut prp = db.prepare(&sql).expect("error preparing query");
    let admin : Option<Admin> = prp.query_row([], |row| {
        Ok(Admin {            
            admin_id: row.get(0).unwrap(),
            username: row.get(1).unwrap(),
            email: row.get(2).unwrap(),
            upassword: row.get(3).unwrap(),
            token: row.get(4).unwrap(),
            confirmed: row.get(5).unwrap(),
        })
    }).optional().unwrap();
    if let Some(admin) = admin {
        if admin.confirmed == Some(1) {
            let parsed_hash = PasswordHash::new(admin.upassword.as_str()).expect("No se encontro ese usuario");
            Argon2::default().verify_password(password.as_bytes(), &parsed_hash).unwrap();
            Ok("Si".to_string())
        } else {
            Err("cuenta no confirmada".into())
        }
    } else {
        Err("cuenta no encontrada".into())
    }
}

pub fn add_item(db: &Connection, table: &str, values: &str) -> Result<(), rusqlite::Error> {
    let mut statement = db.prepare("INSERT INTO @table (values) VALUES (@values)")?;
    statement.execute(named_params! { "@table": table, "@values": values })?;

    Ok(())
}

pub fn get_all(conn: &Connection, table_name: &str) -> Result<Vec<HashMap<String, Value>>, rusqlite::Error> {
    // Get column names and data types
    let mut stmt = conn.prepare(&format!("PRAGMA table_info({})", table_name))?;
    let rows = stmt.query_map([], |row| {
        Ok((row.get(1)?, row.get(2)?))
    })?;

    // Construct SQL query
    let mut query = format!("SELECT * FROM {}", table_name);
    let mut column_names = vec![];
    for row in rows {
        let (name, _data_type): (String, String) = row?;
        column_names.push(name.clone());
        query += &format!(", {} AS {}", name, name.replace(" ", "_"));
    }

    // Execute query
    let mut stmt = conn.prepare(&query)?;
    let rows = stmt.query_map([], |row| {
        let mut values = HashMap::new();
        for (i, column_name) in column_names.iter().enumerate() {
            let value: Value = row.get(i)?;
            values.insert(column_name.clone(), value);
        }
        Ok(values)
    })?;

    let mut results = Vec::new();
    for row in rows {
        results.push(row?);
    }

    Ok(results)
}

pub fn get_by(conn: &Connection, table_name: &str, column_label: &str, val: &str) -> Result<Vec<HashMap<String, Value>>, rusqlite::Error> {
    // Get column names and data types
    let mut stmt = conn.prepare(&format!("PRAGMA table_info({})", table_name))?;
    let rows = stmt.query_map([], |row| {
        Ok((row.get(1)?, row.get(2)?))
    })?;

    // Construct SQL query
    let mut query = format!("SELECT * FROM {} WHERE {} = {}", table_name, column_label, val);
    let mut column_names = vec![];
    for row in rows {
        let (name, _data_type): (String, String) = row?;
        column_names.push(name.clone());
        query += &format!(", {} AS {}", name, name.replace(" ", "_"));
    }

    // Execute query
    let mut stmt = conn.prepare(&query)?;
    let rows = stmt.query_map([], |row| {
        let mut values = HashMap::new();
        for (i, column_name) in column_names.iter().enumerate() {
            let value: Value = row.get(i)?;
            values.insert(column_name.clone(), value);
        }
        Ok(values)
    })?;

    let mut results = Vec::new();
    for row in rows {
        results.push(row?);
    }

    Ok(results)
}