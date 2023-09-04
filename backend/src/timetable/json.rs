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
pub struct School {
    pub name: String,
    pub bell_times: [Day; 5],
    pub links: Vec<String>,
}

impl School {
    pub fn from_path<P: AsRef<Path>>(path: P) -> Result<Self> {
        Ok(from_str(&read_to_string(path)?)?)
    }

    pub fn save_to_path<P: AsRef<Path>>(&self, path: P) -> Result<()> {
        Ok(write(path, to_string(&self)?)?)
    }
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
