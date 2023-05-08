use lettre::message::header::ContentType;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};
use dotenv::dotenv;
use tracing_subscriber;

pub fn send_email(email_content: &str) {
    dotenv().ok(); 
    tracing_subscriber::fmt::init();

    let email = Message::builder()
        .from("NoBody <nobody@domain.tld>".parse().unwrap())
        .reply_to("Yuin <yuin@domain.tld>".parse().unwrap())
        .to("Hei <hei@domain.tld>".parse().unwrap())
        .subject("Happy new year")
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
