use std::{fs::read_to_string, path::Path};

use anyhow::Result;

use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string};
use std::fs::write;
use uuid::Uuid;

use crate::bell::Bell;

type Day = Vec<Period>;

#[derive(Serialize, Deserialize, Default, JsonSchema)]
pub struct Timetable {
    pub subjects: Vec<Subject>,
    pub timetable: [Day; 5],
}

impl Timetable {
    pub fn from_path<P: AsRef<Path>>(path: P) -> Result<Self> {
        Ok(from_str(&read_to_string(path)?)?)
    }

    pub fn save_to_path<P: AsRef<Path>>(&self, path: P) -> Result<()> {
        Ok(write(path, to_string(&self)?)?)
    }
}

#[derive(Serialize, Deserialize, JsonSchema)]
pub struct Subject {
    pub id: Uuid,
    pub notes: Vec<String>,
    pub name: String,
    pub locations: Vec<String>,
    pub color: Color,
    pub icon_name: String,
}

#[derive(Serialize, Deserialize, JsonSchema)]
pub struct Color {
    pub red: f32,
    pub green: f32,
    pub blue: f32,
}

#[derive(Serialize, Deserialize, Default, JsonSchema)]
pub struct Period {
    pub bell: Bell,
    pub subject: Option<Uuid>,
}

impl Period {
    pub const fn new(bell: Bell) -> Self {
        Self {
            bell,
            subject: None,
        }
    }
}
