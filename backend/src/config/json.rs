use std::{fs::read_to_string, path::Path};

use anyhow::Result;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string};
use std::fs::write;

#[derive(Serialize, Deserialize, Default, JsonSchema, Debug, Clone)]
pub struct Config {
    pub school_name: String,
    pub school_icon_path: String,
}

impl Config {
    pub fn from_path<P: AsRef<Path>>(path: P) -> Result<Self> {
        Ok(from_str(&read_to_string(path)?)?)
    }

    pub fn save_to_path<P: AsRef<Path>>(&self, path: P) -> Result<()> {
        Ok(write(path, to_string(&self)?)?)
    }
}
