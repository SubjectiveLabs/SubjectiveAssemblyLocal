use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use crate::bell::Bell;

/// Represents a PATCH request to update a bell in the timetable.
#[derive(Deserialize, Serialize, Debug, Clone, JsonSchema)]
pub struct Patch(pub Bell);
