use serde::{Serialize, Deserialize};
use rusqlite::{Row};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    #[serde(rename = "userId")]
    user_id: Option<String>,
    username: Option<String>,
    email: String,
    upassword: String,
    token: Option<String>,
    confirmed: Option<bool>
}

impl From<&Row<'_>> for User {
    fn from(row: &Row) -> Self {
        Self {
            user_id: row.get(0).unwrap(),
            username: row.get(1).unwrap(),
            email: row.get(2).unwrap(),
            upassword: row.get(3).unwrap(),
            token: row.get(4).unwrap(),
            confirmed: row.get(5).unwrap(),
        }
    }
}
