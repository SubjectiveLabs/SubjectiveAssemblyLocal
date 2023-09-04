use rocket::http::{Status, ContentType};
use rocket_okapi::openapi;
use serde_json::to_string;

use crate::{config::json::Config, CONFIG_PATH};

/// Get the configuration.
///
/// # Status Codes
///
/// - 200: The configuration was successfully retrieved.
/// - 404: The configuration file was not found.
/// - 500: The configuration file could not be read or serialised.
#[openapi(tag = "config")]
#[get("/config")]
pub fn get_config() -> (Status, (ContentType, String)) {
    let Ok(config) = Config::from_path(CONFIG_PATH) else {
        return (Status::NotFound, (ContentType::Any, String::new()));
    };
    to_string(&config).map_or(
        (
            Status::InternalServerError,
            (ContentType::Any, String::new()),
        ),
        |timetable| (Status::Ok, (ContentType::JSON, timetable)),
    )
}
