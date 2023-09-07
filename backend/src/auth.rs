use std::fs::{read_to_string, write};

use bcrypt::verify;
use rocket::{
    http::Status,
    request::{FromRequest, Outcome},
    Request,
};
use rocket_okapi::{openapi, OpenApiFromRequest};

use crate::PASSWORD_PATH;

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
    fn eq(&self, other: &Password) -> bool { *self == other.0 }
}

impl AsRef<[u8]> for Password {
    fn as_ref(&self) -> &[u8] { self.0.as_bytes() }
}

#[openapi]
#[put("/password", data = "<new>")]
pub fn put_password(old: Password, new: &str) -> Status {
    fn put_password(new: &str) -> Status {
        if write(PASSWORD_PATH, new).is_err() {
            return Status::InternalServerError;
        }
        Status::Ok
    }
    match read_to_string(PASSWORD_PATH) {
        Ok(stored) if matches!(verify(old, &stored), Ok(true)) => put_password(new),
        Err(_) => put_password(new),
        Ok(_) => Status::Unauthorized,
    }
}

#[openapi]
#[get("/password")]
pub fn get_password(password: Password) -> String {
    let exists = read_to_string(PASSWORD_PATH).is_ok();
    let correct = match read_to_string(PASSWORD_PATH) {
        Ok(stored) if matches!(verify(password, &stored), Ok(true)) => true,
        Err(_) | Ok(_) => false,
    };
    format!(
        "{}{}",
        if exists { "1" } else { "0" },
        if correct { "1" } else { "0" }
    )
}
