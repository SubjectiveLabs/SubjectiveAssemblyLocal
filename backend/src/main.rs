#![allow(clippy::no_effect_underscore_binding)]
#![feature(iter_next_chunk, slice_take)]
mod timetable;

use rand::seq::SliceRandom;
use rocket::fs::FileServer;

#[macro_use]
extern crate rocket;

const ERROR_MESSAGES: &[&str] = &[
    "At least this is better than the default 404 page.",
    "You're lost in the woods now.",
    "Uh oh, you're not supposed to be here.",
    "This is not the page you're looking for.",
    "This is awkward.",
];

#[catch(404)]
fn not_found() -> String {
    format!(
        "{}
(404 - Not Found)",
        ERROR_MESSAGES.choose(&mut rand::thread_rng()).unwrap()
    )
}

#[post("/timetable", data = "<new>")]
fn update_timetable(new: &[u8]) {
    println!("{:#?}", new);
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/app/", FileServer::from("dist"))
        .mount("/api/v1/", FileServer::from("static"))
        .mount("/api/v1/", routes![update_timetable])
        .register("/", catchers![not_found])
}
