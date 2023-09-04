use rocket::http::{ContentType, Status};
use rocket_okapi::openapi;
use serde_json::to_string;

use crate::{timetable::json::School, TIMETABLE_PATH};

/// Get the timetable.
///
/// # Status Codes
///
/// - 200: The timetable was successfully retrieved.
/// - 404: The timetable file was not found.
/// - 500: The timetable file could not be read or serialised.
#[openapi(tag = "timetable")]
#[get("/timetable")]
pub fn get_timetable() -> (Status, (ContentType, String)) {
    let Ok(timetable) = School::from_path(TIMETABLE_PATH) else {
        return (Status::NotFound, (ContentType::Any, String::new()));
    };
    to_string(&timetable).map_or(
        (
            Status::InternalServerError,
            (ContentType::Any, String::new()),
        ),
        |timetable| (Status::Ok, (ContentType::JSON, timetable)),
    )
}
