
use std::time::Duration;

use lettre::message::{Mailbox};
use lettre::message::header::ContentType;
use lettre::transport::smtp::{PoolConfig, Error};
use lettre::transport::smtp::response::Response;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};
use dotenv::dotenv;
use tracing_subscriber;

pub fn send_email(email_content: &str, receiver: &str, name: &str, subject: &str) -> Result<Response, Error> {
    dotenv().ok(); 
    let em_user = std::env::var("EMAIL_USER").unwrap().to_owned();
    let em_pass = std::env::var("EMAIL_PASS").unwrap().to_owned();
    let sender_domain = std::env::var("SENDER_DOMAIN").unwrap().to_owned();
    let sender = std::env::var("SENDER").unwrap().to_owned();
    let em_host = std::env::var("EMAIL_HOST").unwrap();

    tracing_subscriber::fmt::init();
    let to_send: Mailbox = match format!("{} <{}>", name, receiver).parse() {
        Ok(r) => r,
        Err(e) => panic!("Could not produce receiver mailbox: {e:?}")
    }; 
    let address: lettre::Address = match lettre::Address::new(sender, sender_domain) {
        Ok(r) => r,
        Err(e) => panic!("Could not produce sender mailbox: {e:?}")
    };
    let from_send = Mailbox::new(None, address);
    let try_email = Message::builder()
        .from(from_send)
        .to(to_send)
        .subject(subject)
        .header(ContentType::TEXT_PLAIN)
        .body(String::from(email_content));

    let email = match try_email {
        Ok(em) => em,
        Err(e) => panic!("Could not format email: {e:?}"),
    };

    let creds = Credentials::new(em_user, em_pass);
    
    // Open a remote connection to gmail
    let mailer = match SmtpTransport::relay(&em_host) {
        Ok(f) => f,
        Err(e) => panic!("Could not produce smtpTransport: {e:?}"),
    };
    let mailer_send =  mailer
                            .credentials(creds)
                            .pool_config(PoolConfig::new().idle_timeout(Duration::from_secs(30))).build();

    // Send the email
    mailer_send.send(&email) 
}
