use std::{
    fs::{read_to_string, write},
    path::Path,
};

use anyhow::Result;
use bcrypt::verify;
use rocket::{
    http::{ContentType, Status},
    serde::json::Json,
};
use rocket_okapi::openapi;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string};
use uuid::Uuid;

use crate::{auth::Password, PASSWORD_PATH, SCHOOL_PATH};

type Day = Vec<BellTime>;

#[derive(Serialize, Deserialize, Default, JsonSchema)]
pub struct BellTime {
    pub id: Uuid,
    pub name: String,
    pub hour: u8,
    pub minute: u8,
    pub location: Option<String>,
}

#[derive(Serialize, Deserialize, Default, JsonSchema)]
pub struct Link {
    pub id: Uuid,
    pub title: String,
    pub destination: String,
    pub icon: String,
}

#[derive(Serialize, Deserialize, Default, JsonSchema)]
pub struct School {
    pub name: String,
    pub bell_times: [Day; 5],
    pub links: Vec<Link>,
}

impl School {
    pub fn from_path<P: AsRef<Path>>(path: P) -> Result<Self> {
        Ok(from_str(&read_to_string(path)?)?)
    }

    pub fn save_to_path<P: AsRef<Path>>(&self, path: P) -> Result<()> {
        Ok(write(path, to_string(&self)?)?)
    }
}

#[openapi]
#[get("/school")]
pub fn get_school() -> (Status, (ContentType, String)) {
    let Ok(school) = School::from_path(SCHOOL_PATH) else {
        return (Status::NotFound, (ContentType::Any, String::new()));
    };
    to_string(&school).map_or(
        (
            Status::InternalServerError,
            (ContentType::Any, String::new()),
        ),
        |school| (Status::Ok, (ContentType::JSON, school)),
    )
}

#[openapi]
#[put("/school", data = "<new>")]
pub fn put_school(new: Json<School>, password: Password) -> Status {
    match read_to_string(PASSWORD_PATH) {
        Ok(stored) if !matches!(verify(password, &stored), Ok(true)) => {
            return Status::Unauthorized;
        }
        Err(_) => return Status::Unauthorized,
        Ok(_) => {}
    }
    if new.0.save_to_path(SCHOOL_PATH).is_err() {
        return Status::InternalServerError;
    };
    Status::Ok
}
