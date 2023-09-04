use rocket::http::Status;
use rocket_okapi::openapi;
use uuid::Uuid;

use crate::{timetable::json::School, TIMETABLE_PATH};

/// Delete a bell from the timetable.
///
/// # Status Codes
///
/// - 200: The bell was successfully deleted.
/// - 400: The bell ID was not found.
/// - 404: The timetable file was not found.
/// - 500: The timetable file could not be saved.
#[openapi(tag = "timetable")]
#[delete("/timetable", data = "<id>")]
pub fn delete_timetable(id: &str) -> Status {
    let Ok(mut timetable) = School::from_path(TIMETABLE_PATH) else {
        return Status::NotFound;
    };
    let Ok(id) = Uuid::try_parse(id) else {
        return Status::BadRequest;
    };
    match timetable.bell_times.iter_mut().find_map(|day| {
        day.iter_mut()
            .enumerate()
            .find_map(|(index, period)| {
                if period.bell.id == id {
                    Some(index)
                } else {
                    None
                }
            })
            .map(|index| (index, day))
    }) {
        Some((period_index, day)) => {
            day.remove(period_index);
        }
        None => return Status::BadRequest,
    }
    if timetable.save_to_path(TIMETABLE_PATH).is_err() {
        return Status::InternalServerError;
    };
    Status::Ok
}
