#![warn(clippy::pedantic, clippy::nursery, clippy::dbg_macro)]
#![allow(clippy::no_effect_underscore_binding)]
#![feature(iter_next_chunk, slice_take)]
mod patch;
mod timetable;

use patch::{Data, Patch, Time};
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
        fn bit_array_to_byte(array: [bool; 8], skip: usize) -> u8 {
            array
                .iter()
                .enumerate()
                .map(|(index, bit)| {
                    if *bit {
                        1 << (array.len() - 1 - index)
                    } else {
                        0
                    }
                })
                .skip(skip)
                .sum()
        }
        let mut new = new.iter();
        let id = new.next().unwrap();
        let next_byte = new.next().unwrap();
        let next_byte: [_; 8] = (0..8)
            .map(|index| ((next_byte >> index) & 1) == 1)
            .rev()
            .next_chunk()
            .unwrap();
        Patch {
            id: *id,
            data: match next_byte {
                [true, true, ..] => {
                    Data::Time(Time::Minute(bit_array_to_byte(next_byte, 2)))
                }
                [true, false, ..] => {
                    Data::Time(Time::Hour(bit_array_to_byte(next_byte, 2)))
                }
                [false, ..] => {
                    let name_len = bit_array_to_byte(next_byte, 1);
                    Data::Name(
                        String::from_utf8(new.by_ref().take(name_len as usize).copied().collect())
                            .unwrap(),
                    )
                }
            },
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

    let bell = timetable.bells.get_mut(&update.id).unwrap();
    match update.data {
        Data::Time(Time::Hour(hour)) => {
            bell.time = u16::from(hour) * 60 + bell.time % 60;
        }
        Data::Time(Time::Minute(minute)) => {
            bell.time = bell.time - bell.time % 60 + u16::from(minute);
        }
        Data::Name(name) => bell.name = name,
    }

    write("static/timetable.stt", timetable.deserialise()).unwrap();

    "done!"
}

#[delete("/timetable", data = "<id>")]
fn delete_timetable(id: &[u8]) -> &'static str {
    let mut timetable = {
        let mut bytes = Vec::new();
        File::open("static/timetable.stt")
            .unwrap()
            .read_to_end(&mut bytes)
            .unwrap();
        Timetable::serialise(&bytes)
    };

    timetable.bells.remove(&id[0]).unwrap();

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
            routes![
                patch_timetable,
                get_timetable,
                post_timetable,
                delete_timetable
            ],
        )
        .register("/", catchers![not_found])
}
