use std::{fs::read_to_string, path::Path};

use anyhow::Result;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string};
use std::fs::write;
use uuid::Uuid;

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
pub struct School {
    pub name: String,
    pub bell_times: [Day; 5],
}

impl School {
    pub fn from_path<P: AsRef<Path>>(path: P) -> Result<Self> {
        Ok(from_str(&read_to_string(path)?)?)
    }

    pub fn save_to_path<P: AsRef<Path>>(&self, path: P) -> Result<()> {
        Ok(write(path, to_string(&self)?)?)
    }
}
