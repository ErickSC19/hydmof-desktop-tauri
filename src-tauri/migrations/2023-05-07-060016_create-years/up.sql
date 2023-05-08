-- Your SQL goes here
CREATE TABLE IF NOT EXISTS years
    (
        year_id                      INTEGER PRIMARY KEY AUTOINCREMENT,
        from_date                    DATETIME NOT NULL DEFAULT (datetime('now','localtime')),
        to_date                      DATETIME NOT NULL DEFAULT (datetime('now','localtime')),
        complete                     BOOLEAN NOT NULL DEFAULT 0,
        months                       INTEGER NOT NULL,
        employees                    INTEGER NOT NULL,
        created_at                   DATETIME DEFAULT (datetime('now','localtime')),
        updated_at                   DATETIME DEFAULT (datetime('now','localtime')),
        admin_id                     INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY (admin_id)       REFERENCES admins (admin_id) ON UPDATE SET NULL ON DELETE SET NULL
    );