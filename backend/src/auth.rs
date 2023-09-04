use std::{
    convert::Infallible,
    fs::{read_to_string, write},
};

use rocket::{
    http::Status,
    request::{FromRequest, Outcome},
    serde::json::Json,
    Request,
};
use rocket_okapi::{openapi, OpenApiFromRequest};
use schemars::JsonSchema;
use serde::Deserialize;

use crate::PASSWORD_PATH;

#[openapi(tag = "authentication")]
#[get("/auth/password")]
pub fn get_password() -> String {
    match read_to_string(PASSWORD_PATH) {
        Ok(_) => "\0".to_string(),
        Err(_) => String::new(),
    }
}

#[derive(OpenApiFromRequest)]
pub struct Password(pub String);

#[derive(Debug)]
pub struct NoPasswordGiven;

#[rocket::async_trait]
impl<'r> FromRequest<'r> for Password {
    type Error = NoPasswordGiven;

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        request.headers().get_one("X-Assembly-Password").map_or(
            Outcome::Failure((Status::Unauthorized, NoPasswordGiven)),
            |password| Outcome::Success(Self(password.to_string())),
        )
    }
}

impl PartialEq<Password> for String {
    fn eq(&self, other: &Password) -> bool {
        *self == other.0
    }
}

#[openapi(tag = "authentication")]
#[put("/auth/password", data = "<new>")]
#[allow(clippy::ignored_unit_patterns, clippy::needless_pass_by_value)]
pub fn put_password(old: Password, new: &str) -> Status {
    fn put_password(new: &str) -> Status {
        if write(PASSWORD_PATH, new).is_err() {
            return Status::InternalServerError;
        }
        Status::Ok
    }
    match read_to_string(PASSWORD_PATH) {
        Ok(stored) if stored == old => put_password(new),
        Err(_) => put_password(new),
        Ok(_) => Status::Unauthorized,
    }
}
