#![warn(clippy::pedantic, clippy::nursery)]
#![allow(clippy::no_effect_underscore_binding)]
#![feature(iter_next_chunk, slice_take)]
mod timetable;
mod patch;
mod post;

use std::{
    fs::{write, File},
    io::Read,
};

use post::Post;
use rand::seq::SliceRandom;
use rocket::fs::FileServer;
use timetable::Timetable;
use patch::{Unit, Patch};

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

#[get("/timetable")]
fn get_timetable() -> Vec<u8> {
    let mut bytes = Vec::new();
    File::open("static/timetable.stt")
        .unwrap()
        .read_to_end(&mut bytes)
        .unwrap();
    bytes
}

#[post("/timetable", data = "<new>")]
fn post_timetable(new: &[u8]) -> &'static str {
    let post = {
        let mut new = new.iter();
        let name_len = new.next().unwrap();
        let name =
            String::from_utf8(new.by_ref().take(*name_len as usize).copied().collect()).unwrap();
        let hours = *new.next().unwrap();
        let minutes = *new.next().unwrap();
        Post {
            bell_name: name,
            bell_time: u16::from(hours) * 60 + u16::from(minutes),
        }
    };

    let mut timetable = {
        let mut bytes = Vec::new();
        File::open("static/timetable.stt")
            .unwrap()
            .read_to_end(&mut bytes)
            .unwrap();
        Timetable::serialise(&bytes)
    };

    timetable.timetable.insert(post.bell_name, post.bell_time);

    write("static/timetable.stt", timetable.deserialise()).unwrap();

    "done!"
}

#[patch("/timetable", data = "<new>")]
fn patch_timetable(new: &[u8]) -> &'static str {
    let update = {
        let mut new = new.iter();
        let name_len = new.next().unwrap();
        let name =
            String::from_utf8(new.by_ref().take(*name_len as usize).copied().collect()).unwrap();
        let unit = match new.next().unwrap() {
            0 => Unit::Hour,
            1 => Unit::Minute,
            _ => unreachable!(),
        };
        let value = *new.next().unwrap();
        Patch {
            bell_name: name,
            patch_unit: unit,
            patch_value: value,
        }
    };
    let mut timetable = {
        let mut bytes = Vec::new();
        File::open("static/timetable.stt")
            .unwrap()
            .read_to_end(&mut bytes)
            .unwrap();
        Timetable::serialise(&bytes)
    };

    let total_minutes = if let Some(total_minutes) = timetable.timetable.get_mut(&update.bell_name)
    {
        total_minutes
    } else {
        timetable.timetable.insert(update.bell_name.clone(), 0);
        timetable.timetable.get_mut(&update.bell_name).unwrap()
    };
    let (hours, minutes) = (
        if update.patch_unit.is_hour() {
            update.patch_value
        } else {
            u8::try_from(total_minutes.div_euclid(60)).unwrap()
        },
        if update.patch_unit.is_minute() {
            update.patch_value
        } else {
            u8::try_from(total_minutes.rem_euclid(60)).unwrap()
        },
    );
    *total_minutes = u16::from(hours) * 60 + u16::from(minutes);

    write("static/timetable.stt", timetable.deserialise()).unwrap();

    "done!"
}

#[launch]
fn rocket() -> _ {
    if File::open("static/timetable.stt").is_err() {
        write("static/timetable.stt", Timetable::default().deserialise()).unwrap();
    }
    rocket::build()
        .mount("/app/", FileServer::from("dist"))
        .mount("/api/v1/", routes![patch_timetable, get_timetable, post_timetable])
        .register("/", catchers![not_found])
}
