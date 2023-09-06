use rocket::http::{ContentType, Status};
use rocket_okapi::openapi;
use serde_json::to_string;

use crate::{school::json::School, SCHOOL_PATH};

#[openapi]
#[get("/school")]
pub fn get_school() -> (Status, (ContentType, String)) {
    let Ok(school) = School::from_path(SCHOOL_PATH) else {
        return (Status::NotFound, (ContentType::Any, String::new()));
    };
    to_string(&school).map_or(
        (
            Status::InternalServerError,
            (ContentType::Any, String::new()),
        ),
        |school| (Status::Ok, (ContentType::JSON, school)),
    )
}
