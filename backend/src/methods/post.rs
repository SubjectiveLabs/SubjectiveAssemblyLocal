use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use crate::bell::Bell;

/// Represents a POST request to add a bell to the timetable.
#[derive(Deserialize, Serialize, Debug, Clone, JsonSchema)]
pub struct Post {
    pub bell: Bell,
    pub day: usize,
}
