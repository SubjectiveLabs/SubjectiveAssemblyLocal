use std::fs::{read_to_string, write};

use rocket::http::Status;
use rocket_okapi::openapi;

use crate::THANKS_PATH;

#[openapi]
#[post("/thanks")]
pub fn post_thanks() -> Status {
    read_to_string(THANKS_PATH).map_or(Status::InternalServerError, |thanks| {
        match write(
            THANKS_PATH,
            (thanks.parse::<u128>().unwrap_or(0) + 1).to_string(),
        ) {
            Ok(_) => Status::Ok,
            Err(_) => Status::InternalServerError,
        }
    })
}

#[openapi]
#[get("/thanks")]
pub fn get_thanks() -> (Status, String) {
    read_to_string(THANKS_PATH).map_or_else(
        |_| (Status::InternalServerError, String::new()),
        |thanks| (Status::Ok, thanks),
    )
}
