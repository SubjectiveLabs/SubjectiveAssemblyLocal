#![warn(clippy::pedantic, clippy::nursery)]
#![allow(clippy::no_effect_underscore_binding)]
#![feature(iter_next_chunk, slice_take)]
mod timetable;

use rand::seq::SliceRandom;
use rocket::fs::FileServer;
use std::{
    fs::{write, File},
    io::Read,
};
use timetable::{Bell, Timetable};

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
    let request = {
        let mut new = new.iter();
        let id = new.next().unwrap();
        let name_len = new.next().unwrap();
        let name =
            String::from_utf8(new.by_ref().take(*name_len as usize).copied().collect()).unwrap();
        let hours = *new.next().unwrap();
        let minutes = *new.next().unwrap();
        (
            *id,
            Bell {
                name,
                time: u16::from(hours) * 60 + u16::from(minutes),
            },
        )
    };

    let mut timetable = {
        let mut bytes = Vec::new();
        File::open("static/timetable.stt")
            .unwrap()
            .read_to_end(&mut bytes)
            .unwrap();
        Timetable::serialise(&bytes)
    };

    timetable.bells.insert(request.0, request.1);

    write("static/timetable.stt", timetable.deserialise()).unwrap();

    "done!"
}

#[patch("/timetable", data = "<new>")]
fn patch_timetable(new: &[u8]) -> &'static str {
    let update = {
        let mut new = new.iter();
        let id = new.next().unwrap();
        let name_len = new.next().unwrap();
        let name =
            String::from_utf8(new.by_ref().take(*name_len as usize).copied().collect()).unwrap();
        let (unit, time) = {
            let byte = new.next().unwrap();
            (byte >> 7, byte & (!(1 << 7)))
        };
        (*id, name, unit, time)
    };
    let mut timetable = {
        let mut bytes = Vec::new();
        File::open("static/timetable.stt")
            .unwrap()
            .read_to_end(&mut bytes)
            .unwrap();
        Timetable::serialise(&bytes)
    };

    let bell = timetable.bells.get_mut(&update.0).unwrap();
    bell.name = update.1;
    let (hours, minutes) = match update.2 {
        0 => (update.3, u8::try_from(bell.time.rem_euclid(60)).unwrap()),
        1 => (u8::try_from(bell.time.div_euclid(60)).unwrap(), update.3),
        _ => unreachable!(),
    };
    bell.time = u16::from(hours) * 60 + u16::from(minutes);

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
        .mount(
            "/api/v1/",
            routes![patch_timetable, get_timetable, post_timetable],
        )
        .register("/", catchers![not_found])
}
