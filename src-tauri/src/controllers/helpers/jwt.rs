use jwt_simple::{prelude::*, Error};
use dotenv::dotenv;
// create a new key for the `HS256` JWT algorithm

#[derive(Serialize, Deserialize)]
pub struct LoggedId {
    pub admin_id: String,
}

pub fn generate_jwt(id: LoggedId) ->  Result<String, Error>{
    dotenv().ok(); 
    let s= std::env::var("SECRET").unwrap();
    let key = HS256Key::from_bytes(s.to_owned().as_bytes());
    let claims: JWTClaims<LoggedId> = Claims::with_custom_claims(id, Duration::from_days(7));
    let token: Result<String, jwt_simple::Error> = key.authenticate(claims);
    token
}

pub fn verify_jwt(jwt: &str) -> Result<JWTClaims<LoggedId>, Error>{
    dotenv().ok(); 
    let s= std::env::var("SECRET").unwrap();
    let key = HS256Key::from_bytes(s.to_owned().as_bytes());
    let claims: Result<JWTClaims<LoggedId>, jwt_simple::Error>  = key.verify_token::<LoggedId>(&jwt, None);
    claims
}