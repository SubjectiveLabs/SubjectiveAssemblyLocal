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
#![feature(iter_next_chunk, slice_take, file_create_new)]
mod auth;
mod school;
mod thanks;

use std::fs::{create_dir, write, File};

use anyhow::{anyhow, Result};
use rand::seq::SliceRandom;
use rocket::{fs::FileServer, http::Status, Request};
use rocket_okapi::{
    openapi_get_routes,
    swagger_ui::{make_swagger_ui, SwaggerUIConfig},
};
use serde_json::to_string;

use crate::{
    auth::{
        get_password,
        okapi_add_operation_for_get_password_,
        okapi_add_operation_for_put_password_,
        put_password,
    },
    school::{
        get_school,
        okapi_add_operation_for_get_school_,
        okapi_add_operation_for_put_school_,
        put_school,
        School,
    },
    thanks::{
        post_thanks,
        get_thanks,
        okapi_add_operation_for_post_thanks_,
        okapi_add_operation_for_get_thanks_,
    },
};

#[macro_use]
extern crate rocket;

const ERROR_MESSAGES: &[&str] = &[
    "You've taken a wrong turn.",
    "You're lost in the woods now.",
    "Uh oh, you're not supposed to be here.",
    "This is not the page you're looking for.",
    "This is awkward.",
];
const PATH: &str = "static";
const SCHOOL_PATH: &str = "static/school";
const PASSWORD_PATH: &str = "static/password";
const THANKS_PATH: &str = "static/thanks";

#[catch(default)]
fn catch_default(status: Status, request: &Request) -> String {
    let host = request.headers().get_one("host").unwrap_or("localhost");
    format!(
        "{}\n({})\nAre you looking for the Assembly dashboard? Try going to {}/app",
        ERROR_MESSAGES
            .choose(&mut rand::thread_rng())
            .unwrap_or(&"We couldn't even load an error message for this error page."),
        status,
        host
    )
}

#[main]
async fn main() -> Result<()> {
    create_dir(PATH).ok();
    if School::from_path(SCHOOL_PATH).is_err() {
        if let Err(error) = write(SCHOOL_PATH, to_string(&School::default())?) {
            return Err(anyhow!("Failed to create school file: {}", error));
        }
    }
    File::create_new(THANKS_PATH).ok();
    let mut rocket = rocket::build()
        .mount("/app/", FileServer::from("dist"))
        .mount(
            "/api/v1/",
            openapi_get_routes![
                get_school,
                put_school,
                get_password,
                put_password,
                post_thanks,
                get_thanks
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
