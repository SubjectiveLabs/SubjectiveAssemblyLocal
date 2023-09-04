#![warn(
    clippy::pedantic,
    clippy::nursery,
    clippy::dbg_macro,
    clippy::unwrap_used,
    clippy::expect_used
)]
#![allow(clippy::no_effect_underscore_binding, clippy::module_name_repetitions)]
#![feature(iter_next_chunk, slice_take)]
mod auth;
mod bell;
mod config;
mod methods;
mod timetable;

use anyhow::{anyhow, Result};
use auth::{
    get_password, okapi_add_operation_for_get_password_, okapi_add_operation_for_put_password_,
    put_password,
};
use methods::{
    config::{
        get::{get_config, okapi_add_operation_for_get_config_},
        put::{okapi_add_operation_for_put_config_, put_config},
    },
    timetable::{
        delete::{delete_timetable, okapi_add_operation_for_delete_timetable_},
        get::{get_timetable, okapi_add_operation_for_get_timetable_},
        patch::{okapi_add_operation_for_patch_timetable_, patch_timetable},
        post::{okapi_add_operation_for_post_timetable_, post_timetable},
    },
};
use rand::seq::SliceRandom;
use rocket::{fs::FileServer, http::Status, Request};
use rocket_okapi::{
    openapi_get_routes,
    swagger_ui::{make_swagger_ui, SwaggerUIConfig},
};
use serde_json::to_string;
use std::fs::write;
use timetable::json::School;
use uuid::Uuid;

#[macro_use]
extern crate rocket;

const ERROR_MESSAGES: &[&str] = &[
    "At least this is better than the default error page.",
    "You're lost in the woods now.",
    "Uh oh, you're not supposed to be here.",
    "This is not the page you're looking for.",
    "This is awkward.",
];
const TIMETABLE_PATH: &str = "static/timetable";
const CONFIG_PATH: &str = "static/config";
const PASSWORD_PATH: &str = "static/password";
const SECRET_PATH: &str = "static/secret";

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

#[main]
async fn main() -> Result<()> {
    if School::from_path(TIMETABLE_PATH).is_err() {
        if let Err(error) = write(TIMETABLE_PATH, to_string(&School::default())?) {
            return Err(anyhow!("Failed to create timetable file: {}", error));
        }
    }
    if let Err(error) = write(SECRET_PATH, Uuid::new_v4()) {
        return Err(anyhow!("Failed to create secret file: {}", error));
    }
    let mut rocket = rocket::build()
        .mount("/app/", FileServer::from("dist"))
        .mount(
            "/api/v1/",
            openapi_get_routes![
                get_timetable,
                post_timetable,
                patch_timetable,
                delete_timetable,
                get_config,
                put_config,
                get_password,
                put_password,
            ],
        )
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
