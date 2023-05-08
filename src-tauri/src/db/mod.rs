extern crate dotenv;

pub mod models;
use crate::schema::*;
use diesel::prelude::*;
use dotenv::dotenv;
use models::{NewAdmin, Admin};
use std::env;

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

pub fn admins_create(conn: &mut SqliteConnection, username: &str, email: &str, pass: &str, token: Option<&str>) -> String {
    let new_admin = NewAdmin { username, email, pass, token };
    let admin = diesel::insert_into(admins::table)
        .values(&new_admin)
        .execute(conn)
        .expect("Error saving new post");
    let admin_json  =serde_json::to_string(&admin).unwrap();
    admin_json.into()
}

pub fn admins_list(conn: &mut SqliteConnection) -> String {
    let all_admins = admins::dsl::admins
        .load::<Admin>(conn)
        .expect("Expect loading posts");
    let serialized = serde_json::to_string(&all_admins).unwrap();
    serialized
}

pub fn admins_toggle(conn: &mut SqliteConnection, qid: i32) -> String {
    use admins::dsl::{confirmed, admin_id};
    let t = admins::dsl::admins
        .filter(admin_id.eq(&qid))
        .limit(1)
        .load::<Admin>(conn)
        .expect("Admin not found");
    diesel::update(admins::dsl::admins.filter(admin_id.eq(&qid)))
        .set(confirmed.eq(!t[0].confirmed))
        .execute(conn)
        .expect("Error updating");
    let updated = admins::dsl::admins
        .filter(admin_id.eq(&qid))
        .first::<Admin>(conn)
        .expect("Admin not found");
    serde_json::to_string(&updated).unwrap()
}

pub fn admins_delete(conn: &mut SqliteConnection, qid: i32) {
    use admins::dsl::{ admin_id };
    let t = admins::dsl::admins.filter(admin_id.eq(&qid));
    diesel::delete(t)
        .execute(conn)
        .expect("error deleting todo");
}