pub enum Unit {
    Hour,
    Minute,
}

impl Unit {
    /// Returns `true` if the unit is [`Hour`].
    ///
    /// [`Hour`]: Unit::Hour
    #[must_use]
    pub const fn is_hour(&self) -> bool {
        matches!(self, Self::Hour)
    }

    /// Returns `true` if the unit is [`Minute`].
    ///
    /// [`Minute`]: Unit::Minute
    #[must_use]
    pub const fn is_minute(&self) -> bool {
        matches!(self, Self::Minute)
    }
}

pub struct Patch {
    pub bell_name: String,
    pub patch_unit: Unit,
    pub patch_value: u8,
}
