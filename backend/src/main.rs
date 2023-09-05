#![warn(
    clippy::pedantic,
    clippy::nursery,
    clippy::dbg_macro,
    clippy::unwrap_used,
    clippy::expect_used
)]
#![allow(
    clippy::no_effect_underscore_binding,
    clippy::module_name_repetitions,
    clippy::needless_pass_by_value,
    clippy::ignored_unit_patterns
)]
#![feature(iter_next_chunk, slice_take)]
mod auth;
mod methods;
mod school;

use anyhow::{anyhow, Result};
use auth::{
    get_password, okapi_add_operation_for_get_password_, okapi_add_operation_for_put_password_,
    put_password,
};
use methods::school::{
    get::{get_school, okapi_add_operation_for_get_school_},
    put::{okapi_add_operation_for_put_school_, put_school},
};
use rand::seq::SliceRandom;
use rocket::{fs::FileServer, http::Status, Request};
use rocket_okapi::{
    openapi_get_routes,
    swagger_ui::{make_swagger_ui, SwaggerUIConfig},
};
use school::json::School;
use serde_json::to_string;
use std::fs::write;

#[macro_use]
extern crate rocket;

const ERROR_MESSAGES: &[&str] = &[
    "At least this is better than the default error page.",
    "You're lost in the woods now.",
    "Uh oh, you're not supposed to be here.",
    "This is not the page you're looking for.",
    "This is awkward.",
];
const SCHOOL_PATH: &str = "static/school";
const PASSWORD_PATH: &str = "static/password";

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
    if School::from_path(SCHOOL_PATH).is_err() {
        if let Err(error) = write(SCHOOL_PATH, to_string(&School::default())?) {
            return Err(anyhow!("Failed to create school file: {}", error));
        }
    }
    let mut rocket = rocket::build()
        .mount("/app/", FileServer::from("dist"))
        .mount(
            "/api/v1/",
            openapi_get_routes![
                get_school,
                put_school,
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
