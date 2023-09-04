use rocket::{http::Status, serde::json::Json};
use rocket_okapi::openapi;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use crate::{bell::Bell, timetable::json::School, TIMETABLE_PATH};

/// Represents a PATCH request to update a bell in the timetable.
#[derive(Deserialize, Serialize, Debug, Clone, JsonSchema)]
pub struct Patch(pub Bell);

/// Update a bell in the timetable.
///
/// # Status Codes
///
/// - 200: The bell was successfully updated.
/// - 400: The bell ID was not found.
/// - 404: The timetable file was not found.
/// - 500: The timetable file could not be saved.
#[openapi(tag = "timetable")]
#[patch("/timetable", data = "<new>")]
pub fn patch_timetable(new: Json<Patch>) -> Status {
    let Ok(mut timetable) = School::from_path(TIMETABLE_PATH) else {
        return Status::NotFound;
    };
    let new = new.0 .0;
    match timetable
        .bell_times
        .iter_mut()
        .flatten()
        .find(|period| period.bell.id == new.id)
    {
        Some(day) => {
            day.bell = new;
        }
        None => return Status::BadRequest,
    }
    if timetable.save_to_path(TIMETABLE_PATH).is_err() {
        return Status::InternalServerError;
    };
    Status::Ok
}
