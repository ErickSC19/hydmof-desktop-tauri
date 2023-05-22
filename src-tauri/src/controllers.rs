use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
pub mod helpers;
pub mod models;
use helpers::email::send_email;
use helpers::generate_token::new_token;
use helpers::jwt::generate_jwt;
use models::admins::Admin;
use rusqlite::{named_params, Connection, Error, OptionalExtension};
use serde_json::{json, Value};
use std::collections::HashMap;
use uuid::Uuid;

use self::helpers::jwt::{verify_jwt, LoggedId};

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
            Err(e) => {
                _msg = "Error al enviar correo de confirmacion".to_string();
                println!("Error sending email: {e:?}")
            }
        };
    } else {
        _msg = "El correo ya esta en uso".to_string();
    }
    Ok(_msg)
}

pub fn confirm_admin(
    conn: &Connection,
    uemail: &str,
    tcancel: Option<String>,
) -> Result<String, String> {
    let mut _msg: String = String::new();
    let sql = format!("SELECT * FROM admins WHERE email = '{}'", uemail);
    let mut prp = conn.prepare(&sql).expect("error preparing query");
    let admin: Option<Admin> = prp
        .query_row([], |row| {
            Ok(Admin {
                admin_id: row.get(0).unwrap(),
                username: row.get(1).unwrap(),
                upassword: row.get(2).unwrap(),
                email: row.get(3).unwrap(),
                token: row.get(4).unwrap(),
                confirmed: row.get(5).unwrap(),
            })
        })
        .optional()
        .unwrap();
    if let Some(admin) = admin {
        if admin.token == tcancel {
            let mut upstmnt = conn
                .prepare("UPDATE admins SET token = NULL, confirmed = true WHERE admin_id = :id")
                .expect("error preparing query");
            match upstmnt.execute(named_params! { ":id": admin.admin_id }) {
                Ok(_) => _msg = admin.admin_id.unwrap(),
                Err(e) => {
                    _msg = "Error durante la confirmación".to_string();
                    println!("Error on equery execute: {e:?}")
                }
            }
        } else {
            _msg = "codigo incorrecto".to_string();
        }
    } else {
        _msg = "no se encontró el usuario".to_string();
    }
    Ok(_msg)
}

pub fn admin_login(db: &Connection, email: &str, password: &str) -> Result<String, String> {
    let mut _msg: String = String::new();
    let sql = format!("SELECT * FROM admins WHERE email = '{}'", email);
    let mut prp = db.prepare(&sql).expect("error preparing query");
    let admin: Option<Admin> = prp
        .query_row([], |row| {
            Ok(Admin {
                admin_id: row.get(0).unwrap(),
                username: row.get(1).unwrap(),
                upassword: row.get(2).unwrap(),
                email: row.get(3).unwrap(),
                token: row.get(4).unwrap(),
                confirmed: row.get(5).unwrap(),
            })
        })
        .optional()
        .unwrap();
    if let Some(admin) = admin {
        if admin.confirmed == Some(1) {
            let upass = admin.upassword.unwrap();
            println!("pass-->{}", upass);
            let parsed_hash = match PasswordHash::new(&upass.as_str()) {
                Ok(p) => p,
                Err(e) => panic!("{}", e),
            };
            match Argon2::default().verify_password(password.as_bytes(), &parsed_hash) {
                Ok(_) => _msg = "login succesful".to_string(),
                Err(e) => {
                    println!("Error on pass: {e:?}");
                    return Err("400-Contraseña incorrecta".to_string());
                }
            };
            let uid = LoggedId {
                admin_id: admin.admin_id.unwrap(),
            };
            let res = match generate_jwt(uid) {
                Ok(r) => serde_json::to_string(&r).unwrap(),
                Err(e) => return Err(format!("400-Error with jwt: {e:?}")),
            };
            Ok(res)
        } else {
            Err("401-cuenta no confirmada".into())
        }
    } else {
        Err("400-Cuenta no encontrada".into())
    }
}

pub fn admin_resend(db: &Connection, email: &str) -> Result<String, String> {
    let mut _msg: String = String::new();
    let sql = format!("SELECT * FROM admins WHERE email = '{}'", email);
    let mut prp = db.prepare(&sql).expect("error preparing query");
    let admin: Option<Admin> = prp
        .query_row([], |row| {
            Ok(Admin {
                admin_id: row.get(0).unwrap(),
                username: row.get(1).unwrap(),
                upassword: row.get(2).unwrap(),
                email: row.get(3).unwrap(),
                token: row.get(4).unwrap(),
                confirmed: row.get(5).unwrap(),
            })
        })
        .optional()
        .unwrap();
    if let Some(admin) = admin {
        let aid = admin.admin_id.unwrap();
        let token: String = new_token();
        let nsql: String = format!(
            "UPDATE admins SET token = @token WHERE admin_id = '{}'",
            aid
        );
        let mut upstmnt = db.prepare(&nsql).expect("error preparing query");
        match upstmnt.execute(named_params! { "@token":token }) {
            Ok(_) => _msg = "passed".to_string(),
            Err(e) => {
                _msg = "Error durante la confirmación".to_string();
                println!("Error on equery execute: {e:?}")
            }
        }
        let email_body = format!("Su codigo de confirmación es este: {} \nSi esta cuenta no es tuya, solo ignora este correo", token);
        match send_email(
            &email_body,
            &email,
            &admin.username.unwrap(),
            "Confirmar cuenta",
        ) {
            Ok(_) => _msg = "passed".to_string(),
            Err(e) => {
                _msg = "Error al enviar correo de confirmacion".to_string();
                println!("Error sending email: {e:?}")
            }
        }
    } else {
        return Err("cuenta no encontrada".into());
    }
    Ok(_msg)
}

pub fn admin_profile(db: &Connection, jwt: &str) -> Result<serde_json::Value, String> {
    let verify: Result<jwt_simple::prelude::JWTClaims<LoggedId>, jwt_simple::Error> =
        verify_jwt(jwt);
    let getid = match verify {
        Ok(ver) => ver.custom.admin_id,
        Err(e) => {
            println!("Error with jwt: {e:?}");
            return Err(format!("400-Error con el JWT: {e:?}"));
        }
    };
    let sql = format!("SELECT * FROM admins WHERE admin_id = '{}'", getid);
    let mut prp = db.prepare(&sql).expect("error preparing query");
    let admin: Option<Admin> = prp
        .query_row([], |row| {
            Ok(Admin {
                admin_id: row.get(0).unwrap(),
                username: row.get(1).unwrap(),
                upassword: row.get(2).unwrap(),
                email: row.get(3).unwrap(),
                token: row.get(4).unwrap(),
                confirmed: row.get(5).unwrap(),
            })
        })
        .optional()
        .unwrap();
    if let Some(admin) = admin {
        let res = json!({
            "admin_id": admin.admin_id,
            "username": admin.username,
            "email": admin.email
        });
        //let serialized = serde_json::to_string(&res).unwrap();
        Ok(res)
    } else {
        Err("404-Error al obtener el usuario".to_string())
    }
}

pub fn admin_change_pass(conn: &Connection, uid: &str, password: &str) -> Result<String, String> {
    let mut _msg: String = String::new();
    let sql = format!("SELECT * FROM admins WHERE admin_id = '{}'", uid);
    let mut prp = conn.prepare(&sql).expect("error preparing query");
    if prp.exists([]).unwrap() == false {
        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();
        let password_hash = argon2
            .hash_password(password.as_bytes(), &salt)
            .expect("error")
            .to_string();
        let mut upstmnt = conn
            .prepare("UPDATE admins SET token = NULL, upassword = :pass WHERE admin_id = :id")
            .expect("error preparing query");
        match upstmnt.execute(named_params! {":pass": password_hash, ":id": uid }) {
            Ok(_) => _msg = "Contraseña cambiada con exito.".to_string(),
            Err(e) => {
                println!("Error updating to new password: {e:?}");
                return Err(format!("400-Error al intentar asignar nueva contraseña: {e:?}"));
            }
        }
    } else {
        return Err("400-No se encontró el usuario".to_string());
    }
    Ok(_msg)
}

pub fn add_item(db: &Connection, table: &str, values: &str) -> Result<(), rusqlite::Error> {
    let mut statement = db.prepare("INSERT INTO @table (values) VALUES (@values)")?;
    statement.execute(named_params! { "@table": table, "@values": values })?;

    Ok(())
}

pub fn get_all(
    conn: &Connection,
    table_name: &str,
) -> Result<Vec<HashMap<String, Value>>, rusqlite::Error> {
    // Get column names and data types
    let mut stmt = conn.prepare(&format!("PRAGMA table_info({})", table_name))?;
    let rows = stmt.query_map([], |row| Ok((row.get(1)?, row.get(2)?)))?;

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

pub fn get_by(
    conn: &Connection,
    table_name: &str,
    column_label: &str,
    val: &str,
) -> Result<Vec<HashMap<String, Value>>, rusqlite::Error> {
    // Get column names and data types
    let mut stmt = conn.prepare(&format!("PRAGMA table_info({})", table_name))?;
    let rows = stmt.query_map([], |row| Ok((row.get(1)?, row.get(2)?)))?;

    // Construct SQL query
    let mut query = format!(
        "SELECT * FROM {} WHERE {} = {}",
        table_name, column_label, val
    );
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
