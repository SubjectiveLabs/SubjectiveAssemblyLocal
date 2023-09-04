use std::fs::read_to_string;

use bcrypt::verify;
use rocket::{http::Status, serde::json::Json};
use rocket_okapi::openapi;

use crate::{auth::Password, school::json::School, PASSWORD_PATH, SCHOOL_PATH};

#[openapi]
#[put("/school", data = "<new>")]
pub fn put_school(new: Json<School>, password: Password) -> Status {
    match read_to_string(PASSWORD_PATH) {
        Ok(stored) if !matches!(verify(password, &stored), Ok(true)) => return Status::Unauthorized,
        Err(_) => return Status::Unauthorized,
        Ok(_) => {}
    }
    if new.0.save_to_path(SCHOOL_PATH).is_err() {
        return Status::InternalServerError;
    };
    Status::Ok
}
