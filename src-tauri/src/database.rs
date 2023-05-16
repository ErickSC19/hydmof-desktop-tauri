use rusqlite::{Connection};
use tauri::AppHandle;
use std::fs;

const CURRENT_DB_VERSION: u32 = 1;

/// Initializes the database connection, creating the .sqlite file if needed, and upgrading the database
/// if it's out of date.
pub fn initialize_database(app_handle: &AppHandle) -> Result<Connection, rusqlite::Error> {
    let app_dir = app_handle.path_resolver().app_data_dir().expect("The app data directory should exist.");
    fs::create_dir_all(&app_dir).expect("The app data directory should be created.");
    let sqlite_path = app_dir.join("finData.sqlite");

    let mut db = Connection::open(sqlite_path)?;

    let mut user_pragma = db.prepare("PRAGMA user_version")?;
    let existing_user_version: u32 = user_pragma.query_row([], |row| { Ok(row.get(0)?) })?;
    drop(user_pragma);

    upgrade_database_if_needed(&mut db, existing_user_version)?;
    println!("---> successful connection");
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
                admin_id                TEXT   PRIMARY KEY  NOT NULL,
                username                TEXT                NOT NULL,
                upassword               TEXT                NOT NULL,
                email                   TEXT                NOT NULL,
                token                   TEXT                        ,
                confirmed               INTEGER             NOT NULL DEFAULT 0 
                                                                CHECK (confirmed == 0 OR confirmed == 1)
            );    
        CREATE TABLE IF NOT EXISTS years
            (
                year_id                      TEXT     PRIMARY KEY NOT NULL,
                fromDate                     TEXT NOT NULL DEFAULT ('2023-01-01 10:20:05.123'),
                toDate                       TEXT NOT NULL DEFAULT ('2023-01-01 10:20:05.123'),
                complete                     INTEGER  NOT NULL DEFAULT 0 CHECK (complete == 0 OR complete == 1),
                months                       INTEGER  NOT NULL DEFAULT 0,
                employees                    INTEGER  NOT NULL DEFAULT 0,
                created_at                   TEXT NOT NULL DEFAULT ('2023-01-01 10:20:05.123'),
                updated_at                   TEXT NOT NULL DEFAULT ('2023-01-01 10:20:05.123'),
                admin_id                     TEXT NOT NULL,
                FOREIGN KEY (admin_id)       REFERENCES admins (admin_id) ON UPDATE CASCADE ON DELETE SET NULL
            );
        CREATE TABLE IF NOT EXISTS year_data
            (
                ydata_id                     TEXT PRIMARY KEY NOT NULL,
                description                  TEXT NOT NULL,
                value                        REAL NOT NULL DEFAULT 0.0,
                category                     INTEGER NOT NULL,
                linked                       TEXT DEFAULT ('false'),
                created_at                   TEXT NOT NULL DEFAULT ('2023-01-01 10:20:05.123'),
                updated_at                   TEXT NOT NULL DEFAULT ('2023-01-01 10:20:05.123'),
                year_id                      TEXT NOT NULL,
                FOREIGN KEY (year_id)        REFERENCES years (year_id) ON UPDATE CASCADE ON DELETE SET NULL
            );
        CREATE TABLE IF NOT EXISTS month_data
            (
                mdata_id                     TEXT PRIMARY KEY NOT NULL,
                value                        REAL NOT NULL,
                month                        INTEGER NOT NULL,
                category                     INTEGER NOT NULL,
                created_at                   TEXT DEFAULT ('2023-01-01 10:20:05.123'),
                updated_at                   TEXT DEFAULT ('2023-01-01 10:20:05.123'),
                exp_id                       TEXT NOT NULL,
                year_id                      TEXT NOT NULL,
                FOREIGN KEY (year_id)        REFERENCES years (year_id) ON UPDATE CASCADE ON DELETE SET NULL,
                FOREIGN KEY (exp_id)         REFERENCES exp_data (exp_id) ON UPDATE CASCADE ON DELETE SET NULL
            );
            CREATE TABLE IF NOT EXISTS month_data_totals
            (
                totals_id                    TEXT PRIMARY KEY NOT NULL,
                total_sum                    REAL NOT NULL,
                total_mean                   REAL NOT NULL,
                created_at                   TEXT DEFAULT ('2023-01-01 10:20:05.123'),
                updated_at                   TEXT DEFAULT ('2023-01-01 10:20:05.123'),
                exp_id                       TEXT NOT NULL,
                year_id                      TEXT NOT NULL,
                FOREIGN KEY (year_id)        REFERENCES years (year_id) ON UPDATE CASCADE ON DELETE SET NULL,
                FOREIGN KEY (exp_id)         REFERENCES exp_data (exp_id) ON UPDATE CASCADE ON DELETE SET NULL
            );
        CREATE TABLE IF NOT EXISTS exp_data
            (
                exp_id                       TEXT PRIMARY KEY NOT NULL,
                description                  TEXT NOT NULL,
                value                        TEXT NOT NULL,
                created_at                   TEXT NOT NULL DEFAULT ('2023-01-01 10:20:05.123'),
                updated_at                   TEXT NOT NULL DEFAULT ('2023-01-01 10:20:05.123'),
                admin_id                     TEXT NOT NULL,
                FOREIGN KEY (admin_id)       REFERENCES admins (admin_id) ON UPDATE CASCADE ON DELETE SET NULL
            );
            "
    )?;

    tx.commit()?;
  }

  Ok(())
}