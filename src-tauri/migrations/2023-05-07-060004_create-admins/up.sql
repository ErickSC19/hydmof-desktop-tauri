-- Your SQL goes here
CREATE TABLE IF NOT EXISTS admins
    (
        admin_id                INTEGER PRIMARY KEY AUTOINCREMENT,
        username                TEXT                NOT NULL,
        pass                    TEXT                NOT NULL,
        email                   TEXT                NOT NULL,
        token                   TEXT                DEFAULT NULL,
        confirmed               BOOLEAN             NOT NULL DEFAULT 0
    );