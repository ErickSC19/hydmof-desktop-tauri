use serde::{Serialize, Deserialize};
use rusqlite::{Row};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub admin_id: Option<String>,
    pub username: Option<String>,
    pub email: String,
    pub upassword: String,
    pub token: Option<String>,
    pub confirmed: Option<i8>
}

impl<'a> From<Row<'a>> for User {
    fn from(row: Row<'a>) -> Self {
        Self {
            admin_id: row.get(0).unwrap(),
            username: row.get(1).unwrap(),
            email: row.get(2).unwrap(),
            upassword: row.get(3).unwrap(),
            token: row.get(4).unwrap(),
            confirmed: row.get(5).unwrap(),
        }
    }
}

