#![warn(
    clippy::pedantic,
    clippy::nursery,
    clippy::dbg_macro,
    clippy::unwrap_used,
    clippy::expect_used
)]
#![allow(clippy::no_effect_underscore_binding)]
#![feature(iter_next_chunk, slice_take)]
mod bell;
mod methods;
mod timetable;

use anyhow::{anyhow, Result};
use methods::patch::Patch;
use rand::seq::SliceRandom;
use rocket::{
    fs::FileServer,
    http::{ContentType, Status},
    serde::json::Json,
    Request,
};
use rocket_okapi::{
    openapi, openapi_get_routes,
    swagger_ui::{make_swagger_ui, SwaggerUIConfig}
};
use serde_json::to_string;
use std::fs::write;
use timetable::json::{Period, Timetable};
use uuid::Uuid;

use crate::methods::post::Post;

#[macro_use]
extern crate rocket;

const ERROR_MESSAGES: &[&str] = &[
    "At least this is better than the default error page.",
    "You're lost in the woods now.",
    "Uh oh, you're not supposed to be here.",
    "This is not the page you're looking for.",
    "This is awkward.",
];
const PATH: &str = "static/timetable";

#[catch(default)]
fn catch_default(status: Status, _request: &Request) -> String {
    format!(
        "{}
({})",
        ERROR_MESSAGES
            .choose(&mut rand::thread_rng())
            .unwrap_or(&"We couldn't even load an error message for this error page."),
        status
    )
}

/// Get the timetable.
///
/// # Status Codes
///
/// - 200: The timetable was successfully retrieved.
/// - 404: The timetable file was not found.
/// - 500: The timetable file could not be read or serialised.
#[openapi(tag = "timetable")]
#[get("/timetable")]
fn get() -> (Status, (ContentType, String)) {
    let Ok(timetable) = Timetable::from_path(PATH) else {
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
fn post(new: Json<Post>) -> Status {
    let Ok(mut timetable) = Timetable::from_path(PATH) else {
        return Status::NotFound;
    };
    let new = new.0;
    if timetable
        .timetable
        .iter()
        .flatten()
        .any(|period| period.bell.id == new.bell.id)
    {
        return Status::BadRequest;
    }
    let day = timetable.timetable.get_mut(new.day);
    if let Some(day) = day {
        day.push(Period::new(new.bell));
    } else {
        return Status::BadRequest;
    }
    if timetable.save_to_path(PATH).is_err() {
        return Status::InternalServerError;
    };
    Status::Ok
}

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
fn patch(new: Json<Patch>) -> Status {
    let Ok(mut timetable) = Timetable::from_path(PATH) else {
        return Status::NotFound;
    };
    let new = new.0 .0;
    match timetable
        .timetable
        .iter_mut()
        .flatten()
        .find(|period| period.bell.id == new.id)
    {
        Some(day) => {
            day.bell = new;
        }
        None => return Status::BadRequest,
    }
    if timetable.save_to_path(PATH).is_err() {
        return Status::InternalServerError;
    };
    Status::Ok
}

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
fn delete(id: &str) -> Status {
    let Ok(mut timetable) = Timetable::from_path(PATH) else {
        return Status::NotFound;
    };
    let Ok(id) = Uuid::try_parse(id) else {
        return Status::BadRequest;
    };
    match timetable.timetable.iter_mut().find_map(|day| {
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
    if timetable.save_to_path(PATH).is_err() {
        return Status::InternalServerError;
    };
    Status::Ok
}

#[main]
async fn main() -> Result<()> {
    if Timetable::from_path(PATH).is_err() {
        if let Err(error) = write(PATH, to_string(&Timetable::default())?) {
            return Err(anyhow!("Failed to create timetable file: {}", error));
        }
    }
    let mut rocket = rocket::build()
        .mount("/app/", FileServer::from("dist"))
        .mount("/api/v1/", openapi_get_routes![get, post, patch, delete])
        .register("/", catchers![catch_default]);
    if cfg!(debug_assertions) {
        rocket = rocket.mount(
            "/swagger",
            make_swagger_ui(&SwaggerUIConfig {
                url: "/api/v1/openapi.json".to_string(),
                ..Default::default()
            }),
        );
    }

    rocket.launch().await?;
    Ok(())
}
