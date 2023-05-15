use lettre::message::header::ContentType;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};
use dotenv::dotenv;
use tracing_subscriber;

pub fn send_email(email_content: &str, receiver: &str, name: &str, subject: &str) {
    dotenv().ok(); 
    tracing_subscriber::fmt::init();
    let tosend = format!("{} <{}>", name, receiver);
    let email = Message::builder()
        .from("Hydromotors".parse().unwrap())
        .to(tosend.parse().unwrap())
        .subject(subject)
        .header(ContentType::TEXT_PLAIN)
        .body(String::from(email_content))
        .unwrap();

    let creds = Credentials::new(std::env::var("EMAIL_USER").unwrap().to_owned(), std::env::var("EMAIL_PASS").unwrap().to_owned());
    
    // Open a remote connection to gmail
    let mailer = SmtpTransport::relay(&std::env::var("EMAIL_HOST").unwrap())
        .unwrap()
        .credentials(creds)
        .build();

    // Send the email
    match mailer.send(&email) {
        Ok(_) => println!("Email sent successfully!"),
        Err(e) => panic!("Could not send email: {e:?}"),
    }
}
