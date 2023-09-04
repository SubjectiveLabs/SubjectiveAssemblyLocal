use rocket::{http::Status, serde::json::Json};
use rocket_okapi::openapi;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use crate::{
    config::json::Config,
    CONFIG_PATH,
};

/// Represents a PUT request to update a configuration.
#[derive(Deserialize, Serialize, Debug, Clone, JsonSchema)]
pub struct Put(Config);

/// Update a configuration.
///
/// # Status Codes
///
/// - 200: The configuration was successfully updated.
/// - 500: The configuration could not be saved.
#[openapi(tag = "timetable")]
#[put("/timetable", data = "<new>")]
#[allow(clippy::needless_pass_by_value)]
pub fn put_config(new: Json<Put>) -> Status {
    if new.0 .0.save_to_path(CONFIG_PATH).is_err() {
        return Status::InternalServerError;
    }
    Status::Ok
}
