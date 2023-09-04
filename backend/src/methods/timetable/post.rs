use rocket::{http::Status, serde::json::Json};
use rocket_okapi::openapi;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use crate::{
    bell::Bell,
    timetable::json::{Period, School},
    TIMETABLE_PATH,
};

/// Represents a POST request to add a bell to the timetable.
#[derive(Deserialize, Serialize, Debug, Clone, JsonSchema)]
pub struct Post {
    pub bell: Bell,
    pub day: usize,
}

/// Add a bell to the timetable.
///
/// # Status Codes
///
/// - 200: The bell was successfully added.
/// - 400: The day was not found or the new bell's ID was already taken.
/// - 404: The timetable file was not found.
/// - 500: The timetable file could not be saved.
#[openapi(tag = "timetable")]
#[post("/timetable", data = "<new>")]
pub fn post_timetable(new: Json<Post>) -> Status {
    let Ok(mut timetable) = School::from_path(TIMETABLE_PATH) else {
        return Status::NotFound;
    };
    let new = new.0;
    if timetable
        .bell_times
        .iter()
        .flatten()
        .any(|period| period.bell.id == new.bell.id)
    {
        return Status::BadRequest;
    }
    let day = timetable.bell_times.get_mut(new.day);
    if let Some(day) = day {
        day.push(Period::new(new.bell));
    } else {
        return Status::BadRequest;
    }
    if timetable.save_to_path(TIMETABLE_PATH).is_err() {
        return Status::InternalServerError;
    };
    Status::Ok
}
