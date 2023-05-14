use rusqlite::{Connection, named_params};
use tauri::AppHandle;
use std::fs;

const CURRENT_DB_VERSION: u32 = 1;

/// Initializes the database connection, creating the .sqlite file if needed, and upgrading the database
/// if it's out of date.
pub fn initialize_database(app_handle: &AppHandle) -> Result<Connection, rusqlite::Error> {
    let app_dir = app_handle.path_resolver().app_data_dir().expect("The app data directory should exist.");
    fs::create_dir_all(&app_dir).expect("The app data directory should be created.");
    let sqlite_path = app_dir.join("MyApp.sqlite");

    let mut db = Connection::open(sqlite_path)?;

    let mut user_pragma = db.prepare("PRAGMA user_version")?;
    let existing_user_version: u32 = user_pragma.query_row([], |row| { Ok(row.get(0)?) })?;
    drop(user_pragma);

    upgrade_database_if_needed(&mut db, existing_user_version)?;

    Ok(db)
}

/// Upgrades the database to the current version.
pub fn upgrade_database_if_needed(db: &mut Connection, existing_version: u32) -> Result<(), rusqlite::Error> {
  if existing_version < CURRENT_DB_VERSION {
    db.pragma_update(None, "journal_mode", "WAL")?;

    let tx = db.transaction()?;

    tx.pragma_update(None, "user_version", CURRENT_DB_VERSION)?;

    tx.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS admins
            (
                admin_id                TEXT PRIMARY KEY NOT NULL,
                username                TEXT                NOT NULL,
                upassword               TEXT                NOT NULL,
                email                   TEXT                NOT NULL,
                token                   TEXT                        ,
                confirmed               BOOLEAN             NOT NULL DEFAULT 0
            );    
        CREATE TABLE IF NOT EXISTS years
            (
                year_id                      TEXT PRIMARY KEY NOT NULL,
                fromDate                     DATETIME NOT NULL DEFAULT (datetime('now','localtime')),
                toDate                       DATETIME NOT NULL DEFAULT (datetime('now','localtime')),
                complete                     BOOLEAN  NOT NULL DEFAULT 0,
                months                       INTEGER NOT NULL,
                employees                    INTEGER NOT NULL,
                createdAt                    DATETIME DEFAULT (datetime('now','localtime')),
                updatedAt                    DATETIME DEFAULT (datetime('now','localtime')),
                adminId                      INTEGER  NOT NULL DEFAULT 1,
                FOREIGN KEY (admin_d)        REFERENCES admins (admin_id) ON UPDATE SET NULL ON DELETE SET NULL
            );"
    )?;

    tx.commit()?;
  }

  Ok(())
}

pub fn add_item(table: &str, values: &str, db: &Connection) -> Result<(), rusqlite::Error> {
    let mut statement = db.prepare("INSERT INTO @table (values) VALUES (@values)")?;
    statement.execute(named_params! { "@table": table, "@values": values })?;

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


