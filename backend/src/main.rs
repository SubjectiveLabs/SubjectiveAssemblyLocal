#![allow(clippy::no_effect_underscore_binding)]
use rocket::fs::FileServer;

#[macro_use]
extern crate rocket;

#[catch(404)]
fn not_found() -> &'static str {
    "We couldn't find that page.
(404 - Not Found)"
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/api/v1/", FileServer::from("static"))
        .register("/", catchers![not_found])
}
