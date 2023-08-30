use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// Represents a bell in the timetable.
#[derive(Deserialize, Serialize, Debug, Clone, Default, JsonSchema)]
pub struct Bell {
    pub id: Uuid,
    pub name: String,
    pub hour: u8,
    pub minute: u8,
}
