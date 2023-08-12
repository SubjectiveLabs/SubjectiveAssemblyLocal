pub enum Unit {
    Hour,
    Minute,
}

impl Unit {
    /// Returns `true` if the unit is [`Hour`].
    ///
    /// [`Hour`]: Unit::Hour
    #[must_use]
    pub fn is_hour(&self) -> bool {
        matches!(self, Self::Hour)
    }

    /// Returns `true` if the unit is [`Minute`].
    ///
    /// [`Minute`]: Unit::Minute
    #[must_use]
    pub fn is_minute(&self) -> bool {
        matches!(self, Self::Minute)
    }
}

pub struct Update {
    pub bell_name: String,
    pub update_unit: Unit,
    pub update_value: u8,
}
